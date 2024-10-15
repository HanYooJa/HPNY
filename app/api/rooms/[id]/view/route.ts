import { NextRequest, NextResponse } from "next/server"
import db from "@/db"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const roomId = params.id

  try {
    const room = await db.room.update({
      where: { id: Number(roomId) },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(room, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "조회수 업데이트에 실패했습니다." },
      { status: 500 },
    )
  }
}
