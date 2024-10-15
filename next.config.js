/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        hostname: "loremflickr.com",
      },
      {
        hostname: "firebasestorage.googleapis.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "img1.kakaocdn.net",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "phinf.pstatic.net",
      },
    ],

    domains: ["localhost"],
  },
}

module.exports = nextConfig
