"use client"

import { useState } from "react"
import { BiChevronRight } from "react-icons/bi"
import CommentListModal from "./CommentListModal"
import { CommentApiType } from "@/interface"
import { Loader } from "../Loader"
import dayjs from "dayjs"
import "dayjs/locale/ko"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export default function CommentList({
  isLoading,
  comments,
  activityId = 0,
  roomId,
}: {
  isLoading: boolean
  comments: CommentApiType | null
  activityId?: number
  roomId: number
}) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const closeModal = () => {
    setIsOpenModal(false)
  }

  const openModal = () => {
    setIsOpenModal(true)
  }

  return (
    <>
      <h1 className="font-semibold text-xl mb-2">
        후기 {comments?.totalCount || 0}개
      </h1>
      <div className="mt-8 grid md:grid-cols-2 gap-12">
        {isLoading ? (
          <Loader className="md:col-span-2" />
        ) : (
          comments?.data?.slice(0, 4).map((comment) => (
            <div key={comment?.id} className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <img
                  src={comment?.user?.image || "/images/user-icon.png"}
                  alt="profile img"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h1 className="font-semibold">
                    {comment?.user?.name || "-"}
                  </h1>
                  <div className="text-gray-500 text-xs">
                    {dayjs(comment?.createdAt)
                      .tz(dayjs.tz.guess())
                      .format("YYYY-MM-DD HH:mm:ss")}
                  </div>
                </div>
              </div>
              <div className="max-w-md text-gray-600">{comment?.body}</div>
              <button
                type="button"
                onClick={openModal}
                className="underline font-semibold flex gap-1 items-center justify-start"
              >
                더보기 <BiChevronRight className="text-xl" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 mb-20">
        <button
          type="button"
          onClick={openModal}
          className="border border-gray-700 font-semibold rounded-lg px-6 py-4 flex items-center gap-4 hover:bg-black/5"
        >
          후기 {comments?.totalCount || 0}개 모두 보기
        </button>
      </div>

      {isOpenModal && (
        <CommentListModal
          isOpen={isOpenModal}
          closeModal={closeModal}
          roomId={roomId}
          activityId={activityId}
        />
      )}
    </>
  )
}
