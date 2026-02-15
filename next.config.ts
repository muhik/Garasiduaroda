import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer, nextRuntime }) => {
    // Force usage of the web client for Edge Runtime to avoid XMLHttpRequest errors
    if (nextRuntime === 'edge') {
      config.resolve.alias['@libsql/client'] = '@libsql/client/web';
    }
    return config;
  },
};

export default nextConfig;
