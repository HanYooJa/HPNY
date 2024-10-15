"use client"

import SubmitButton from "@/components/Booking/SubmitButton"
import { BLUR_DATA_URL } from "@/constants"
import { BookingParamsProps, RoomType } from "@/interface"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function BookingPage({
  params,
  searchParams,
}: BookingParamsProps) {
  const { data: session } = useSession()
  const [userName, setUserName] = useState<string | null>(null)
  const [data, setData] = useState<RoomType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || null)
    }
    const fetchData = async () => {
      const roomData = await getData(params.id)
      setData(roomData)
      setLoading(false)
    }
    fetchData()
  }, [session, params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  const checkIn = searchParams.checkIn
  const checkOut = searchParams.checkOut
  const guestCount = searchParams.guestCount
  const totalAmount = searchParams.totalAmount
  const totalDays = searchParams.totalDays

  return (
    <div className="my-28 max-w-6xl mx-auto px-4">
      <div className="mt-32">
        <h1 className="font-semibold text-xl md:text-3xl">예약 확인 및 결제</h1>
        <div className="grid md:grid-cols-2 gap-20">
          <div className="flex flex-col gap-6 border-y my-8 py-8">
            <h2 className="text-lg md:text-2xl font-semibold">예약 정보</h2>
            <div>
              <h3>날짜</h3>
              <div className="text-sm mt-1 text-gray-800">
                {checkIn} ~ {checkOut}
              </div>
            </div>
            <div>
              <h3>게스트</h3>
              <div className="text-sm mt-1 text-gray-800">
                게스트 {guestCount} 명
              </div>
            </div>
            <div>
              <h3>예약자</h3>
              <div className="text-sm mt-1 text-gray-800">
                {userName || "예약자 정보 없음"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 border-y my-8 py-8">
            <h2 className="text-lg md:text-2xl font-semibold">숙소 정보</h2>
            <div className="flex border-b gap-4 pb-6">
              <Image
                src={data?.images?.[0] || "/images/logo.png"}
                width={100}
                height={100}
                alt="숙소 이미지"
                className="rounded-md"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <div className="flex flex-col justify-between">
                <Link href={`/rooms/${data?.id}`}>
                  <h1 className="text-sm">{data?.title}</h1>
                </Link>
                <p className="text-xs text-gray-500">
                  {data?.category || "카테고리 없음"} |{" "}
                  {data?.price?.toLocaleString()}원
                </p>
              </div>
            </div>

            <h2 className="text-lg md:text-2xl font-semibold">
              요금 세부 정보
            </h2>
            <div>
              <h3>숙박 일수</h3>
              <div className="text-sm mt-1 text-gray-800">{totalDays}박</div>
            </div>
            <div>
              <h3>총 합계</h3>
              <div className="text-sm mt-1 text-gray-800">
                {parseInt(totalAmount)?.toLocaleString()}원
              </div>
            </div>
            <SubmitButton />
          </div>
        </div>
      </div>
    </div>
  )
}

async function getData(id: string) {
  try {
    const res = await fetch(`/api/rooms/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }

    const data = await res.json()
    return data
  } catch (e) {
    console.log(e)
    return null
  }
}
