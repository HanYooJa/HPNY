import prisma from "@/db"
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') as string
  const limit = searchParams.get('limit') as string
  const id = searchParams.get('id') as string

  if (id) { 
    //상세 페이지 로직
    const room = await prisma.room.findFirst({
      where: {
        id: parseInt(id),
      },
    })
    return NextResponse.json(room, {
      status: 200,
    })
  }
  else if (page) {
    //무한 스크롤 로직
    const count = await prisma.room.count()
    const skipPage = parseInt(page) - 1
    const rooms = await prisma.room.findMany({
      orderBy: { id: 'asc' },
      take: parseInt(limit),
      skip: skipPage * parseInt(limit),
    })

    return NextResponse.json({
      page: parseInt(page),
      data: rooms,
      totalCount: count,
      totalPage: Math.ceil(count / parseInt(limit)),
    }, { status: 200 })
  } else {
  
  const data = await prisma.room.findMany()

  return NextResponse.json(data, {
    status: 200,
  })
}
}