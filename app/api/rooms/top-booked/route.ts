import { NextResponse } from "next/server"
import prisma from "@/db"

// 예약 많은 순으로 숙소 가져오기
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      take: 5, // 상위 5개의 숙소를 가져옴
      orderBy: {
        bookings: {
          _count: "desc", // 예약 많은 순으로 정렬
        },
      },
      select: {
        id: true,
        title: true,
        images: true, // 이미지 배열 가져오기
        bookings: {
          select: {
            id: true, // 예약 정보 선택
          },
        },
      },
    })

    // images 배열에서 첫 번째 이미지를 대표 이미지로 설정
    const roomsWithImageUrl = rooms.map((room) => ({
      ...room,
      imageUrl: room.images.length > 0 ? room.images[0] : "/default-image.jpg", // 대표 이미지 설정
    }))

    return NextResponse.json({
      data: roomsWithImageUrl,
    })
  } catch (error) {
    return NextResponse.error()
  }
}
