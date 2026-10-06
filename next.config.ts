import type { NextConfig } from "next";

// `EXPORT_PATH=/prototypes/search-trigger next build` writes a static copy to
// out/ for the portfolio to serve at that path. Dev and normal builds skip it.
const basePath = process.env.EXPORT_PATH;

const nextConfig: NextConfig = basePath
  ? { output: "export", basePath, trailingSlash: true }
  : {};

export default nextConfig;
