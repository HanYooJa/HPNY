import { ActivityType } from "@/interface"
import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { BLUR_DATA_URL } from "@/constants"

// ActivityItem: 개별 활동을 렌더링하는 컴포넌트
export function ActivityItem({ activity }: { activity: ActivityType }) {
  return (
    <div key={activity.id}>
      <Link href={`/activities/${activity.id}`}>
        <div className="h-[320px] md:h-[240px] overflow-hidden relative z-0">
          <Image
            src={activity?.images?.[0] || "/default-image.jpg"} // 이미지가 없으면 기본 이미지로 대체
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
          {activity.category}
        </span>
        <div className="mt-1 text-gray-400 text-sm">{activity.address}</div>
        <div className="mt-1 text-sm">
          {activity?.price ? activity.price.toLocaleString() : "가격 정보 없음"}
          원<span className="text-gray-500"> /회</span>
        </div>
      </Link>
    </div>
  )
}

// GridLayout: 그리드 레이아웃을 렌더링하는 컴포넌트
export function GridLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20 sm:px-4 md:px-8 lg:px-16">
      {children}
    </div>
  )
}
