import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "app://electron" }, // Allow Electron app only
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        electron: false,
        path: false, // ✅ Prevents Next.js from bundling Electron-incompatible modules
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
