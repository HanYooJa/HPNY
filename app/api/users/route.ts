import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  try {
    const data = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        accounts: true,
      },
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  const formData = await req.json()
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
  }

  try {
    const result = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: { ...formData },
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 },
    )
  }
}
