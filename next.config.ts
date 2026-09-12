import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native SQLite driver must stay a Node.js external, not bundled.
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  experimental: {
    serverActions: {
      // The submit form can carry two photos of up to 25 MB each.
      bodySizeLimit: "55mb",
    },
  },
};

export default nextConfig;
