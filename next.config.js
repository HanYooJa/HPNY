/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 개발 환경에서 useEffect 중복 실행 방지

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
    ],
  },
}

module.exports = nextConfig
