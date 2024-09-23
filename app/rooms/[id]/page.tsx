"use client" // 클라이언트 컴포넌트로 설정

import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import FeatureSection from "@/components/RoomDetail/FeatureSection"
import HeaderSection from "@/components/RoomDetail/HeaderSection"
import { ParamsProps, RoomType } from "@/interface"
import dynamic from "next/dynamic"

export default function RoomPage({ params }: ParamsProps) {
  const { id } = params
  const [data, setData] = useState<RoomType | null>(null)

  // 클라이언트 측에서 조회수 증가 및 데이터 가져오기
  useEffect(() => {
    const fetchDataAndIncrementViews = async () => {
      try {
        // 조회수 증가 API 호출
        await fetch(`/api/rooms/${id}/view`, {
          method: "POST",
        })

        // 숙소 데이터 가져오기
        const res = await fetch(`/api/rooms/${id}`, {
          cache: "no-store", // 캐시 없이 최신 데이터 가져오기
        })

        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }

        const roomData = await res.json()
        setData(roomData)
      } catch (e) {
        console.error(e)
      }
    }

    fetchDataAndIncrementViews()
  }, [id])

  // 데이터가 로드되기 전 로딩 상태 표시
  if (!data) return <Loader />

  // 동적 컴포넌트 로딩
  const Comment = dynamic(() => import("@/components/Comment"), {
    loading: () => <Loader />,
  })

  const MapSection = dynamic(
    () => import("@/components/RoomDetail/MapSection"),
    {
      loading: () => <Loader />,
      ssr: false,
    },
  )

  return (
    <div className="mt-8 mb-20 max-w-6xl mx-auto">
      <HeaderSection data={data} />

      {/* 조회수 표시 부분 */}
      <div className="my-4 text-sm text-gray-600">
        조회수: {data.views?.toLocaleString() || 0}회
      </div>

      <FeatureSection data={data} />
      <Comment room={data} />
      <MapSection data={data} />
    </div>
  )
}
