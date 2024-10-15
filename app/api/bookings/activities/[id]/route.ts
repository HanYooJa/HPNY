import { NextResponse } from "next/server"
import prisma from "@/db" // 데이터베이스 설정 가져오기

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 활동 예약 정보를 가져옴
    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(params.id), // 예약 ID로 조회
      },
      include: {
        user: true, // 예약한 사용자 정보 포함
        activity: {
          select: {
            id: true,
            title: true,
            images: true, // String[] 타입인 images 필드 선택
            comments: true, // 활동과 연결된 후기 정보 포함
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
      booking.activity.images = ["/images/default-image.png"] // 기본 이미지 경로
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
