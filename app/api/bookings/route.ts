import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../pages/api/auth/[...nextauth]"
import prisma from "@/db"

interface BookingProps {
  roomId: string
  checkIn: string
  checkOut: string
  guestCount: string
  totalAmount: string
  totalDays: string
}

interface RefundProps {
  id: string
  status: "SUCCESS" | "CANCEL"
}

// GET: 사용자의 예약 내역 조회
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized user" },
      {
        status: 401,
      },
    )
  }

  const userId = session.user.id // 현재 로그인한 사용자의 ID
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") as string
  const page = (searchParams.get("page") as string) || "1"
  const limit = parseInt(searchParams.get("limit") as string) || 10 // 기본값으로 10 설정

  if (id) {
    // 특정 예약 ID로 예약 상세 조회
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        userId, // 로그인한 사용자의 예약만 조회
      },
      include: {
        user: true,
        room: true,
      },
    })
    return NextResponse.json(booking, {
      status: 200,
    })
  } else {
    // 예약 목록 조회
    const count = await prisma.booking.count({
      where: {
        userId, // 로그인한 사용자의 예약만 조회
      },
    })
    const skipPage = (parseInt(page) - 1) * limit

    const bookings = await prisma.booking.findMany({
      orderBy: { updatedAt: "desc" },
      where: {
        userId, // 로그인한 사용자의 예약만 조회
      },
      take: limit, // 페이지 당 예약 수
      skip: skipPage, // 페이지네이션을 위해 건너뛸 항목 수
      include: {
        user: true,
        room: true,
      },
    })

    return NextResponse.json(
      {
        page: parseInt(page),
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        data: bookings,
      },
      {
        status: 200,
      },
    )
  }
}

// POST: 예약 생성
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const formData = await req.json()
  const {
    roomId,
    checkIn,
    checkOut,
    guestCount,
    totalAmount,
    totalDays,
  }: BookingProps = formData

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized user" },
      {
        status: 401,
      },
    )
  }

  const booking = await prisma.booking.create({
    data: {
      roomId: parseInt(roomId),
      userId: session.user.id, // 로그인한 사용자의 ID
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guestCount: parseInt(guestCount),
      totalAmount: parseInt(totalAmount),
      totalDays: parseInt(totalDays),
      status: "SUCCESS",
    },
  })

  return NextResponse.json(booking, {
    status: 200,
  })
}

// PATCH: 예약 상태 수정 (취소 또는 성공 상태 업데이트)
export async function PATCH(req: Request) {
  const formData = await req.json()
  const { id, status }: RefundProps = formData
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized user",
      },
      {
        status: 401,
      },
    )
  }

  const result = await prisma.booking.update({
    where: {
      id: parseInt(id),
    },
    data: {
      status: status,
    },
  })

  return NextResponse.json(result, {
    status: 200,
  })
}
