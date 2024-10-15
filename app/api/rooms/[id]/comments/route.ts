import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// 숙소 댓글 조회 핸들러 (GET)
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const roomId = parseInt(params.id) // 숙소 ID

  // 댓글을 데이터베이스에서 조회
  const comments = await prisma.comment.findMany({
    where: { roomId: roomId },
    include: { user: true }, // 댓글 작성자 정보 포함
  })

  return NextResponse.json(comments, { status: 200 })
}

// 숙소 댓글 작성 핸들러 (POST)
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params // 숙소 ID
  const body = await req.json() // 요청 본문에서 댓글 내용 가져오기

  // 현재 세션 정보 가져오기 (로그인된 사용자)
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 댓글을 데이터베이스에 저장
  const comment = await prisma.comment.create({
    data: {
      roomId: parseInt(id), // roomId 설정
      body: body.body, // 댓글 내용
      userId: session.user.id, // 로그인한 사용자 ID
    },
  })

  return NextResponse.json(comment, { status: 200 })
}
