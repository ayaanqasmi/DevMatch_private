import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_API_URL: 'http://localhost:4000', // Replace with your backend URL
  },
};

export default nextConfig;
