import prisma from "@/db" // Prisma 클라이언트 import
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const activityId = parseInt(params.id, 10) // URL의 id를 가져옴

  // 유효하지 않은 ID 처리
  if (isNaN(activityId) || activityId <= 0) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    // 활동 데이터 조회
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        user: true, // 호스트 정보 포함
        comments: true, // 활동 댓글 정보 포함
        bookings: true, // 활동 예약 정보 포함
      },
    })

    // 활동이 없을 경우 처리
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    // 조회수 증가 (views가 null인 경우 0으로 설정)
    await prisma.activity.update({
      where: { id: activityId },
      data: { views: (activity.views || 0) + 1 }, // 조회수 증가
    })

    return NextResponse.json(activity, { status: 200 }) // 활동 데이터 반환
  } catch (error) {
    console.error("Error fetching activity:", error) // 에러 로깅
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 },
    )
  }
}
