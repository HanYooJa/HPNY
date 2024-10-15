"use client"

import React, { useEffect, useRef, useState } from "react"
import CategoryList from "@/components/CategoryList"
import {
  GridLayout,
  ActivityItemWithHoverSlider,
} from "@/components/ActivitiesList"
import { useInfiniteQuery, useQuery } from "react-query"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ActivityType } from "@/interface"
import { Loader, LoaderGrid } from "@/components/Loader"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"
import { useRecoilValue } from "recoil"
import { filterState } from "@/atom"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// 상단 예약이 많은 활동을 불러오는 함수
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

  // 필터링 값에 따라 요청에 필요한 파라미터 정의
  const filterParams = {
    location: filterValue.location,
    category: filterValue.category,
  }

  const [sortBy, setSortBy] = useState("bookings")

  // 활동 데이터를 불러오는 함수
  const fetchActivities = async ({ pageParam = 1 }) => {
    const { data } = await axios.get("/api/activities", {
      params: {
        limit: 12,
        page: pageParam,
        sortBy,
        ...filterParams,
      },
    })
    return data
  }

  // useInfiniteQuery로 활동 데이터 무한 스크롤
  const {
    data: activities,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(["activities", filterParams, sortBy], fetchActivities, {
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1
      return nextPage <= lastPage.totalPage ? nextPage : undefined
    },
  })

  // 상단에 보여줄 이달의 활동 데이터를 가져오는 useQuery
  const {
    data: topBookedActivities,
    isLoading: isTopLoading,
    isError: isTopError,
  } = useQuery("topBookedActivities", fetchTopBookedActivities)

  // 슬라이더 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  }

  // 스크롤 끝 감지 시 다음 페이지 로드
  useEffect(() => {
    if (isPageEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isPageEnd, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <>
      <section className="relative mb-8 mt-20">
        <h2 className="text-2xl font-bold mb-4 text-center relative z-10">
          이달의 활동
        </h2>
        <div className="text-center relative z-10">
          <h5 className="font-bold">요즘 할 것도 없고 지루하시죠~?</h5>
          <h6 className="font-bold">고민하지 말고 이달의 활동 예약 GO!</h6>
        </div>
        {isTopLoading ? (
          <Loader />
        ) : isTopError ? (
          <div className="text-center text-red-500">
            이달의 활동 데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : (
          <Slider
            {...sliderSettings}
            className="mx-auto w-full overflow-hidden"
          >
            {topBookedActivities?.data?.map((activity: ActivityType) => (
              <div
                key={activity.id}
                className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg"
              >
                <div className="h-[320px] md:h-[240px] overflow-hidden relative z-0">
                  <img
                    src={activity.images[0] || "/default-image.jpg"}
                    alt={activity.title}
                    className="w-64 h-48 object-cover mx-auto rounded-lg"
                  />
                </div>
                <h3 className="text-lg mt-2 font-semibold text-center">
                  {activity.title}
                </h3>
                <p className="text-gray-500 text-center mt-0.5">
                  예약 횟수: {activity.bookings?.length ?? 0}
                </p>
                <div className="flex justify-center w-full">
                  <button
                    onClick={() => router.push(`/activities/${activity.id}`)}
                    className="mt-1 px-4 py-2 bg-lime-500 text-white text-sm rounded hover:bg-lime-600 transition"
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
                <ActivityItemWithHoverSlider
                  activity={activity}
                  key={activity.id}
                />
              ))}
            </React.Fragment>
          ))
        )}
      </GridLayout>

      {(isFetching || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}
