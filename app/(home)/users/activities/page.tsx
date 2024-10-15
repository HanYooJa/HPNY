"use client"

import { Loader } from "@/components/Loader"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"
import { ActivityType } from "@/interface"
import axios from "axios"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import Link from "next/link"
import React, { useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { useInfiniteQuery } from "react-query"
import { useRecoilValue } from "recoil"
import { searchState } from "@/atom"
import ActivitySearchFilter from "@/components/Form/ActivitySearchFilter"

export default function UserActivities() {
  const observerRef = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(observerRef, {})
  const isPageEnd = !!pageRef?.isIntersecting
  const { data: session } = useSession()
  const searchStateValue = useRecoilValue(searchState)

  const searchParams = {
    q: searchStateValue.q,
  }

  const fetchMyActivities = async ({ pageParam = 1 }) => {
    // 현재 사용자가 등록한 활동만 불러오기 위해 my=true 추가
    const { data } = await axios.get(
      "/api/activities?my=true&page=" + pageParam,
      {
        params: {
          limit: 12,
          page: pageParam,
          ...searchParams,
        },
      },
    )

    return data
  }

  const {
    data: activities,
    isError,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [`activities-user-${session?.user?.id}`, searchParams],
    fetchMyActivities,
    {
      getNextPageParam: (lastPage) =>
        lastPage?.data.length > 0 ? lastPage.page + 1 : undefined,
    },
  )

  async function deleteImages(imageKeys: string[] | null) {
    if (imageKeys) {
      for (const key of imageKeys) {
        try {
          const res = await axios.post("/api/cloudinary-delete", {
            public_id: key,
          })

          if (res.status === 200) {
            console.log("File Deleted: ", key)
          } else {
            console.log("Cloudinary delete failed for: ", key)
          }
        } catch (error) {
          console.error("Error deleting image:", error)
        }
      }
    }
    return imageKeys
  }

  const handleDelete = async (data: ActivityType) => {
    const confirm = window.confirm("해당 체험을 삭제하시겠습니까?")

    if (confirm && data) {
      try {
        await deleteImages(data.imageKeys || null)
        const result = await axios.delete(`/api/activities?id=${data.id}`)

        if (result.status === 200) {
          toast.success("체험을 삭제했습니다.")
          refetch()
        } else {
          toast.error("데이터 삭제 중 문제가 생겼습니다.")
        }
      } catch (e) {
        console.log(e)
        toast.error("다시 시도해주세요")
      }
    }
  }

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }
  }, [fetchNextPage, hasNextPage, isPageEnd])

  if (!!isError) {
    throw new Error("activity API fetching error")
  }

  return (
    <div className="mt-10 mb-40 max-w-7xl mx-auto overflow-auto px-8">
      <h1 className="mb-10 text-lg md:text-2xl font-semibold">
        나의 체험 관리
      </h1>
      <ActivitySearchFilter />
      <table className="text-sm text-left text-gray-500 shadow-lg overflow-x-scroll table-auto">
        <thead className="text-xs text-gray-700 bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6 min-w-[120px]">
              체험
            </th>
            <th scope="col" className="py-3 px-6 min-w-[300px]">
              주소
            </th>
            <th scope="col" className="py-3 px-6 min-w-[120px]">
              카테고리
            </th>
            <th scope="col" className="py-3 px-6 min-w-[120px]">
              가격
            </th>
            <th scope="col" className="py-3 px-6 min-w-[200px]">
              생성 날짜
            </th>
            <th scope="col" className="py-3 px-6 min-w-[200px]">
              업데이트 날짜
            </th>
            <th scope="col" className="py-3 px-6 min-w-[80px]">
              상세 보기
            </th>
            <th scope="col" className="py-3 px-6 min-w-[80px]">
              삭제
            </th>
          </tr>
        </thead>
        <tbody>
          {activities?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page?.data.map((activity: ActivityType) => (
                <tr className="bg-white border-b" key={activity.id}>
                  <td className="px-6 py-4 min-w-[200px]">{activity.title}</td>
                  <td className="px-6 py-4">{activity.address}</td>
                  <td className="px-6 py-4">{activity.category}</td>
                  <td className="px-6 py-4">
                    {activity.price?.toLocaleString()} 원
                  </td>
                  <td className="px-6 py-4">
                    {dayjs(activity.createdAt).format("YYYY-MM-DD HH:MM:ss")}
                  </td>
                  <td className="px-6 py-4">
                    {dayjs(activity.updatedAt).format("YYYY-MM-DD HH:MM:ss")}
                  </td>
                  <td className="px-6 py-4 min-w-[80px]">
                    <Link
                      href={`/activities/${activity.id}`}
                      className="font-medium text-gray-600 hover:underline"
                    >
                      보기
                    </Link>
                  </td>
                  <td className="px-6 py-4 min-w-[80px]">
                    <button
                      type="button"
                      onClick={() => {
                        handleDelete(activity)
                      }}
                      className="font-medium text-gray-600 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {(isFetching || hasNextPage || isFetchingNextPage) && (
        <Loader className="my-20" />
      )}
      <div className="w-full touch-none h-10 mb-10" ref={observerRef} />
    </div>
  )
}
