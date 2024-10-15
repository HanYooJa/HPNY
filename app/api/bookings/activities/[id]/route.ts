import { NextResponse } from "next/server"
import prisma from "@/db"

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        user: true,
        activity: {
          select: {
            id: true,
            title: true,
            images: true,
            comments: true,
          },
        },
      },
    })

    // 예약이 없는 경우
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // 이미지가 없는 경우 기본 이미지를 설정
    if (
      booking.activity &&
      (!booking.activity.images || booking.activity.images.length === 0)
    ) {
      booking.activity.images = ["/images/default-image.png"]
    }

    // 예약 정보 반환
    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    console.error("Error fetching booking data:", error)
    return NextResponse.json(
      { error: "Error fetching booking data" },
      { status: 500 },
    )
  }
}
