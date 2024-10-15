import { NextResponse } from "next/server"
import prisma from "@/db"

// 이달의 예약된 활동(Top 5) 데이터를 가져오는 API
export async function GET() {
  try {
    const topBookedActivities = await prisma.activity.findMany({
      orderBy: {
        bookings: {
          _count: "desc", // 예약 횟수 기준으로 내림차순 정렬
        },
      },
      take: 5, // 상위 5개만 가져오기
      include: {
        bookings: true, // 예약 수 확인을 위해 bookings 포함
      },
    })

    return NextResponse.json({ data: topBookedActivities }, { status: 200 })
  } catch (error) {
    console.error("Error fetching top booked activities:", error)
    return NextResponse.json(
      { error: "Error fetching top booked activities" },
      { status: 500 },
    )
  }
}
