import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// GET: 사용자의 숙소 및 활동 예약 내역 조회
export async function GET(req: Request) {
  console.log("GET /api/bookings called")
  const session = await getServerSession(authOptions)

  // 사용자가 인증되지 않았을 경우
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const page = searchParams.get("page") || "1"
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const count = await prisma.booking.count({
      where: { userId },
    })

    const skipPage = (parseInt(page) - 1) * limit

    // 예약 내역 조회
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: skipPage,
      include: {
        room: true,
        activity: true,
      },
    })

    // 예약 내역이 없을 경우
    if (!bookings.length) {
      return NextResponse.json({ message: "예약이 없습니다." }, { status: 200 })
    }

    // 응답으로 예약 내역, 페이지 정보 반환
    return NextResponse.json(
      {
        page: parseInt(page, 10),
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        data: bookings,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    )
  }
}

// POST: 숙소 또는 활동 예약 생성
export async function POST(req: Request) {
  console.log("POST /api/bookings called")
  const session = await getServerSession(authOptions)

  // 인증되지 않은 사용자의 경우 오류 반환
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  const formData = await req.json()

  const {
    roomId,
    activityId,
    checkIn,
    checkOut,
    guestCount,
    totalAmount,
    totalDays,
  } = formData

  // roomId 또는 activityId가 제공되지 않으면 오류 반환
  if (!roomId && !activityId) {
    return NextResponse.json(
      { error: "Room ID or Activity ID is required" },
      { status: 400 },
    )
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        roomId: roomId ? parseInt(roomId) : undefined,
        activityId: activityId ? parseInt(activityId) : undefined,
        userId: session.user.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guestCount: parseInt(guestCount),
        totalAmount: parseInt(totalAmount),
        totalDays: parseInt(totalDays),
        status: "PENDING",
      },
    })

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    )
  }
}
