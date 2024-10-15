import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/db"

// 찜한 숙소 및 활동 가져오기
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || "1"
  const limit = searchParams.get("limit") || "10"
  const skipPage = (parseInt(page) - 1) * parseInt(limit)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  try {
    // 찜한 숙소와 활동의 총 개수
    const count = await prisma.like.count({
      where: {
        userId: session.user.id,
      },
    })

    // 찜한 숙소와 활동 정보 가져오기
    const likes = await prisma.like.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        room: true,
        activity: true,
      },
      skip: skipPage,
      take: parseInt(limit),
    })

    return NextResponse.json({
      page: parseInt(page),
      data: likes,
      totalCount: count,
      totalPage: Math.ceil(count / parseInt(limit)),
    })
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 },
    )
  }
}

// 찜하기 추가 및 삭제
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  const formData = await req.json()
  const { roomId, activityId } = formData

  if (!roomId && !activityId) {
    return NextResponse.json(
      { error: "Room ID or Activity ID is required" },
      { status: 400 },
    )
  }

  try {
    // Like 데이터가 있는지 확인
    let like = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        roomId,
        activityId,
      },
    })

    if (like) {
      // 이미 찜을 한 상황이므로, 삭제하기
      like = await prisma.like.delete({
        where: {
          id: like.id,
        },
      })

      return NextResponse.json(like, { status: 200 })
    } else {
      // 찜을 하지 않았으므로, 생성하기
      like = await prisma.like.create({
        data: {
          roomId,
          activityId,
          userId: session.user.id,
        },
      })

      return NextResponse.json(like, { status: 201 })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 },
    )
  }
}
