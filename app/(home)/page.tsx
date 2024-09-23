"use client"
import React, { useEffect, useRef, useState } from "react"

import CategoryList from "@/components/CategoryList"
import { GridLayout, RoomItem } from "@/components/RoomList"
import { useInfiniteQuery } from "react-query"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import axios from "axios"

import { RoomType } from "@/interface"
import { Loader, LoaderGrid } from "@/components/Loader"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"

import { MapButton } from "@/components/Map"
import { useRecoilValue } from "recoil"
import { filterState } from "@/atom"

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
  const [sortBy, setSortBy] = useState("views")

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
      <CategoryList />

      {/* 정렬 옵션 추가 */}
      <div className="mb-4">
        <label htmlFor="sortBy">정렬 기준: </label>
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

      {/* 판매자인 경우 대시보드로 이동하는 버튼 추가 */}
      {isSeller && (
        <button
          onClick={() => router.push("/seller-dashboard")}
          className="fixed bottom-20 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg"
        >
          판매자 대시보드
        </button>
      )}

      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}
