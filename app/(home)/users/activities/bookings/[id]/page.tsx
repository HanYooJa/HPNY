"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader } from "@/components/Loader"
import { ActivityType, BookingType } from "@/interface"
import Image from "next/image"
import dayjs from "dayjs"
import RefundButton from "@/components/Booking/RefundButton"

export default function ActivityBookingPage({
  params,
}: {
  params: { id: string }
}) {
  const { data: session, status } = useSession()
  const [booking, setBooking] = useState<BookingType | null>(null)
  const [activity, setActivity] = useState<ActivityType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (status === "unauthenticated") {
        setError("로그인이 필요합니다.")
        return
      }

      if (status === "authenticated" && session?.user) {
        try {
          // 예약 정보 가져오기
          const bookingResponse = await fetch(
            `/api/bookings/activities/${params.id}`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            },
          )

          if (!bookingResponse.ok) {
            throw new Error("예약 정보를 불러오는 중 오류가 발생했습니다.")
          }

          const bookingData: BookingType = await bookingResponse.json()
          setBooking(bookingData)

          // 활동 정보 가져오기
          const activityResponse = await fetch(
            `/api/activities/${bookingData.activityId}`,
          )
          if (!activityResponse.ok) {
            throw new Error("활동 정보를 불러오는 중 오류가 발생했습니다.")
          }

          const activityData: ActivityType = await activityResponse.json()
          setActivity(activityData)
        } catch (error: any) {
          setError(error.message || "오류가 발생했습니다.")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [params.id, session, status])

  if (loading) {
    return <Loader />
  }
  if (error) {
    return <div className="text-center mt-10">{error}</div>
  }
  if (!booking || !activity) {
    return <div>예약 정보를 불러올 수 없습니다.</div>
  }

  const canRefund = dayjs(booking?.checkIn).diff(dayjs(), "days") > 10

  return (
    <div className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <h1 className="text-xl md:text-3xl font-semibold">활동 예약 상세 내역</h1>
      <div className="rounded-md border border-gray-300 p-6 mt-10">
        <section className="flex border-b gap-4 pb-6">
          <Image
            src={activity?.images?.[0] || "/images/default-activity.jpg"}
            width={100}
            height={100}
            alt="활동 이미지"
            className="rounded-md"
          />
          <div className="flex flex-col justify-between">
            <h1 className="text-sm">{activity?.title}</h1>
            <p className="text-xs text-gray-500">
              {activity?.category} | {activity?.price?.toLocaleString()}원
            </p>
            <p className="text-xs text-gray-500">
              후기 {activity?.comments?.length ?? 0}개
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4 border-b pb-6">
          <h1 className="text-lg md:text-xl mt-4">여행 일정 정보</h1>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">날짜</h3>
            <div className="text-gray-900">
              {dayjs(booking?.checkIn)?.format("YYYY-MM-DD")} ~{" "}
              {dayjs(booking?.checkOut)?.format("YYYY-MM-DD")}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">게스트</h3>
            <div className="text-gray-900">게스트 {booking?.guestCount}명</div>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">예약자</h3>
            <div className="text-gray-900">{booking?.user?.name}</div>
          </div>
        </section>

        <section className="flex flex-col gap-4 pb-6">
          <h1 className="text-lg md:text-xl mt-4">요금 세부 정보</h1>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">활동 일수</h3>
            <div className="text-gray-900">{booking?.totalDays}일</div>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">총 금액</h3>
            <div className="text-gray-900">
              {booking?.totalAmount?.toLocaleString()}원
            </div>
          </div>
        </section>

        <section className="flex justify-between items-center gap-4 mt-8">
          {booking?.status === "SUCCESS" && (
            <RefundButton booking={booking} canRefund={canRefund} />
          )}
        </section>
      </div>
    </div>
  )
}
