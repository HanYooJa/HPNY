import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route" // auth 경로를 정확하게 설정하세요
import prisma from "@/db" // Prisma 클라이언트 파일 경로를 확인하세요

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  // 세션이 없으면 접근 불가
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  }

  // 모든 사용자에게 사용자로 전환을 허용
  // session.user.role이 'SELLER'일 때만 허용할 필요 없음
  try {
    // 현재 세션의 사용자 ID로 role을 USER로 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "USER" },
    })

    return NextResponse.json(
      { message: "User successfully switched to regular user role." },
      { status: 200 },
    )
  } catch (error) {
    console.error("Failed to switch user role:", error)
    return NextResponse.json(
      { error: `Failed to switch user role: ${(error as Error).message}` },
      { status: 500 },
    )
  }
}
