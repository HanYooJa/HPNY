// app/api/rooms/[id]/view/route.ts
import { NextRequest, NextResponse } from "next/server"
import db from "@/db" // 데이터베이스 연결

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const roomId = params.id

  try {
    // 조회수 증가
    const room = await db.room.update({
      where: { id: Number(roomId) },
      data: { views: { increment: 1 } }, // 조회수 1 증가
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