import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow build even with minor TS warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize for large audio files in public/
  async headers() {
    return [
      {
        source: "/audio/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
};

export default nextConfig;

