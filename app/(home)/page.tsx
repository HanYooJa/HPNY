"use client"
import React, { useEffect, useRef, useState } from "react"
import CategoryList from "@/components/CategoryList"
import { GridLayout, RoomItem } from "@/components/RoomList"
import { useInfiniteQuery, useQuery } from "react-query"
import { useRouter } from "next/navigation"
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
import RoomItemWithHoverSlider from "@/components/RoomItemWithHoverSlider"

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

  const [sortBy, setSortBy] = useState("bookings")

  const fetchRooms = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/rooms?page=" + pageParam, {
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

  // 개별 숙소에 대한 이미지 슬라이드 로직
  const [activeRoom, setActiveRoom] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: number]: number
  }>({})

  const handleMouseEnter = (roomId: number, roomImages: string[]) => {
    if (roomImages.length > 1) {
      setActiveRoom(roomId)
      setCurrentImageIndex((prevState) => ({
        ...prevState,
        [roomId]: 0,
      }))
    }
  }

  const handleMouseLeave = (roomId: number) => {
    setActiveRoom(null)
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [roomId]: 0,
    }))
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (activeRoom !== null) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevState) => ({
          ...prevState,
          [activeRoom]:
            prevState[activeRoom] !== undefined
              ? (prevState[activeRoom] + 1) %
                rooms?.pages
                  ?.flatMap((page) => page.data)
                  .find((room: RoomType) => room.id === activeRoom)?.images
                  .length
              : 0,
        }))
      }, 2000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [activeRoom, rooms])

  return (
    <>
      <section className="relative mb-8 mt-20">
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
              <RoomItemWithHoverSlider key={room.id} room={room} />
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
          rooms?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page?.data?.map((room: RoomType) => (
                <div
                  key={room.id}
                  onMouseEnter={() => handleMouseEnter(room.id, room.images)}
                  onMouseLeave={() => handleMouseLeave(room.id)}
                >
                  <RoomItem
                    room={{
                      ...room,
                      images: [
                        room.images[currentImageIndex[room.id] || 0] ||
                          "/default-image.jpg",
                      ],
                    }}
                  />
                </div>
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
