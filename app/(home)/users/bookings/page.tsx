"use client"

import { Loader } from "@/components/Loader"
import { BookingType } from "@/interface"
import axios from "axios"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"
import { BiChevronRight } from "react-icons/bi"
import { useInfiniteQuery } from "react-query"

export default function BookingsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const fetchBookings = async ({ pageParam = 1 }) => {
    try {
      const { data } = await axios.get(`/api/bookings`, {
        params: {
          limit: 5,
          page: pageParam,
          userId: session?.user?.id,
        },
      })
      return data
    } catch (error) {
      console.error("Error fetching bookings:", error)
      throw new Error("Failed to fetch bookings")
    }
  }

  const {
    data: bookings,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    hasNextPage,
  } = useInfiniteQuery(`bookings-user-${session?.user?.id}`, fetchBookings, {
    getNextPageParam: (lastPage) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
    enabled: !!session?.user?.id,
  })

  if (!session?.user?.id) {
    return <p>세션 정보가 없습니다. 로그인하세요.</p>
  }

  if (isLoading) {
    return <Loader className="mt-10 mb-20" />
  }

  if (isError) {
    console.log("Error:", isError)
    return (
      <p className="mt-10 mb-20 text-red-500">
        예약 내역을 불러오는 중 오류가 발생했습니다.
      </p>
    )
  }

  if (!bookings?.pages?.[0]?.data?.length) {
    return <p className="mt-10 mb-20">예약 내역이 없습니다.</p>
  }

  return (
    <div className="mb-20 mt-10 flex flex-col">
      {bookings?.pages?.map((page, index) => (
        <React.Fragment key={index}>
          {(page.data || []).map((booking: BookingType) => (
            <div
              key={booking.id}
              className="flex flex-col gap-6 border-b pb-8 hover:bg-black/5 cursor-pointer p-6"
            >
              <h1 className="font-semibold text-lg md:text-xl">
                {booking?.status === "SUCCESS"
                  ? "예약된 여행"
                  : booking?.status === "PENDING"
                    ? "결제 대기 중"
                    : booking?.status === "CANCEL"
                      ? "취소된 여행"
                      : "알 수 없는 상태"}
              </h1>
              <div className="flex gap-4 items-center w-full justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    className="rounded-md"
                    src={
                      booking?.room?.images?.[0] ||
                      booking?.activity?.images?.[0] ||
                      "/images/default-image.png"
                    }
                    width={80}
                    height={80}
                    alt="예약 이미지"
                    unoptimized
                  />
                  <div>
                    <h2 className="font-semibold">
                      {booking?.room?.title || booking?.activity?.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {booking?.room?.address || booking?.activity?.address}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {dayjs(booking?.checkIn)?.format("YYYY년 MM월 DD일")} -{" "}
                      {dayjs(booking?.checkOut)?.format("YYYY년 MM월 DD일")} |{" "}
                      {booking?.guestCount}명 |{" "}
                      {booking?.totalAmount?.toLocaleString()}원
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    router.push(
                      booking?.roomId
                        ? `/rooms/${booking?.roomId}`
                        : `/activities/${booking?.activityId}`,
                    )
                  }}
                  className="flex gap-1 items-center underline hover:text-gray-500"
                >
                  {booking?.roomId ? "숙소 보기" : "활동 보기"}
                  <BiChevronRight className="text-xl" />
                </button>
              </div>
              <div>
                {booking?.status === "CANCEL" ? (
                  <p className="text-red-600 font-bold">취소된 여행입니다.</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/users/bookings/${booking?.id}`)
                    }}
                    className="text-white bg-lime-600 hover:bg-lime-500 px-4 py-2.5 rounded-md"
                  >
                    예약내역 확인
                  </button>
                )}
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="mt-8 bg-black px-5 py-3.5 shadow-sm hover:shadow-xl rounded-full text-white"
          >
            {isFetchingNextPage ? "로딩 중..." : "예약내역 더 불러오기"}
          </button>
        </div>
      )}
    </div>
  )
}
