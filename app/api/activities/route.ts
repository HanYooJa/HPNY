import prisma from "@/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { Prisma } from "@prisma/client"

// GET 요청 핸들러
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")
  const id = searchParams.get("id")
  const location = searchParams.get("location") || ""
  const category = searchParams.get("category") || ""
  const q = searchParams.get("q") || ""
  const my = searchParams.get("my") || ""
  const sortBy =
    (searchParams.get("sortBy") as keyof typeof orderByOptions) || "createdAt"

  const session = await getServerSession(authOptions)

  const orderByOptions = {
    views: { views: Prisma.SortOrder.desc },
    comments: { comments: { _count: Prisma.SortOrder.desc } },
    likes: { likes: { _count: Prisma.SortOrder.desc } },
    bookings: { bookings: { _count: Prisma.SortOrder.desc } },
    createdAt: { createdAt: Prisma.SortOrder.desc },
  }

  try {
    // 특정 활동(id 기반으로) 조회
    if (id) {
      const activity = await prisma.activity.findFirst({
        where: { id: parseInt(id) },
        include: {
          likes: { where: session ? { userId: session?.user?.id } : {} },
          comments: true,
        },
      })
      if (!activity) {
        return NextResponse.json(
          { error: "Activity not found" },
          { status: 404 },
        )
      }
      return NextResponse.json(activity, { status: 200 })
    } else if (my === "true" && session?.user) {
      // 내가 등록한 활동만 조회
      const count = await prisma.activity.count({
        where: { userId: session.user.id },
      })

      const activities = await prisma.activity.findMany({
        where: { userId: session.user.id },
        orderBy: orderByOptions[sortBy],
        take: limit,
        skip: (page - 1) * limit,
        include: {
          comments: true,
          likes: true,
          bookings: true,
        },
      })

      const activitiesWithCounts = activities.map((activity) => ({
        ...activity,
        commentsCount: activity.comments.length,
        likesCount: activity.likes.length,
        bookingsCount: activity.bookings.length,
      }))

      return NextResponse.json({
        page,
        data: activitiesWithCounts,
        totalCount: count,
        totalPage: Math.ceil(count / limit),
      })
    } else {
      // 전체 활동 조회 + 필터링
      const count = await prisma.activity.count({
        where: {
          address: location ? { contains: location } : {},
          category: category ? { equals: category } : {},
        },
      })

      const activities = await prisma.activity.findMany({
        where: {
          address: location ? { contains: location } : {},
          category: category ? { equals: category } : {},
        },
        orderBy: orderByOptions[sortBy],
        take: limit,
        skip: (page - 1) * limit,
        include: {
          comments: true,
          likes: true,
          bookings: true,
        },
      })

      const activitiesWithCounts = activities.map((activity) => ({
        ...activity,
        commentsCount: activity.comments.length,
        likesCount: activity.likes.length,
        bookingsCount: activity.bookings.length,
      }))

      return NextResponse.json({
        page,
        data: activitiesWithCounts,
        totalCount: count,
        totalPage: Math.ceil(count / limit),
      })
    }
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error fetching activities" },
      { status: 500 },
    )
  }
}

// POST 요청 핸들러 (활동 생성)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  try {
    const formData = await req.json()

    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newActivity = await prisma.activity.create({
      data: {
        ...formData,
        userId: session.user.id,
        price: parseInt(formData.price, 10),
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
      },
    })

    return NextResponse.json(newActivity, { status: 200 })
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json(
      { error: "Error creating activity" },
      { status: 500 },
    )
  }
}

// DELETE 요청 핸들러 (활동 삭제)
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  try {
    if (id) {
      const result = await prisma.activity.delete({
        where: { id: parseInt(id) },
      })
      return NextResponse.json(result, { status: 200 })
    }
    return NextResponse.json(
      { error: "Activity ID not provided" },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error deleting activity:", error)
    return NextResponse.json(
      { error: "Error deleting activity" },
      { status: 500 },
    )
  }
}
