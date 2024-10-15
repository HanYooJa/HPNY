import { NextResponse } from "next/server"
import prisma from "@/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

// 활동 댓글 조회 핸들러 (GET)
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const activityId = parseInt(params.id)

  const comments = await prisma.comment.findMany({
    where: { activityId },
    include: { user: true },
    orderBy: { createdAt: "desc" }, // 최신순으로 정렬
  })

  const totalCount = await prisma.comment.count({
    where: { activityId },
  })

  return NextResponse.json(
    {
      totalCount,
      data: comments,
    },
    { status: 200 },
  )
}

// 활동 댓글 작성 핸들러 (POST)
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const body = await req.json()

  // 현재 세션 정보 가져오기
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 댓글 저장
  const comment = await prisma.comment.create({
    data: {
      activityId: parseInt(id),
      body: body.body,
      userId: session.user.id,
    },
  })

  return NextResponse.json(comment, { status: 200 })
}
