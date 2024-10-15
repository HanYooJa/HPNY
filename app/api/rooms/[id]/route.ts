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
        views: true,
        category: true,
        price: true,
        lat: true,
        lng: true,
        freeCancel: true,
        selfCheckIn: true,
        desc: true,
        bedroomDesc: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            desc: true,
          },
        },
      },
    })

    // room 데이터가 없는 경우 처리
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 })
    }

    await db.room.update({
      where: { id: Number(roomId) },
      data: {
        views: room.views + 1,
      },
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error fetching room data:", error)
    return NextResponse.json(
      { message: "Failed to fetch room data" },
      { status: 500 },
    )
  }
}
