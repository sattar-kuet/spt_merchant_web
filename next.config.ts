import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Always revalidate pages so a normal reload picks up a new deploy.
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image).*)",
        headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
