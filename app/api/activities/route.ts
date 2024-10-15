import prisma from "@/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import axios from "axios"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") as string
  const limit = (searchParams.get("limit") as string) || "10"
  const id = searchParams.get("id") as string
  const my = searchParams.get("my") as string
  const location = searchParams.get("location") as string
  const category = searchParams.get("category") as string
  const q = searchParams.get("q") as string
  const sortBy = searchParams.get("sortBy") || "bookings" // 정렬 기준 추가, 기본값은 bookings

  const session = await getServerSession(authOptions)

  try {
    if (id) {
      // 상세 페이지 로직
      const activity = await prisma.activity.findFirst({
        where: { id: parseInt(id) },
        include: {
          likes: { where: session ? { userId: session?.user?.id } : {} },
          comments: true,
        },
      })
      return NextResponse.json(activity, { status: 200 })
    } else if (my) {
      // 내가 등록한 체험 무한 스크롤 로직
      if (!session?.user) {
        return NextResponse.json(
          { error: "unauthorized user" },
          { status: 401 },
        )
      }

      const count = await prisma.activity.count({
        where: { userId: session?.user?.id },
      })
      const skipPage = parseInt(page) - 1

      const activities = await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId: session?.user.id,
          title: q ? { contains: q } : {},
        },
        take: parseInt(limit),
        skip: skipPage * parseInt(limit),
      })

      return NextResponse.json(
        {
          page: parseInt(page),
          data: activities,
          totalCount: count,
          totalPage: Math.ceil(count / parseInt(limit)),
        },
        { status: 200 },
      )
    } else if (page) {
      // 무한 스크롤 로직 (메인 페이지)
      const count = await prisma.activity.count()
      const skipPage = parseInt(page) - 1

      // 정렬 기준에 따른 동적 정렬
      const activities = await prisma.activity.findMany({
        where: {
          address: location ? { contains: location } : {},
          category: category ? category : {},
        },
        orderBy:
          sortBy === "comments"
            ? { comments: { _count: "desc" } }
            : sortBy === "bookings"
              ? { bookings: { _count: "desc" } }
              : sortBy === "likes"
                ? { likes: { _count: "desc" } }
                : { [sortBy]: "desc" }, // 다른 정렬 기준에 따른 정렬
        take: parseInt(limit),
        skip: skipPage * parseInt(limit),
        include: {
          bookings: true, // 예약 관련 데이터 포함
          comments: true,
          likes: true,
        },
      })

      const activitiesWithCounts = activities.map((activity) => ({
        ...activity,
        bookingsCount: activity.bookings.length,
        commentsCount: activity.comments.length,
        likesCount: activity.likes.length,
      }))

      return NextResponse.json(
        {
          page: parseInt(page),
          data: activitiesWithCounts,
          totalCount: count,
          totalPage: Math.ceil(count / parseInt(limit)),
        },
        { status: 200 },
      )
    } else {
      const data = await prisma.activity.findMany()

      return NextResponse.json(data, { status: 200 })
    }
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error fetching activities" },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized user" }, { status: 401 })
  }

  try {
    const formData = await req.json()
    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
    }

    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(formData.address)}`,
      { headers },
    )

    if (!data.documents.length) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 })
    }

    const result = await prisma.activity.create({
      data: {
        ...formData,
        price: parseInt(formData.price),
        userId: session?.user?.id,
        lat: parseFloat(data.documents[0].y),
        lng: parseFloat(data.documents[0].x),
      },
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json(
      { error: "Error creating activity" },
      { status: 500 },
    )
  }
}

// DELETE 요청 핸들러 추가
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") as string
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized user" }, { status: 401 })
  }

  try {
    if (id) {
      const result = await prisma.activity.delete({
        where: { id: parseInt(id) },
      })
      return NextResponse.json(result, { status: 200 })
    }
    return NextResponse.json(null, { status: 500 })
  } catch (error) {
    console.error("Error deleting activity:", error)
    return NextResponse.json(
      { error: "Error deleting activity" },
      { status: 500 },
    )
  }
}
