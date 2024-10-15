"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader } from "@/components/Loader"
import { BookingType } from "@/interface"
import Image from "next/image"
import dayjs from "dayjs"
import RefundButton from "@/components/Booking/RefundButton"

export default function BookingPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const [booking, setBooking] = useState<BookingType | null>(null)
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
          const response = await fetch(`/api/bookings/${params.id}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })

          if (!response.ok) {
            throw new Error("예약 정보를 불러오는 중 오류가 발생했습니다.")
          }

          const data: BookingType = await response.json()
          console.log("Booking data:", data) // booking 데이터 콘솔에 출력
          setBooking(data)
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

  if (!booking) {
    return <div>예약 정보를 불러올 수 없습니다.</div>
  }

  const canRefund =
    booking?.room?.freeCancel ??
    dayjs(booking?.checkIn).diff(dayjs(), "days") > 10

  const isActivityBooking = booking?.activityId !== null

  return (
    <div className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <h1 className="text-xl md:text-3xl font-semibold">예약 상세 내역</h1>
      <div className="rounded-md border border-gray-300 p-6 mt-10">
        <section className="flex border-b gap-4 pb-6">
          <Image
            src={
              isActivityBooking
                ? booking?.activity?.images?.[0] ||
                  "/images/default-activity.jpg"
                : booking?.room?.images?.[0] || "/images/default-room.jpg"
            }
            width={100}
            height={100}
            alt={isActivityBooking ? "활동 이미지" : "숙소 이미지"}
            className="rounded-md"
          />
          <div className="flex flex-col justify-between">
            <h1 className="text-sm">
              {isActivityBooking
                ? booking?.activity?.title
                : booking?.room?.title}
            </h1>
            <p className="text-xs text-gray-500">
              {isActivityBooking
                ? booking?.activity?.category
                : booking?.room?.category}{" "}
              |{" "}
              {isActivityBooking
                ? booking?.activity?.price?.toLocaleString()
                : booking?.room?.price?.toLocaleString()}
              원
            </p>
            <p className="text-xs text-gray-500">
              {isActivityBooking
                ? `참여 후기 ${booking?.activity?.comments?.length ?? 0}개`
                : `후기 ${booking?.room?.comments?.length ?? 0}개`}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4 border-b pb-6">
          <h1 className="text-lg md:text-xl mt-4">여행 일정정보</h1>
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
          <h1 className="text-lg md:text-xl mt-4">요금 세부정보</h1>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">
              {isActivityBooking ? "활동 일정" : "숙박 일정"}
            </h3>
            <div className="text-gray-900">
              {booking?.totalDays}
              {isActivityBooking ? "일" : "박"}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">총 금액</h3>
            <div className="text-gray-900">
              {booking?.totalAmount?.toLocaleString()}원
            </div>
          </div>
        </section>

        {/* 결제 상태에 따른 RefundButton 및 취소된 여행 메시지 */}
        <section className="flex justify-between items-center gap-4 mt-8">
          {booking?.status === "PENDING" && (
            <p className="text-red-600">결제가 필요합니다.</p>
          )}
          {booking?.status === "SUCCESS" && (
            <RefundButton booking={booking} canRefund={canRefund} />
          )}
          {booking?.status === "CANCEL" && (
            <p className="text-gray-500">취소된 여행입니다.</p>
          )}
        </section>
      </div>
    </div>
  )
}
