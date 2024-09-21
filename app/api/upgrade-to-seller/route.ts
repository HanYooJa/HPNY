import { NextResponse } from "next/server"
import prisma from "@/db"

// 판매자 전환 API 핸들러
export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 },
      )
    }

    // 판매자로 업그레이드하는 함수 호출
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "SELLER" },
    })

    // 사용자가 존재하지 않을 경우
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json(
      { message: "User upgraded to Seller successfully." },
      { status: 200 },
    )
  } catch (error) {
    console.error("Failed to upgrade user to seller:", error)
    return NextResponse.json(
      {
        error: `Failed to upgrade user to seller: ${(error as Error).message}`,
      },
      { status: 500 },
    )
  }
}
