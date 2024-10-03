"use client"

import { useSession, signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AiOutlineUser, AiOutlineHeart, AiOutlineComment } from "react-icons/ai"
import { BsBookmark } from "react-icons/bs"
import axios from "axios"

export default function UserMyPage() {
  const { data: session, status } = useSession() // 세션 데이터 가져오기
  const [loading, setLoading] = useState(false) // 로딩 상태 관리
  const router = useRouter()

  // 역할 전환 핸들러
  const handleSwitchRole = async () => {
    setLoading(true)
    try {
      // 현재 역할에 따라 API 호출
      if (session?.user?.role === "USER") {
        await axios.post("/api/upgrade-to-seller")
        alert("판매자로 전환되었습니다.")
      } else {
        await axios.post("/api/switch-to-user")
        alert("사용자로 전환되었습니다.")
      }

      // 세션을 강제로 다시 로드
      const newSession = await getSession() // 새 세션 가져오기
      if (newSession?.user?.role === "SELLER") {
        router.push("/seller/mypage") // 판매자로 전환되었을 때 판매자 마이페이지로 리다이렉션
      } else {
        router.push("/users/mypage") // 사용자가 될 경우 사용자 마이페이지로 리다이렉션
      }
    } catch (error) {
      console.error("역할 전환 중 오류 발생:", error)
      alert("역할 전환에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 로딩 상태 처리
  if (status === "loading") {
    return <p>로딩 중...</p>
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (status === "unauthenticated") {
    return (
      <div>
        <p>로그인이 필요합니다.</p>
        <Link href="/users/signin">로그인 페이지로 이동</Link>
      </div>
    )
  }

  // 사용자 마이페이지 UI
  return (
    <div className="mt-10 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-semibold">계정</h1>
      <div className="flex gap-2 mt-2 text-lg">
        <div className="font-semibold">{session?.user?.name || "사용자"}</div>
        <div className="font-semibold">·</div>
        <div className="text-gray-700">
          {session?.user?.email || "user@comma.com"}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-12 mb-20">
        <Link
          href="/users/info"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <AiOutlineUser className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">개인정보</h1>
            <h2 className="text-sm text-gray-500">개인정보 및 연락처</h2>
          </div>
        </Link>
        <Link
          href="/users/likes"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <AiOutlineHeart className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">찜한 숙소</h1>
            <h2 className="text-sm text-gray-500">찜한 숙소 모아보기</h2>
          </div>
        </Link>
        <Link
          href="/users/comments"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <AiOutlineComment className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">나의 댓글</h1>
            <h2 className="text-sm text-gray-500">나의 댓글 모아보기</h2>
          </div>
        </Link>
        <Link
          href="/users/bookings"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <BsBookmark className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">나의 예약</h1>
            <h2 className="text-sm text-gray-500">나의 예약 모아보기</h2>
          </div>
        </Link>
      </div>

      {/* 역할 전환 버튼 표시 */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSwitchRole}
          className="bg-blue-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading
            ? "전환 중..."
            : session?.user?.role === "SELLER"
              ? "사용자로 전환"
              : "판매자로 전환"}
        </button>
      </div>
    </div>
  )
}
