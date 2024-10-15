import { ActivityType } from "@/interface"
import ActivityBookingSection from "./ActivityBookingSection"
import Image from "next/image"
import CalendarSection from "../ActivityDetail/CalendarSection"

export default function FeatureSection({ data }: { data: ActivityType }) {
  return (
    <div className="md:grid md:grid-cols-3 gap-8 mt-8 relative">
      <div className="col-span-2">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-lg md:text-xl">
              {data?.user?.name ?? "호스트"}님이 주최하는 활동
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {data?.user?.desc ?? "호스트 설명이 없습니다."}
            </p>
          </div>
          <Image
            src={data?.user?.image || "/images/user.png"}
            alt="호스트 이미지"
            width={50}
            height={50}
            className="rounded-full shadow"
          />
        </div>

        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl">활동 설명</h1>
          {data?.desc ?? "설명이 없습니다."}
        </div>

        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl">활동 장소</h1>
          {data?.address ?? "활동 장소 설명이 없습니다."}
        </div>

        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl mb-2">캘린더</h1>
          <CalendarSection />
        </div>
      </div>

      <ActivityBookingSection data={data} comments={0} />
    </div>
  )
}
