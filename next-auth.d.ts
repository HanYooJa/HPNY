import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      permissions?: string[]
      initialRole?: string
      isSeller?: boolean
    }
    accessToken?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    permissions?: string[]
    initialRole?: string
    isSeller?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string | null
    email?: string | null
    picture?: string | null
    role?: string
    permissions?: string[]
    initialRole?: string
    isSeller?: boolean
    accessToken?: string
  }
}
