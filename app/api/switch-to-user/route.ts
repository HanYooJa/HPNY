import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]" // auth 경로 확인
import prisma from "@/db" // Prisma 클라이언트 파일 경로 확인

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  console.log("Current session:", session) // 디버깅용 세션 정보 출력

  // 세션이 없으면 접근 불가
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 403 })
  }

  try {
    // 현재 세션의 사용자 ID로 role을 USER로 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id }, // 세션에서 사용자 ID 가져오기
      data: { role: "USER" }, // 역할을 USER로 설정
    })

    console.log("User role updated:", updatedUser) // 디버깅용 업데이트 정보 출력

    return NextResponse.json(
      { message: "User successfully switched to regular user role." },
      { status: 200 },
    )
  } catch (error) {
    console.error("Failed to switch user role:", error) // 에러 로그 출력
    return NextResponse.json(
      { error: `Failed to switch user role: ${(error as Error).message}` },
      { status: 500 },
    )
  }
}
