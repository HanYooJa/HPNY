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

// "이달의 활동" 데이터를 가져옴
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

  const [sortBy, setSortBy] = useState("bookings")

  const fetchActivities = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/activities?page=" + pageParam, {
      params: {
        limit: 12,
        page: pageParam,
        sortBy,
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
    autoplay: true, // 자동 슬라이드를 켬
    autoplaySpeed: 5000, // 5초마다 다음 활동으로 자동으로 넘어감
  }

  // 개별 활동에 대한 이미지 슬라이드 로직
  const [activeActivity, setActiveActivity] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: number]: number
  }>({})

  const handleMouseEnter = (activityId: number, activityImages: string[]) => {
    if (activityImages.length > 1) {
      setActiveActivity(activityId)
      setCurrentImageIndex((prevState) => ({
        ...prevState,
        [activityId]: 0, // 처음엔 첫 번째 이미지로 설정
      }))

      // 2초마다 이미지 변경
      const interval = setInterval(() => {
        setCurrentImageIndex((prevState) => ({
          ...prevState,
          [activityId]:
            prevState[activityId] !== undefined
              ? (prevState[activityId] + 1) % activityImages.length
              : 0,
        }))
      }, 2000)

      intervalRef.current = interval
    }
  }

  const handleMouseLeave = (activityId: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [activityId]: 0, // 마우스를 떼면 첫 번째 이미지로 되돌림
    }))
  }

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

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
                onMouseEnter={() =>
                  handleMouseEnter(activity.id, activity.images)
                }
                onMouseLeave={() => handleMouseLeave(activity.id)}
              >
                <div className="h-[320px] md:h-[240px] overflow-hidden relative z-0">
                  <img
                    src={
                      activity.images[currentImageIndex[activity.id] || 0] ||
                      "/default-image.jpg"
                    }
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

      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}
