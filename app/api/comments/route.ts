import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// GET 핸들러: 댓글 목록 조회
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get("roomId")
  const activityId = searchParams.get("activityId")
  const limit = searchParams.get("limit") || "10"
  const page = searchParams.get("page") || "1"
  const my = searchParams.get("my") === "true" // 'my' 쿼리 파라미터로 필터링 여부 결정

  const session = await getServerSession(authOptions)

  const count = await prisma.comment.count({
    where: {
      ...(my && session?.user?.id ? { userId: session.user.id } : {}), // 'my'가 true일 때만 본인 댓글 조회
      ...(roomId ? { roomId: parseInt(roomId) } : {}),
      ...(activityId ? { activityId: parseInt(activityId) } : {}),
    },
  })

  const skipPage = (parseInt(page) - 1) * parseInt(limit)
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      ...(my && session?.user?.id ? { userId: session.user.id } : {}), // 'my'가 true일 때만 본인 댓글 조회
      ...(roomId ? { roomId: parseInt(roomId) } : {}),
      ...(activityId ? { activityId: parseInt(activityId) } : {}),
    },
    take: parseInt(limit),
    skip: skipPage,
    include: {
      user: true,
    },
  })

  return NextResponse.json({
    page: parseInt(page),
    data: comments,
    totalCount: count,
    totalPage: Math.ceil(count / parseInt(limit)),
  })
}
