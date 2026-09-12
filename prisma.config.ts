import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Same default as src/lib/prisma.ts, so deploys without a .env still work.
    url: process.env["DATABASE_URL"] ?? "file:./prisma/dev.db",
  },
});
