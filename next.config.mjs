/** @type {import('next').NextConfig} */
const backendBaseUrl = (process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '').replace(/\/$/, '');

const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BACKEND_BASE_URL: backendBaseUrl,
  },
  async rewrites() {
    if (!backendBaseUrl) return [];
    return [
      { source: '/api/:path*', destination: `${backendBaseUrl}/api/:path*` },
      { source: '/v1/:path*', destination: `${backendBaseUrl}/v1/:path*` },
      { source: '/v1', destination: `${backendBaseUrl}/v1` },
      { source: '/codex/:path*', destination: `${backendBaseUrl}/api/v1/responses` },
    ];
  },
};

export default nextConfig;
