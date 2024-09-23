import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/db"

// 판매자 전환 API 핸들러
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  // 세션이 없으면 접근 불가
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  }

  console.log("현재 세션:", session) // 세션 로그
  console.log("사용자 역할:", session.user.role) // 사용자 역할 로그

  // 사용자 역할이 USER인지 체크
  if (session.user.role !== "USER") {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  }

  try {
    const { userId } = await req.json() // 요청 본문에서 userId 가져오기
    console.log("전송된 userId:", userId) // 전송된 userId 로그 추가

    // userId가 undefined인지 체크
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 },
      )
    }

    // userId가 문자열인지 체크
    if (typeof userId !== "string") {
      return NextResponse.json(
        { error: "User ID must be a string." },
        { status: 400 },
      )
    }

    // 사용자 존재 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    // userId가 문자열임을 보장하고 역할 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "SELLER" },
    })

    console.log("업데이트된 사용자 정보:", updatedUser) // 업데이트된 사용자 정보 로그

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
