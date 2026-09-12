import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Local-dev storage: files land in public/uploads and are served statically.
// Swap this module for object storage (S3, R2, ...) when deploying.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 25 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}
