import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string // role 속성 추가
      permissions?: string[] // 추가: permissions 속성
      initialRole?: string // 추가: initialRole 속성
      isSeller?: boolean // 추가: isSeller 속성
    }
    accessToken?: string // accessToken 속성 추가
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string // role 속성 추가
    permissions?: string[] // 추가: permissions 속성
    initialRole?: string // 추가: initialRole 속성
    isSeller?: boolean // 추가: isSeller 속성
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string | null
    email?: string | null
    picture?: string | null
    role?: string // role 속성 추가
    permissions?: string[] // 추가: permissions 속성
    initialRole?: string // 추가: initialRole 속성
    isSeller?: boolean // 추가: isSeller 속성
    accessToken?: string // accessToken 속성 추가
  }
}
