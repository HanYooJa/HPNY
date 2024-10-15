"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

interface ActivityCommentFormProps {
  activityId: number
  refetch: () => void
}

export default function ActivityCommentForm({
  activityId,
  refetch,
}: ActivityCommentFormProps) {
  const [comment, setComment] = useState<string>("")

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("댓글을 입력하세요.")
      return
    }

    try {
      const res = await axios.post(`/api/activities/${activityId}/comments`, {
        body: comment,
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
    </form>
  )
}
