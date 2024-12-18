"use client"

import { ActivityType } from "@/interface"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useQuery } from "react-query"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { useSession } from "next-auth/react"

export default function LikeButton({ activity }: { activity: ActivityType }) {
  const { data: session } = useSession()

  const fetchActivity = async () => {
    const { data } = await axios(`/api/activities?id=${activity.id}`)
    return data as ActivityType
  }

  const { data: activityData, refetch } = useQuery<ActivityType>(
    `like-activity-${activity.id}`,
    fetchActivity,
    {
      enabled: !!activity.id,
      refetchOnWindowFocus: false,
    },
  )

  const toggleLike = async () => {
    // 찜하기 / 찜 취소하기 로직
    if (session?.user && activity) {
      try {
        const like = await axios.post("/api/likes", {
          activityId: activity.id,
        })
        if (like.status === 201) {
          toast.success("활동을 찜했습니다")
        } else {
          toast.error("찜을 취소했습니다")
        }
        refetch()
      } catch (e) {
        console.log(e)
      }
    } else {
      toast.error("로그인 후 시도해주세요")
    }
  }

  return (
    <button
      onClick={toggleLike}
      type="button"
      className="flex gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-black/10"
    >
      {/* 로그인된 사용자가 좋아요를 누른 경우 */}
      {activityData?.likes?.length ? (
        <>
          <AiFillHeart className="text-red-500 hover:text-red-600 focus:text-red-600" />
          <span className="underline">취소</span>
        </>
      ) : (
        <>
          <AiOutlineHeart className="hover:text-red-600 focus:text-red-600" />
          <span className="underline">저장</span>
        </>
      )}
    </button>
  )
}
