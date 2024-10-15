import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// 숙소 댓글 조회 핸들러 (GET)
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const roomId = parseInt(params.id)

  const comments = await prisma.comment.findMany({
    where: { roomId: roomId },
    include: { user: true },
  })

  return NextResponse.json(comments, { status: 200 })
}

// 숙소 댓글 작성 핸들러 (POST)
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const body = await req.json()

  // 현재 세션 정보 가져오기 (로그인된 사용자)
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 댓글을 데이터베이스에 저장
  const comment = await prisma.comment.create({
    data: {
      roomId: parseInt(id),
      body: body.body,
      userId: session.user.id,
    },
  })

  return NextResponse.json(comment, { status: 200 })
}
