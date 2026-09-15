import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Photos are stored in an S3-compatible bucket (Supabase Storage, Cloudflare R2,
// AWS S3) when S3_BUCKET is set, and in a local folder otherwise. Either way
// they're served by the app at /uploads/<key> (src/app/uploads/[key]/route.ts),
// so stored URLs don't depend on the storage provider.

const MAX_BYTES = 25 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const CONTENT_TYPES = Object.fromEntries(Object.entries(EXTENSIONS).map(([type, ext]) => [ext, type]));
const KEY_PATTERN = /^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/;

const BUCKET = process.env.S3_BUCKET;
const LOCAL_DIR = path.join(process.cwd(), ".uploads");

let s3Client: S3Client | undefined;
function s3() {
  s3Client ??= new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? "auto",
    // Supabase Storage requires path-style URLs; R2 and S3 accept them.
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
  });
  return s3Client;
}

async function saveFile(key: string, bytes: Uint8Array, contentType: string) {
  if (BUCKET) {
    await s3().send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: contentType }));
    return;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("S3_BUCKET is not set: refusing to store uploads on the container's disk.");
  }
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_DIR, key), bytes);
}

export class ImageUploadError extends Error {}

/**
 * Reads an image field from the submit form. The form sends `${field}Mode`
 * ("upload" | "link"), plus `${field}File` or `${field}Url`.
 * Returns a URL to store, or null when nothing was provided.
 */
export async function resolveImage(formData: FormData, field: string): Promise<string | null> {
  if (formData.get(`${field}Mode`) === "link") {
    const raw = formData.get(`${field}Url`);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) return null;
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new ImageUploadError("That image link doesn't look like a valid URL.");
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new ImageUploadError("Image links must start with http:// or https://.");
    }
    return url.toString();
  }

  const file = formData.get(`${field}File`);
  if (!(file instanceof File) || file.size === 0) return null;

  const extension = EXTENSIONS[file.type];
  if (!extension) throw new ImageUploadError("Please upload a JPG, PNG, WebP, or GIF image.");
  if (file.size > MAX_BYTES) throw new ImageUploadError("Images must be 25 MB or smaller.");

  const key = `${randomUUID()}.${extension}`;
  try {
    await saveFile(key, new Uint8Array(await file.arrayBuffer()), file.type);
  } catch (error) {
    console.error("Photo upload failed", error);
    throw new ImageUploadError("We couldn't save that photo. Try again, or paste an image link instead.");
  }
  return `/uploads/${key}`;
}

/** Loads a stored photo by key, or null if the key is invalid or missing. */
export async function readUpload(key: string): Promise<{ body: BodyInit; contentType: string } | null> {
  const match = KEY_PATTERN.exec(key);
  if (!match) return null;
  const contentType = CONTENT_TYPES[match[1]];

  if (BUCKET) {
    try {
      const object = await s3().send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      if (!object.Body) return null;
      return { body: object.Body.transformToWebStream(), contentType };
    } catch (error) {
      if (error instanceof NoSuchKey) return null;
      throw error;
    }
  }

  try {
    return { body: new Uint8Array(await readFile(path.join(LOCAL_DIR, key))), contentType };
  } catch {
    return null;
  }
}
