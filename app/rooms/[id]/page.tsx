"use client"

import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import FeatureSection from "@/components/RoomDetail/FeatureSection"
import HeaderSection from "@/components/RoomDetail/HeaderSection"
import CommentList from "@/components/Comment/CommentList"
import CommentForm from "@/components/Comment/CommentForm"
import { ParamsProps, RoomType, CommentApiType } from "@/interface"
import dynamic from "next/dynamic"

export default function RoomPage({ params }: ParamsProps) {
  const { id } = params
  const [data, setData] = useState<RoomType | null>(null)
  const [comments, setComments] = useState<CommentApiType | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true)

  // 숙소 조회수 증가 및 데이터 가져오기
  useEffect(() => {
    const fetchDataAndIncrementViews = async () => {
      try {
        await fetch(`/api/rooms/${id}/view`, {
          method: "POST",
        })

        const res = await fetch(`/api/rooms/${id}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch room data")
        }

        const roomData = await res.json()
        console.log(roomData) // 데이터를 콘솔에 출력해서 확인
        setData(roomData)
      } catch (e) {
        console.error(e)
      }
    }

    fetchDataAndIncrementViews()
  }, [id])

  // 숙소 댓글을 가져오는 함수
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?roomId=${id}&limit=10&page=1`)
      if (!res.ok) throw new Error("Failed to fetch comments")
      const data = await res.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [id])

  if (!data) return <Loader />

  const MapSection = dynamic(
    () => import("@/components/RoomDetail/MapSection"),
    {
      loading: () => <Loader />,
      ssr: false,
    },
  )

  return (
    <div className="mt-8 mb-20 max-w-6xl mx-auto">
      <HeaderSection data={data} />

      <div className="my-4 text-sm text-gray-600">
        조회수: {data.views?.toLocaleString() || 0}회
      </div>

      <FeatureSection data={data} comments={comments?.totalCount || 0} />

      <div className="mt-8 mb-20">
        {isLoadingComments ? (
          <Loader />
        ) : (
          <CommentList
            isLoading={isLoadingComments}
            comments={comments}
            roomId={parseInt(id)}
            activityId={0}
          />
        )}
      </div>

      <div className="mt-8">
        <CommentForm room={data} activityId={0} refetch={fetchComments} />
      </div>

      <MapSection data={data} />
    </div>
  )
}
