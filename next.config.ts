import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mheiyacdvmrsfltedeso.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'gabonmanagementservices.ga',
        port: '',
        pathname: '/supabase-proxy/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'supabasekong-jogsccg0sssscso4c4gw84gs.130.185.118.198.sslip.io',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/supabase-proxy/:path*',
        destination: 'http://supabasekong-jogsccg0sssscso4c4gw84gs.130.185.118.198.sslip.io/:path*',
      },
    ]
  },
};

export default nextConfig;
