/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["handlebars", "bcrypt"],
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
