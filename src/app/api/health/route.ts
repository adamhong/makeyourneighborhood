import { prisma } from "@/lib/prisma";

// Railway's deploy health check: the app is only healthy if it can reach the database.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Health check failed", error);
    return Response.json({ ok: false }, { status: 503 });
  }
}
