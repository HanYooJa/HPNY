"use client"

import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import FeatureSection from "@/components/ActivityDetail/FeatureSection"
import ActivityHeaderSection from "@/components/ActivityDetail/ActivityHeaderSection"
import CommentList from "@/components/Comment/CommentList"
import ActivityCommentForm from "@/components/Comment/ActivityCommentForm"
import { ActivityType, CommentApiType } from "@/interface"
import dynamic from "next/dynamic"

export default function ActivityDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const activityId = parseInt(params.id)
  const [activity, setActivity] = useState<ActivityType | null>(null)
  const [comments, setComments] = useState<CommentApiType | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true)
  const [isLoadingActivity, setIsLoadingActivity] = useState<boolean>(true)

  // 활동 데이터와 조회수 증가
  useEffect(() => {
    const fetchActivityAndIncrementViews = async () => {
      try {
        await fetch(`/api/activities/${activityId}/view`, { method: "POST" }) // 조회수 증가 API 호출
        const res = await fetch(`/api/activities/${activityId}`) // 활동 데이터 가져오기
        if (!res.ok) throw new Error("Failed to fetch activity data")

        const data = await res.json()
        setActivity(data) // 활동 데이터 상태 업데이트
        setIsLoadingActivity(false)
      } catch (error) {
        console.error("Error fetching activity:", error)
      }
    }

    fetchActivityAndIncrementViews()
  }, [activityId])

  // 활동 댓글 가져오기
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/activities/${activityId}/comments`) // 활동 댓글 데이터 가져오기
      if (!res.ok) throw new Error("Failed to fetch comments")

      const data = await res.json()
      setComments(data) // 댓글 상태 업데이트
      setIsLoadingComments(false)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  useEffect(() => {
    fetchComments() // 페이지 로드 시 댓글 데이터 가져오기
  }, [activityId])

  if (isLoadingActivity || !activity) return <Loader />

  const MapSection = dynamic(
    () => import("@/components/ActivityDetail/ActivityMapSection"),
    {
      loading: () => <Loader />,
      ssr: false,
    },
  )

  return (
    <div className="container mx-auto px-4 mt-8 mb-20 max-w-6xl">
      <ActivityHeaderSection data={activity} /> {/* 헤더 섹션 */}
      <div className="my-4 text-sm text-gray-600">
        조회수: {activity.views?.toLocaleString() || 0}회 {/* 조회수 표시 */}
      </div>
      <FeatureSection data={activity} /> {/* 활동 설명 섹션 */}
      {/* 댓글 섹션 */}
      <div className="mt-8 mb-20">
        {isLoadingComments ? (
          <Loader />
        ) : (
          <CommentList
            isLoading={isLoadingComments}
            comments={comments} // 댓글 데이터 전달
            activityId={activityId} // activityId 전달
            roomId={0} // roomId는 0으로 설정
          />
        )}
      </div>
      {/* 댓글 작성 섹션 */}
      <div className="mt-8">
        <ActivityCommentForm activityId={activityId} refetch={fetchComments} />
      </div>
      <MapSection data={activity} /> {/* 지도 섹션 */}
    </div>
  )
}
