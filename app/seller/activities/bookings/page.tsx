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

export default function SellerActivityBookingsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  // 예약 내역을 가져오는 함수
  const fetchBookings = async ({ pageParam = 1 }) => {
    if (!session || !session.user) {
      throw new Error("세션이 유효하지 않습니다.")
    }

    try {
      const { data } = await axios.get(`/api/seller/activities/bookings`, {
        params: {
          limit: 5, // 한 페이지당 5개의 예약 가져오기
          page: pageParam,
          userId: session.user.id,
        },
      })

      return data
    } catch (error) {
      console.error("예약 내역을 가져오는 중 오류 발생:", error)
      throw error
    }
  }

  // useInfiniteQuery를 사용하여 무한 스크롤 구현
  const {
    data: bookings = { pages: [] }, // 기본값 설정
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery(
    `seller-activity-bookings-${session?.user?.id}`,
    fetchBookings,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.data && lastPage.data.length > 0) {
          return lastPage.page + 1 // 다음 페이지 번호 반환
        }
        return undefined // 더 이상 페이지가 없으면 undefined 반환
      },
      enabled: !!session?.user.id,
    },
  )

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="font-semibold text-lg md:text-2xl">
        판매자 체험활동 예약 리스트
      </h1>
      <p className="mt-2 text-gray-500">
        내 체험활동에 대한 예약 일정을 확인해보세요.
      </p>

      {isLoading ? (
        <Loader className="mt-10 mb-20" />
      ) : bookings.pages.length === 0 ? (
        <p className="mt-10 mb-20">예약 내역이 없습니다.</p>
      ) : (
        <div className="mb-20 mt-10 flex flex-col">
          {bookings.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((booking: BookingType) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-6 border-b pb-8 hover:bg-black/5 cursor-pointer p-6"
                >
                  <h1 className="font-semibold text-lg md:text-xl">
                    {booking?.status === "SUCCESS"
                      ? "예약된 체험활동"
                      : "취소된 체험활동"}
                  </h1>
                  <div className="flex gap-4 items-center w-full justify-between">
                    <div className="flex items-center gap-4">
                      <Image
                        className="rounded-md"
                        src={
                          booking?.activity?.images?.[0] ||
                          "/images/default-image.png"
                        }
                        width={80}
                        height={80}
                        alt="체험활동 이미지"
                        onError={(e) => {
                          e.currentTarget.src = "/images/default-image.png" // 에러 발생 시 기본 이미지로 변경
                        }}
                      />
                      <div>
                        <h2 className="font-semibold">
                          {booking?.activity?.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          {booking?.activity?.address}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {dayjs(booking?.checkIn).format("YYYY년 MM월 DD일")} -{" "}
                          {dayjs(booking?.checkOut).format("YYYY-MM-DD")} |{" "}
                          {booking?.guestCount}명 |{" "}
                          {booking?.totalAmount?.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/activities/${booking?.activityId}`) // 체험활동 페이지로 이동
                      }}
                      className="flex gap-1 items-center underline hover:text-gray-500"
                    >
                      체험활동 보기 <BiChevronRight className="text-xl" />
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(
                          `/seller/activities/bookings/${booking?.id}`,
                        ) // 예약내역 확인 페이지로 이동
                      }}
                      className="text-white bg-lime-600 hover:bg-lime-500 px-4 py-2.5 rounded-md"
                    >
                      예약내역 확인
                    </button>
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
                예약내역 더 불러오기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
