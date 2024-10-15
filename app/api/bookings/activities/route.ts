import { NextResponse } from "next/server"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

// GET 요청: 사용자가 등록한 활동의 예약 리스트를 가져옴
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  const userId = session.user.id

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "5")

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        activity: {
          userId: userId,
        },
      },
      include: {
        user: true,
        activity: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    if (!bookings.length) {
      return NextResponse.json(
        { message: "예약을 찾을 수 없습니다." },
        { status: 404 },
      )
    }

    return NextResponse.json(bookings, { status: 200 })
  } catch (error) {
    console.error("Error fetching booking data:", error)
    return NextResponse.json(
      { error: "Error fetching booking data" },
      { status: 500 },
    )
  }
}

// POST 요청: 새로운 활동 예약 생성
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const formData = await req.json()

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized user" },
      {
        status: 401,
      },
    )
  }

  const { activityId, checkIn, checkOut, guestCount, totalAmount, totalDays } =
    formData

  if (!activityId) {
    return NextResponse.json(
      { error: "Activity ID is required" },
      {
        status: 400,
      },
    )
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        activityId: parseInt(activityId),
        userId: session.user.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guestCount: parseInt(guestCount),
        totalAmount: parseInt(totalAmount),
        totalDays: parseInt(totalDays),
        status: "SUCCESS",
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
