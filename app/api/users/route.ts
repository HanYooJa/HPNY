import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// 사용자 정보 가져오기
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  // 세션이 없으면 401 상태 반환
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  try {
    const data = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        accounts: true,
      },
    })

    // 사용자 데이터 반환
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    )
  }
}

// 사용자 정보 업데이트
export async function PUT(req: Request) {
  const formData = await req.json()
  const session = await getServerSession(authOptions)

  // 세션이 없으면 401 상태 반환
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  try {
    const result = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: { ...formData },
    })

    // 업데이트된 사용자 데이터 반환
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 },
    )
  }
}
