"use client"

import { RoomType } from "@/interface"
import DetailRoomMap from "../Map/DetailRoomMap"

export default function MapSection({ data }: { data: RoomType }) {
  console.log("Room data:", data) // 데이터 확인

  return (
    <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
      <h1 className="font-semibold text-xl mb-2">호스팅 지역</h1>
      <div className="mt-4">
        {/* DetailRoomMap 컴포넌트에 숙소 데이터를 전달 */}
        <DetailRoomMap data={data} />
      </div>
      <div className="mt-8 font-semibold">{data?.address}</div>
      <div className="mt-3 text-gray-600">{data?.desc}</div>
    </div>
  )
}
