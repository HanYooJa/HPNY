import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// 사용자 역할 조회 API 핸들러
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  // 세션이 없으면 403 상태 반환
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  }

  // 요청 URL에서 userId 가져오기
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  // userId가 없으면 400 상태 반환
  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 })
  }

  try {
    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }, // role만 선택적으로 조회
    })

    if (user) {
      // 사용자 역할 반환
      return NextResponse.json({ initialRole: user.role }, { status: 200 })
    } else {
      // 사용자가 존재하지 않으면 404 상태 반환
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching user role:", error)
    // 서버 오류 발생 시 500 상태 반환
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
