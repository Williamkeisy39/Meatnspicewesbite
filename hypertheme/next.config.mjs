/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: ".next",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@valebytes/topduka-node"],
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
}

export default nextConfig
