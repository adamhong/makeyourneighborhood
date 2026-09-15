import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg(
    {
      connectionString: process.env.DATABASE_URL,
      // Fail fast instead of hanging if the database is unreachable
      // (free-tier databases can take a few seconds to wake up).
      connectionTimeoutMillis: 15_000,
    },
    { onPoolError: (error) => console.error("Postgres pool error", error) },
  );
  return new PrismaClient({ adapter });
}

// Reuse one client across hot reloads in development.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
