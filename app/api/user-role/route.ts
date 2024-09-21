import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route" // authOptions 경로를 확인하세요
import prisma from "@/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions) // 세션 확인
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (user) {
      return NextResponse.json({ initialRole: user.role }, { status: 200 })
    } else {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching user role:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
