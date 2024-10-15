import { NextResponse } from "next/server"
import prisma from "@/db"

// 예약 많은 순으로 숙소 가져오기
export async function GET() {
  try {
    // 상위 5개의 숙소를 예약 수 순으로 정렬하여 가져옴
    const rooms = await prisma.room.findMany({
      take: 5, // 상위 5개의 숙소만 가져옴
      orderBy: {
        bookings: {
          _count: "desc", // 예약 많은 순으로 정렬
        },
      },
      select: {
        id: true,
        title: true,
        images: true,
        bookings: {
          select: {
            id: true,
          },
        },
      },
    })

    // images 배열에서 첫 번째 이미지를 대표 이미지로
    const roomsWithImageUrl = rooms.map((room) => ({
      ...room,
      imageUrl: room.images.length > 0 ? room.images[0] : "/default-image.jpg",
    }))

    return NextResponse.json({
      data: roomsWithImageUrl,
    })
  } catch (error) {
    console.error("Error fetching top booked rooms:", error)
    return NextResponse.json(
      { message: "Failed to fetch top booked rooms" },
      { status: 500 },
    )
  }
}
