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
    // 로컬 이미지를 위한 domains 추가
    domains: [
      "localhost", // 로컬 개발 환경에서 사용
    ],
  },
}

module.exports = nextConfig
