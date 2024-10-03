import { NextRequest, NextResponse } from "next/server"
import db from "@/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const roomId = params.id

  try {
    const room = await db.room.findUnique({
      where: { id: Number(roomId) },
      select: {
        id: true,
        title: true,
        images: true,
        views: true, // 조회수 필드 포함
        category: true,
        price: true,
        lat: true, // 위도 추가
        lng: true, // 경도 추가
        // 필요한 다른 필드들도 포함하세요
      },
    })

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error fetching room data:", error)
    return NextResponse.json(
      { message: "Failed to fetch room data" },
      { status: 500 },
    )
  }
}
