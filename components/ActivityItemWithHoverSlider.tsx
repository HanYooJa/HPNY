import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ActivityType } from "@/interface"
import { BLUR_DATA_URL } from "@/constants"

export default function ActivityItemWithHoverSlider({
  activity,
}: {
  activity: ActivityType
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activity.images.length > 1 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === activity.images.length - 1 ? 0 : prevIndex + 1,
        )
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [activity.images.length])

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleMouseLeave = () => {
    if (activity.images.length > 1 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === activity.images.length - 1 ? 0 : prevIndex + 1,
        )
      }, 5000) // 다시 5초마다 슬라이드 재개
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-[320px] md:h-[240px] overflow-hidden relative z-0">
        <Image
          src={activity.images[currentImageIndex] || "/default-image.jpg"}
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
      <div className="mt-1 text-sm">
        {activity?.price?.toLocaleString()}원{" "}
        <span className="text-gray-500">/ 체험</span>
      </div>
    </div>
  )
}
