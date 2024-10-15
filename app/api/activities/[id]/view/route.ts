import { NextRequest, NextResponse } from "next/server"
import db from "@/db"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const activityId = params.id

  try {
    const activity = await db.activity.update({
      where: { id: Number(activityId) },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(activity, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "조회수 업데이트에 실패했습니다." },
      { status: 500 },
    )
  }
}
