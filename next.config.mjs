/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    // Mete el CSS (~10 KB) dentro del HTML: la página se pinta sin esperar
    // una segunda descarga.
    inlineCss: true,
  },
};

export default nextConfig;
