"use client"

import SubmitButton from "@/components/Booking/SubmitButton"
import { BLUR_DATA_URL } from "@/constants"
import { BookingParamsProps, ActivityType } from "@/interface"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ActivityBookingPage({
  params,
  searchParams,
}: BookingParamsProps) {
  const id = params.id
  const checkIn = searchParams.checkIn
  const checkOut = searchParams.checkOut
  const guestCount = searchParams.guestCount
  const totalAmount = searchParams.totalAmount
  const totalDays = searchParams.totalDays
  const [data, setData] = useState<ActivityType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityData = await getActivityData(id)
        setData(activityData)
        setLoading(false)
      } catch (e) {
        setError("활동 정보를 불러오는 중 문제가 발생했습니다.")
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>활동 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="my-28 max-w-6xl mx-auto px-4">
      <div className="mt-32">
        <h1 className="font-semibold text-xl md:text-3xl">
          활동 예약 확인 및 결제
        </h1>
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
          </div>

          <div className="flex flex-col gap-6 border-y my-8 py-8">
            <h2 className="text-lg md:text-2xl font-semibold">활동 정보</h2>

            <div className="flex border-b gap-4 pb-6">
              <Image
                src={data?.images?.[0] || "/images/logo.png"}
                width={100}
                height={100}
                alt="활동 이미지"
                className="rounded-md"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <div className="flex flex-col justify-between">
                <Link href={`/activities/${data.id}`}>
                  <h1 className="text-sm">{data?.title}</h1>
                </Link>
                <p className="text-xs text-gray-500">
                  {data?.category} | {data?.price?.toLocaleString()}원
                </p>
              </div>
            </div>

            <h2 className="text-lg md:text-2xl font-semibold">
              요금 세부 정보
            </h2>
            <div>
              <h3>활동 일수</h3>
              <div className="text-sm mt-1 text-gray-800">{totalDays}일</div>
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

async function getActivityData(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/activities?id=${id}`,
      {
        cache: "no-store",
      },
    )

    if (!res.ok) {
      throw new Error("Failed to fetch activity data")
    }

    return res.json()
  } catch (e) {
    console.log(e)
    return null
  }
}
