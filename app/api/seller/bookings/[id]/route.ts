import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// GET 요청: 판매자가 특정 예약 정보를 가져옴
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  // 세션이 없거나 판매자가 아니면 접근 불가
  if (!session?.user || session.user.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
  }

  const bookingId = params.id

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: {
        user: true,
        room: true,
      },
    })

    // 예약 정보가 없는 경우
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // 방 정보가 존재하는지 체크 후 사용자 ID 확인
    if (booking.room && booking.room.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to view this booking" },
        { status: 403 },
      )
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    console.error("Error fetching booking data:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
