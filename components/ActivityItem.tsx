"use client"

import { ActivityType } from "@/interface"
import Link from "next/link"
import Image from "next/image"
import { BLUR_DATA_URL } from "@/constants"

// ActivityItem 컴포넌트
const ActivityItem = ({ activity }: { activity: ActivityType }) => {
  return (
    <div key={activity.id}>
      <Link href={`/activities/${activity.id}`}>
        <div className="h-[320px] md:h-[240px] overflow-hidden relative z-0">
          <Image
            src={activity?.images?.[0] || "/images/default-image.png"} // 기본 이미지 경로
            alt={activity.title}
            style={{ objectFit: "cover" }}
            fill
            placeholder="blur"
            sizes="(min-width: 640px) 240px, 320px"
            blurDataURL={BLUR_DATA_URL}
            className="rounded-md w-full h-auto object-fit hover:shadow-lg"
          />
        </div>
        <div className="mt-2 font-semibold text-sm">{activity.title}</div>
        <span className="text-xs px-2 py-1 rounded-full bg-black text-white mt-1">
          {activity.category} {/* 카테고리 추가 */}
        </span>
        <div className="mt-1 text-xs text-gray-500">
          {activity.address} {/* 위치 정보 추가 */}
        </div>
        <div className="mt-1 text-sm">
          {activity.price.toLocaleString()}원 {/* 가격 표시 */}
          <span className="text-gray-500"> /인</span>
        </div>
      </Link>
    </div>
  )
}

export default ActivityItem
