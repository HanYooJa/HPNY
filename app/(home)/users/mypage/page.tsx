"use client"

import { useSession, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AiOutlineUser, AiOutlineHeart, AiOutlineComment } from "react-icons/ai"
import { BsBookmark } from "react-icons/bs"
import axios from "axios"
import { useRecoilState } from "recoil"
import { roleState } from "@/atom"

export default function UserMyPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [currentRole, setCurrentRole] = useRecoilState(roleState) // Recoil에서 roleState 값 가져오기

  // 세션에서 역할 정보를 Recoil 상태로 업데이트
  useEffect(() => {
    if (session?.user?.role) {
      setCurrentRole(session.user.role)
    }
  }, [session, setCurrentRole])

  const handleSwitchRole = async () => {
    setLoading(true)
    try {
      if (currentRole === "USER") {
        await axios.post("/api/upgrade-to-seller")
        alert("판매자로 전환되었습니다.")
        setCurrentRole("SELLER")
      } else {
        await axios.post("/api/switch-to-user")
        alert("사용자로 전환되었습니다.")
        setCurrentRole("USER")
      }

      const newSession = await getSession()
      if (newSession?.user?.role === "SELLER") {
        router.push("/seller/mypage")
      } else {
        router.push("/users/mypage")
      }
    } catch (error) {
      console.error("역할 전환 중 오류 발생:", error)
      alert("역할 전환에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <p>로딩 중...</p>
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <p>로그인이 필요합니다.</p>
        <Link href="/users/signin">로그인 페이지로 이동</Link>
      </div>
    )
  }

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
            <h1 className="font-semibold">찜한 숙소 및 활동</h1>
            <h2 className="text-sm text-gray-500">
              찜한 숙소 및 활동 모아보기
            </h2>
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

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSwitchRole}
          className="bg-lime-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading
            ? "전환 중..."
            : currentRole === "SELLER"
              ? "사용자로 전환"
              : "판매자로 전환"}
        </button>
      </div>
    </div>
  )
}
