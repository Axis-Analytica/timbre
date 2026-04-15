import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "/api/serve-image/:path*",
      },
    ];
  },
};

export default nextConfig;
