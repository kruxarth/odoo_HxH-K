import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["tesseract.js", "tesseract.js-core"],
};

export default nextConfig;
