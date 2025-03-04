import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tokyolife.vn",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "hcm.fstorage.vn",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
