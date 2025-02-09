import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        electron: false,
      };
    }
    config.module.rules.push({
      test: /\.css$/,
      use: ["postcss-loader"], // ✅ Ensure Tailwind works in standalone mode
    });
    return config;
  },
  
};

export default nextConfig;
