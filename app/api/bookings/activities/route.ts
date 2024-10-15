import { NextResponse } from "next/server"
import prisma from "@/db" // 데이터베이스 설정 가져오기
import { getServerSession } from "next-auth" // 세션 정보 가져오기
import { authOptions } from "@/pages/api/auth/[...nextauth]" // 인증 옵션 가져오기

// GET 요청: 사용자가 등록한 활동의 예약 리스트를 가져옴
export async function GET(req: Request) {
  const session = await getServerSession(authOptions) // 세션 정보 가져오기
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  const userId = session.user.id // 사용자 ID

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "5")

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        activity: {
          userId: userId, // 활동의 판매자 ID로 필터링
        },
      },
      include: {
        user: true, // 예약한 사용자 정보 포함
        activity: {
          select: {
            id: true,
            title: true,
            images: true, // String[] 타입인 images 필드 선택
          },
        },
      },
      skip: (page - 1) * limit, // 페이지네이션
      take: limit, // 페이지당 데이터 수
    })

    if (!bookings.length) {
      return NextResponse.json(
        { message: "No bookings found" },
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
  const session = await getServerSession(authOptions) // 세션 정보 가져오기
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

  // activityId 유효성 검사
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
        userId: session.user.id, // 로그인한 사용자 ID
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guestCount: parseInt(guestCount),
        totalAmount: parseInt(totalAmount),
        totalDays: parseInt(totalDays),
        status: "SUCCESS", // 예약 상태를 SUCCESS로 설정
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
