"use client"

import { RoomType } from "@/interface"
import axios from "axios"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"

interface CommentFormProps {
  room?: RoomType
  activityId?: number
  refetch: () => void
}

export default function CommentForm({
  room,
  activityId = 0,
  refetch,
}: CommentFormProps) {
  const [comment, setComment] = useState<string>("")
  const { data: session } = useSession()

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("댓글을 입력하세요.")
      return
    }

    try {
      let apiUrl = ""

      if (room) {
        apiUrl = `/api/rooms/${room.id}/comments`
      } else if (activityId) {
        apiUrl = `/api/activities/${activityId}/comments`
      }

      const res = await axios.post(apiUrl, {
        body: comment,
        userId: session?.user?.id,
      })

      if (res.status === 200) {
        toast.success("댓글이 작성되었습니다.")
        setComment("")
        refetch()
      } else {
        toast.error("댓글 작성에 실패했습니다.")
      }
    } catch (error) {
      console.error("댓글 작성 중 오류:", error)
      toast.error("댓글 작성 중 오류가 발생했습니다.")
    }
  }

  return (
    <form className="mt-8">
      {session && (
        <>
          <textarea
            rows={3}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="후기를 작성해주세요..."
            className="w-full block min-h-[120px] resize-none border rounded-md bg-transparent py-2.5 px-4 placeholder:text-gray-400 text-sm leading-6 outline-none focus:border-black"
            required
          />
          <div className="flex flex-row-reverse mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-lime-600 hover:bg-lime-500 text-white px-8 py-2.5 text-sm font-semibold shadow-sm rounded-md"
            >
              작성하기
            </button>
          </div>
        </>
      )}
    </form>
  )
}
