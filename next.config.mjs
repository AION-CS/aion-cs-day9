/** @type {import('next').NextConfig} */

// Optional sub-folder hosting, e.g. NEXT_PUBLIC_BASE_PATH=/retention-lab-day1
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,

  // A plain static site: the host needs no Next.js runtime, and once loaded the
  // site works offline (no external fonts, CDNs or fetches).
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
