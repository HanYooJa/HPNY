import React, { useState, useRef, useEffect } from "react"
import { RoomType } from "@/interface"
import { useRouter } from "next/navigation"

interface RoomItemWithHoverSliderProps {
  room: RoomType
}

const RoomItemWithHoverSlider: React.FC<RoomItemWithHoverSliderProps> = ({
  room,
}) => {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (room.images.length > 1 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === room.images.length - 1 ? 0 : prevIndex + 1,
        )
      }, 2000)
    }
  }

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setCurrentImageIndex(0) // 첫 번째 이미지로 돌아감
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div
      className="flex flex-col items-center justify-center p-4 bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={room.images[currentImageIndex] || "/default-image.jpg"}
        alt={room.title}
        className="w-64 h-48 object-cover mx-auto rounded-lg"
      />
      <h3 className="text-lg mt-3 font-semibold text-center">{room.title}</h3>
      <p className="text-gray-500 text-center mt-1">
        예약 횟수: {room.bookings?.length ?? 0}
      </p>
      <button
        onClick={() => router.push(`/rooms/${room.id}`)}
        className="mt-2 px-4 py-2 bg-lime-500 text-white text-sm rounded hover:bg-lime-600 transition"
      >
        자세히 보기
      </button>
    </div>
  )
}

export default RoomItemWithHoverSlider
