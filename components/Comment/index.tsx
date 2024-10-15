"use client"

import { useQuery } from "react-query"
import { RoomType } from "@/interface"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"
import axios from "axios"

export default function Comment({
  room,
  activityId,
}: {
  room: RoomType
  activityId: number
}) {
  const fetchComments = async () => {
    const { data } = await axios(
      `/api/comments?roomId=${room.id}&activityId=${activityId}&limit=6`,
    )
    return data
  }

  const {
    data: comments,
    refetch,
    isLoading,
  } = useQuery(`room-${room.id}-comment`, fetchComments, {
    enabled: !!room.id,
  })

  return (
    <div className="border-b border-gray-300 py-8 px-4">
      <CommentList
        comments={comments}
        isLoading={isLoading}
        roomId={room.id}
        activityId={activityId}
      />
      <CommentForm room={room} activityId={activityId} refetch={refetch} />{" "}
    </div>
  )
}
