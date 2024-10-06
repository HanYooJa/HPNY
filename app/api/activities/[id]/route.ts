import prisma from "@/db" // Prisma 클라이언트 import
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const activityId = parseInt(params.id, 10) // URL의 id를 가져옴

  // 유효하지 않은 ID 처리
  if (!activityId) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  try {
    // Prisma를 이용하여 특정 ID의 활동을 조회
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

    // 활동 정보가 성공적으로 조회된 경우 반환
    return NextResponse.json(activity, { status: 200 })
  } catch (error) {
    // 오류 발생 시 처리
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 },
    )
  }
}
