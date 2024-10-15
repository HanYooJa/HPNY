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
        officeSpace: true, // 추가
        hasMountainView: true, // 추가
        hasShampoo: true, // 추가
        hasFreeLaundry: true, // 추가
        hasAirConditioner: true, // 추가
        hasWifi: true, // 추가
        hasBarbeque: true, // 추가
        hasFreeParking: true, // 추가
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

    // 조회수 증가
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
