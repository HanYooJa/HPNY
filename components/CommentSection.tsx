"use client"

import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import CommentList from "@/components/Comment/CommentList"
import { CommentApiType } from "@/interface"

export default function CommentSection({
  isLoading,
  comments,
  roomId,
  activityId,
}: {
  isLoading: boolean
  comments: CommentApiType | null
  roomId: number
  activityId?: number
}) {
  const [commentBody, setCommentBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatedComments, setUpdatedComments] = useState<CommentApiType | null>(
    comments,
  )
  const [loadingComments, setLoadingComments] = useState(isLoading)

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true)
      try {
        let fetchUrl = ""

        // 숙소 페이지의 경우 roomId만 사용
        if (roomId) {
          fetchUrl = `/api/comments?roomId=${roomId}`
        }
        // 활동 페이지의 경우 activityId만 사용
        else if (activityId) {
          fetchUrl = `/api/comments?activityId=${activityId}`
        }

        const res = await fetch(fetchUrl)
        if (!res.ok) {
          throw new Error("댓글을 불러오는데 실패했습니다.")
        }

        const initialComments = await res.json()

        setUpdatedComments({
          ...initialComments,
          totalCount: initialComments.totalCount,
        })
      } catch (error) {
        console.error("댓글 가져오기 오류:", error)
      } finally {
        setLoadingComments(false)
      }
    }

    fetchComments()
  }, [roomId, activityId])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          activityId,
          body: commentBody,
        }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setCommentBody("")

        let fetchUrl = ""
        if (roomId) {
          fetchUrl = `/api/comments?roomId=${roomId}`
        } else if (activityId) {
          fetchUrl = `/api/comments?activityId=${activityId}`
        }

        const res = await fetch(fetchUrl)
        if (!res.ok) {
          throw new Error("댓글 목록 갱신에 실패했습니다.")
        }

        const updatedCommentsList = await res.json()

        setUpdatedComments({
          ...updatedCommentsList,
          totalCount: updatedCommentsList.totalCount,
        })
      } else {
        console.error("댓글 작성 실패")
      }
    } catch (error) {
      console.error("댓글 작성 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8">
      <h1 className="font-semibold text-xl mb-2">
        후기 {updatedComments?.totalCount || 0}개
      </h1>
      <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-4">
        <textarea
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="후기를 작성하세요..."
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          rows={3}
          required
        />
        <button
          type="submit"
          className={`bg-gray-800 text-white rounded-lg px-4 py-2 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader /> : "작성하기"}
        </button>
      </form>
      {loadingComments ? (
        <Loader />
      ) : (
        updatedComments && (
          <CommentList
            isLoading={false}
            comments={updatedComments}
            roomId={roomId}
            activityId={activityId}
          />
        )
      )}
    </div>
  )
}
