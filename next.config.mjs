/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Specify the base path if your repository name is not the same as the GitHub Pages URL
  basePath: '/invoice-ai',
};

export default nextConfig;
