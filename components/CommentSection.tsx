"use client"

import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import CommentList from "@/components/Comment/CommentList"
import { CommentApiType } from "@/interface"

export default function CommentSection({
  isLoading,
  comments,
  roomId, // roomId는 필수로 변경
  activityId, // activityId는 선택적
}: {
  isLoading: boolean
  comments: CommentApiType | null
  roomId: number // roomId 필수
  activityId?: number // activityId는 선택적
}) {
  const [commentBody, setCommentBody] = useState("") // 댓글 입력 상태
  const [isSubmitting, setIsSubmitting] = useState(false) // 제출 상태
  const [updatedComments, setUpdatedComments] = useState<CommentApiType | null>(
    comments,
  ) // 업데이트된 댓글 상태
  const [loadingComments, setLoadingComments] = useState(isLoading) // 댓글 로딩 상태

  // 페이지가 처음 로드될 때 전체 댓글 목록을 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true) // 로딩 시작
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

        // totalCount를 포함하여 상태를 업데이트
        setUpdatedComments({
          ...initialComments,
          totalCount: initialComments.totalCount, // totalCount 값이 올바르게 전달되도록 확인
        })
      } catch (error) {
        console.error("댓글 가져오기 오류:", error)
      } finally {
        setLoadingComments(false) // 로딩 종료
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
          roomId, // roomId 사용
          activityId, // activityId가 있는 경우만 사용
          body: commentBody,
        }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setCommentBody("") // 입력 필드 초기화

        // 댓글 작성 후 전체 댓글 목록을 다시 가져오기
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

        // totalCount도 함께 업데이트
        setUpdatedComments({
          ...updatedCommentsList,
          totalCount: updatedCommentsList.totalCount, // totalCount가 정확히 반영되는지 확인
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
        후기 {updatedComments?.totalCount || 0}개 {/* 총 댓글 개수 표시 */}
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
            roomId={roomId} // roomId 전달
            activityId={activityId} // activityId가 있는 경우 전달
          />
        )
      )}
    </div>
  )
}
