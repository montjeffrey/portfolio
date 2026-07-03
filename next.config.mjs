/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so Next doesn't pick up a stray parent lockfile
  // (e.g. C:\Users\colom\package-lock.json) as the inferred root.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;

