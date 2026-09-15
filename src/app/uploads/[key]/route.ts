import { readUpload } from "@/lib/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const file = await readUpload(key);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.body, {
    headers: {
      "Content-Type": file.contentType,
      // Keys are random and never overwritten, so photos can be cached forever.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
