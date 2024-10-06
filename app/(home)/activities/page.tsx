"use client"

import React, { useEffect, useRef, useState } from "react"
import CategoryList from "@/components/CategoryList"
import { GridLayout, ActivityItem } from "@/components/ActivitiesList"
import { useInfiniteQuery, useQuery } from "react-query"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ActivityType } from "@/interface"
import { Loader, LoaderGrid } from "@/components/Loader"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"
import { MapButton } from "@/components/Map"
import { useRecoilValue } from "recoil"
import { filterState } from "@/atom"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// "이달의 활동" 데이터를 가져오는 함수
const fetchTopBookedActivities = async () => {
  const { data } = await axios.get("/api/activities/top-booked")
  return data
}

export default function ActivityPage() {
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

  const fetchActivities = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/activities?page=" + pageParam, {
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
    data: activities,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(["activities", filterParams, sortBy], fetchActivities, {
    getNextPageParam: (lastPage, pages) =>
      lastPage?.data?.length > 0 ? lastPage.page + 1 : undefined,
  })

  const {
    data: topBookedActivities,
    isLoading: isTopLoading,
    isError: isTopError,
  } = useQuery("topBookedActivities", fetchTopBookedActivities)

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
    throw new Error("Activity API Fetching Error")
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

  return (
    <>
      {/* 이달의 활동 섹션 */}
      <section className="relative mb-8 mt-20">
        <h2 className="text-2xl font-bold mb-4 text-center relative z-10">
          이달의 활동
        </h2>
        <div className="text-center relative z-10">
          <h5 className="font-bold">요즘 할 것도 없고 지루하시죠~?</h5>
          <h6 className="font-bold">고민하지말고 이달의 활동 예약 GO!</h6>
        </div>
        {isTopLoading ? (
          <Loader />
        ) : isTopError ? (
          <div className="text-center text-red-500">
            이달의 활동 데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : (
          // 이달의 활동 리스트를 보여주는 코드 (여기서 활동 이미지와 버튼을 보여줌)
          topBookedActivities?.data?.map((activity: ActivityType) => (
            <div
              key={activity.id}
              className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg"
            >
              {/* 이미지 */}
              <img
                src={activity.images[0] || "/default-image.jpg"} // 첫 번째 이미지를 사용하거나 기본 이미지 사용
                alt={activity.title}
                className="w-64 h-48 object-cover mx-auto rounded-lg"
              />

              {/* 활동명 및 예약 횟수 */}
              <h3 className="text-lg mt-3 font-semibold text-center">
                {activity.title}
              </h3>
              <p className="text-gray-500 text-center mt-1">
                예약 횟수: {activity.bookings?.length ?? 0}
              </p>

              {/* 자세히 보기 버튼 */}
              <div className="flex justify-center w-full">
                <button
                  onClick={() => router.push(`/activities/${activity.id}`)}
                  className="mt-2 px-4 py-2 bg-lime-500 text-white text-sm rounded hover:bg-lime-600 transition"
                >
                  자세히 보기
                </button>
              </div>
            </div>
          ))
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
          activities?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page?.data?.map((activity: ActivityType) => (
                <ActivityItem activity={activity} key={activity.id} />
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
