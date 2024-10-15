// app/api/seller/activities/bookings/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db" // 본인의 Prisma 클라이언트 파일 경로를 확인하세요

// GET 요청: 판매자의 활동 예약 내역을 가져옴
export async function GET(req: Request) {
  // 현재 세션을 가져옴
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
  const page = searchParams.get("page") || "1" // 요청된 페이지 번호
  const limit = searchParams.get("limit") || "5" // 한 페이지당 보여줄 예약 수
  const sellerId = session.user.id // 현재 로그인된 판매자의 ID

  const skipPage = (parseInt(page) - 1) * parseInt(limit)

  try {
    // 판매자가 등록한 활동의 예약 내역을 가져옴
    const bookings = await prisma.booking.findMany({
      orderBy: { updatedAt: "desc" }, // 업데이트된 날짜를 기준으로 정렬
      where: {
        activity: {
          userId: sellerId, // activity의 userId가 현재 판매자의 ID인 경우에만 조회
        },
      },
      take: parseInt(limit), // 페이지당 보여줄 예약 수
      skip: skipPage, // 페이지네이션을 위해 건너뛸 항목 수
      include: {
        user: true, // 예약한 사용자 정보 포함
        activity: true, // 예약된 활동 정보 포함
      },
    })

    return NextResponse.json(
      {
        page: parseInt(page),
        data: bookings, // 가져온 예약 내역 데이터
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    // 오류가 발생할 경우 에러 응답
    console.error("Error fetching seller activity bookings:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      },
    )
  }
}
