import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route" // 정확한 경로로 설정하세요
import prisma from "@/db" // 본인의 Prisma 클라이언트 파일 경로를 확인하세요

// 판매자 전환 API 핸들러
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  // 세션이 없으면 접근 불가
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  }

  console.log("현재 세션:", session) // 세션 로그
  console.log("사용자 역할:", session.user.role) // 사용자 역할 로그

  // 판매자 전환은 ADMIN 역할 또는 USER 역할의 사용자도 가능
  // 아래 조건을 수정하여 USER도 허용할 수 있도록 함
  // if (session.user.role !== "ADMIN") {
  //   return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  // }

  try {
    const { userId } = await req.json() // 요청 본문에서 userId 가져오기
    console.log("전송된 userId:", userId) // 전송된 userId 로그 추가

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
