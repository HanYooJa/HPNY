"use client"

import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import FeatureSection from "@/components/ActivityDetail/FeatureSection"
import ActivityMapSection from "@/components/ActivityDetail/ActivityMapSection"
import LikeButton from "@/components/ActivityDetail/LikeButton"
import ShareButton from "@/components/ActivityDetail/ShareButton"
import { ActivityType } from "@/interface"
import ActivityHeaderSection from "@/components/ActivityDetail/ActivityHeaderSection"

export default function ActivityDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [activity, setActivity] = useState<ActivityType | null>(null)

  // 활동 조회수 증가 및 데이터 가져오기
  const fetchActivityAndIncrementViews = async (id: string) => {
    try {
      // 조회수 증가 API 호출
      await fetch(`/api/activities/${id}/view`, {
        method: "POST",
      })

      // 활동 데이터 가져오기
      const res = await fetch(`/api/activities/${id}`)
      if (!res.ok) {
        return null
      }
      return await res.json()
    } catch (error) {
      console.error("Failed to fetch activity:", error)
      return null
    }
  }

  useEffect(() => {
    const loadActivity = async () => {
      const data = await fetchActivityAndIncrementViews(params.id)
      if (!data) {
        notFound()
      } else {
        setActivity(data)
      }
    }
    loadActivity()
  }, [params.id])

  if (!activity) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4">
      {/* 최상단에 ActivityHeaderSection을 배치 */}
      <ActivityHeaderSection data={activity} />

      {/* 조회수 표시 */}
      <div className="my-4 text-sm text-gray-600">
        조회수: {activity.views?.toLocaleString() || 0}회
      </div>

      {/* 활동 설명 섹션 */}
      <FeatureSection data={activity} />

      {/* 지도 섹션 */}
      <ActivityMapSection data={activity} />
    </div>
  )
}
