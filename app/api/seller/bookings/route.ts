import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// GET 요청: 판매자의 숙소 예약 내역을 가져옴
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  // 세션이 없거나 판매자가 아니면 접근 불가
  if (!session?.user || session.user.role !== "SELLER") {
    return NextResponse.json(
      { error: "Unauthorized access" },
      {
        status: 401,
      },
    )
  }

  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || "1"
  const limit = searchParams.get("limit") || "5" // 한 페이지당 보여줄 예약 수
  const sellerId = session.user.id

  const skipPage = (parseInt(page) - 1) * parseInt(limit)

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { updatedAt: "desc" }, // 업데이트된 날짜를 기준으로 정렬
      where: {
        room: {
          userId: sellerId, // room의 userId가 현재 판매자의 ID인 경우에만 조회
        },
      },
      take: parseInt(limit),
      skip: skipPage,
      include: {
        user: true,
        room: true,
      },
    })

    return NextResponse.json(
      {
        page: parseInt(page),
        data: bookings,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error fetching seller bookings:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      },
    )
  }
}
