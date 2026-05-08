/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://player.vimeo.com https://vimeo.com https://pub-aba1844bd21f4ec0b72735c6f51f94c9.r2.dev https://youtube.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;