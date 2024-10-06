"use client"

import { ActivityType } from "@/interface"
import DetailRoomMap from "../Map/DetailRoomMap" // Room 대신 Activity에 맞는 DetailMap 컴포넌트 사용
import DetailActivityMap from "../Map/DetailActivityMap"

export default function ActivityMapSection({ data }: { data: ActivityType }) {
  console.log("Activity data:", data) // 데이터 확인

  return (
    <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
      <h1 className="font-semibold text-xl mb-2">활동 지역</h1>
      <div className="mt-4">
        {/* DetailRoomMap 컴포넌트에 활동 데이터를 전달 */}
        <DetailActivityMap data={data} />
      </div>
      <div className="mt-8 font-semibold">{data?.address}</div>
      <div className="mt-3 text-gray-600">{data?.desc}</div>
    </div>
  )
}
