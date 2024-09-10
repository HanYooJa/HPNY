"use client"
import React, { useEffect, useRef } from "react"
import { GridLayout, ActivityItem } from "@/components/ActivitiesList" // RoomItem을 ActivityItem으로 교체
import { useInfiniteQuery } from "react-query"
import axios from "axios"
import { useRouter } from "next/navigation"

import { ActivityType } from "@/interface"
import { Loader, LoaderGrid } from "@/components/Loader"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"

import { MapButton } from "@/components/Map"
import { useRecoilValue } from "recoil"
import { filterState } from "@/atom"

export default function ActivitiesPage() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement | null>(null)
  const filterValue = useRecoilValue(filterState)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting

  const filterParams = {
    location: filterValue.location,
    category: filterValue.category,
  }

  // activities 데이터를 불러오기 위한 함수
  const fetchActivities = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/activities?page=" + pageParam, {
      params: {
        limit: 12,
        page: pageParam,
        ...filterParams,
      },
    })

    return data
  }

  // useInfiniteQuery로 무한 스크롤 처리
  const {
    data: activities,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(["activities", filterParams], fetchActivities, {
    getNextPageParam: (lastPage, pages) =>
      lastPage?.data?.length > 0 ? lastPage.page + 1 : undefined,
  })

  if (isError) {
    console.error("Activities API Fetching Error:", isError)
    return <div>Failed to load activities. Please try again later.</div>
  }

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }
    return () => clearTimeout(timerId)
  }, [fetchNextPage, hasNextPage, isPageEnd])

  return (
    <>
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
