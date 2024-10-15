import { NextResponse } from "next/server"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

// GET 방식으로 특정 예약 상세 조회
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
  }

  const bookingId = parseInt(params.id)

  if (isNaN(bookingId)) {
    return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        room: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            category: true,
            comments: true,
            freeCancel: true,
          },
        },
        activity: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            comments: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
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

// PATCH: 예약 상태 업데이트
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
  }

  const bookingId = parseInt(params.id)
  const { status } = await req.json()

  // 상태가 유효한지 확인 (PENDING, SUCCESS, CANCEL 중 하나)
  const validStatuses = ["PENDING", "SUCCESS", "CANCEL"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    return NextResponse.json(updatedBooking, { status: 200 })
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 },
    )
  }
}
