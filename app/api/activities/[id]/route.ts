import prisma from "@/db"
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
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        user: true,
        comments: true,
        bookings: true,
      },
    })

    // 활동이 없을 경우
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    await prisma.activity.update({
      where: { id: activityId },
      data: { views: (activity.views || 0) + 1 },
    })

    return NextResponse.json(activity, { status: 200 })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 },
    )
  }
}
