import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// 판매자 전환 API 핸들러
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 },
      )
    }

    console.log("현재 세션:", session)
    console.log("사용자 역할:", session.user.role)

    if (session.user.role === "SELLER") {
      return NextResponse.json(
        { error: "User is already a SELLER." },
        { status: 400 },
      )
    }

    const userId = session.user.id

    // 역할을 SELLER로 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "SELLER" },
    })

    console.log("업데이트된 사용자 정보:", updatedUser)

    return NextResponse.json(
      { message: "성공적으로 업그레이드했습니다.", user: updatedUser },
      { status: 200 },
    )
  } catch (error) {
    console.error("업그레이드에 실패했습니다.:", error)
    return NextResponse.json(
      {
        error: `Failed to upgrade user to seller: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
