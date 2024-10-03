"use client"
import React, { useEffect, useRef, useState } from "react"
import CategoryList from "@/components/CategoryList"
import { GridLayout, RoomItem } from "@/components/RoomList"
import { useInfiniteQuery, useQuery } from "react-query"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import { RoomType } from "@/interface"
import { Loader, LoaderGrid } from "@/components/Loader"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"
import { MapButton } from "@/components/Map"
import { useRecoilValue } from "recoil"
import { filterState } from "@/atom"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// "이달의 숙소" 데이터를 가져오는 함수
const fetchTopBookedRooms = async () => {
  const { data } = await axios.get("/api/rooms/top-booked")
  return data
}

export default function Home() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement | null>(null)
  const filterValue = useRecoilValue(filterState)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting

  const filterParams = {
    location: filterValue.location,
    category: filterValue.category,
  }

  // 정렬을 위한 상태 추가
  const [sortBy, setSortBy] = useState("bookings")

  const fetchRooms = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/rooms?page=" + pageParam, {
      params: {
        limit: 12,
        page: pageParam,
        sortBy, // 정렬 파라미터 추가
        ...filterParams,
      },
    })

    return data
  }

  const {
    data: rooms,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(["rooms", filterParams, sortBy], fetchRooms, {
    getNextPageParam: (lastPage, pages) =>
      lastPage?.data?.length > 0 ? lastPage.page + 1 : undefined,
  })

  const {
    data: topBookedRooms,
    isLoading: isTopLoading,
    isError: isTopError,
  } = useQuery("topBookedRooms", fetchTopBookedRooms)

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  if (isError) {
    throw new Error("Room API Fetching Error")
  }

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }

    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [fetchNextPage, hasNextPage, isPageEnd])

  // 세션에서 사용자의 역할이 'seller'인지 확인
  const { data: session } = useSession()

  const isSeller = session?.user?.role === "seller"

  return (
    <>
      {/* 이달의 숙소 섹션 */}
      <section className="relative mb-8 mt-20">
        {" "}
        <h2 className="text-2xl font-bold mb-4 text-center relative z-10">
          이달의 숙소
        </h2>
        <div className="text-center relative z-10">
          <h5 className="font-bold">숙소 찾아보기가 귀찮으시죠~?</h5>
          <h6 className="font-bold">고민하지말고 이달의 숙소 예약 GO!</h6>
        </div>
        {isTopLoading ? (
          <Loader />
        ) : isTopError ? (
          <div className="text-center text-red-500">
            이달의 숙소 데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : (
          <Slider
            {...sliderSettings}
            className="mx-auto w-full overflow-hidden"
          >
            {topBookedRooms?.data?.map((room: RoomType) => (
              <div
                key={room.id}
                className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg"
              >
                {/* 이미지 */}
                <img
                  src={room.imageUrl || "/default-image.jpg"}
                  alt={room.title}
                  className="w-64 h-48 object-cover mx-auto rounded-lg"
                />

                {/* 숙소명 및 예약 횟수 */}
                <h3 className="text-lg mt-3 font-semibold text-center">
                  {room.title}
                </h3>
                <p className="text-gray-500 text-center mt-1">
                  예약 횟수: {room.bookings?.length ?? 0}
                </p>

                {/* 자세히 보기 버튼 중앙 정렬 */}
                <div className="flex justify-center w-full">
                  <button
                    onClick={() => router.push(`/rooms/${room.id}`)}
                    className="mt-2 px-4 py-2 bg-lime-500 text-white text-sm rounded hover:bg-lime-600 transition"
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      <CategoryList />

      {/* 정렬 옵션 왼쪽 배치 */}
      <div className="mb-4 text-left pl-6">
        <label htmlFor="sortBy" className="font-semibold mr-2">
          정렬 기준:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="views">조회수 순</option>
          <option value="comments">후기 순</option>
          <option value="likes">찜한 순</option>
          <option value="bookings">예약된 순</option>
        </select>
      </div>

      <GridLayout>
        {isLoading || isFetching ? (
          <LoaderGrid />
        ) : (
          rooms?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page?.data?.map((room: RoomType) => (
                <RoomItem room={room} key={room.id} />
              ))}
            </React.Fragment>
          ))
        )}
      </GridLayout>
      <MapButton onClick={() => router.push("/map")} />

      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}
