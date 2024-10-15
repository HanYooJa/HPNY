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

  useEffect(() => {
    const fetchActivityAndIncrementViews = async () => {
      try {
        await fetch(`/api/activities/${activityId}/view`, { method: "POST" })
        const res = await fetch(`/api/activities/${activityId}`)
        if (!res.ok) throw new Error("Failed to fetch activity data")

        const data = await res.json()
        setActivity(data)
        setIsLoadingActivity(false)
      } catch (error) {
        console.error("Error fetching activity:", error)
      }
    }

    fetchActivityAndIncrementViews()
  }, [activityId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/activities/${activityId}/comments`)
      if (!res.ok) throw new Error("Failed to fetch comments")

      const data = await res.json()
      setComments(data)
      setIsLoadingComments(false)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  useEffect(() => {
    fetchComments()
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
      <ActivityHeaderSection data={activity} />
      <div className="my-4 text-sm text-gray-600">
        조회수: {activity.views?.toLocaleString() || 0}회
      </div>
      <FeatureSection data={activity} />
      <div className="mt-8 mb-20">
        {isLoadingComments ? (
          <Loader />
        ) : (
          <CommentList
            isLoading={isLoadingComments}
            comments={comments}
            activityId={activityId}
            roomId={0}
          />
        )}
      </div>
      <div className="mt-8">
        <ActivityCommentForm activityId={activityId} refetch={fetchComments} />
      </div>
      <MapSection data={activity} />
    </div>
  )
}
