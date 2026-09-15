import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // The submit form can carry two photos of up to 25 MB each.
      bodySizeLimit: "55mb",
    },
  },
};

export default nextConfig;
