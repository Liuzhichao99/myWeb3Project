import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api-backend1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // 后端服务地址
      },
    ];
  },
};

export default nextConfig;
