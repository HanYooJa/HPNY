import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      image?: string
      role?: string // role 속성 추가
      permissions?: string[] // 추가: permissions 속성
    }
  }

  // User 인터페이스도 확장하여 role을 포함하도록 합니다.
  interface User {
    id: string
    name?: string
    email?: string
    image?: string
    role?: string // role 속성 추가
    permissions?: string[] // 추가: permissions 속성
  }
}
