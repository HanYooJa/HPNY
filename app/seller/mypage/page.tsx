"use client"

import { useSession, getSession } from "next-auth/react"
import Link from "next/link"
import { BsHouseAdd, BsHouseCheck, BsBookmark } from "react-icons/bs"
import { MdOutlineSportsEsports, MdSportsEsports } from "react-icons/md"
import axios from "axios"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaBookmark } from "react-icons/fa6"

export default function SellerMyPage() {
  const { data: session, status, update } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 세션 동기화 훅 (항상 호출되도록)
  useEffect(() => {
    const syncSession = async () => {
      if (status === "authenticated") {
        const sessionData = await getSession()
        if (sessionData?.user?.role !== session?.user?.role) {
          await update() // 세션 동기화
        }
      }
    }

    if (status === "authenticated") {
      syncSession()
    }
  }, [session, status, update])

  // 페이지 로드 시 사용자의 역할 확인 및 리디렉션
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (status === "authenticated") {
        const sessionData = await getSession()
        console.log("Updated session:", sessionData)

        if (sessionData?.user?.role !== "SELLER") {
          router.push("/users/mypage") // SELLER가 아닐 경우 사용자 마이페이지로
        }
      }
    }

    if (status === "authenticated") {
      checkRoleAndRedirect()
    }
  }, [status, router])

  const handleSwitchRole = async () => {
    setLoading(true)
    try {
      if (session?.user?.role === "SELLER") {
        await axios.post("/api/switch-to-user")
        alert("사용자로 전환되었습니다.")
      } else {
        await axios.post("/api/upgrade-to-seller")
        alert("판매자로 전환되었습니다.")
      }

      await update()
      const newSession = await getSession()
      console.log("Updated session after role switch:", newSession)

      // 역할에 따라 적절한 페이지로 리디렉션
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

  // 세션이 로딩 중일 때 표시할 내용
  if (status === "loading") {
    return <p>로딩 중...</p>
  }

  // 세션이 없는 경우 로그인 페이지로 유도
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
      <h1 className="text-3xl font-semibold">판매자 마이페이지</h1>
      <div className="flex gap-2 mt-2 text-lg">
        <div className="font-semibold">{session?.user?.name || "판매자"}</div>
        <div className="font-semibold">·</div>
        <div className="text-gray-700">
          {session?.user?.email || "user@comma.com"}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-12 mb-20">
        <Link
          href="/rooms/register/category"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <BsHouseAdd className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">숙소 등록</h1>
            <h2 className="text-sm text-gray-500">나의 숙소 등록하기</h2>
          </div>
        </Link>
        <Link
          href="/users/rooms"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <BsHouseCheck className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">숙소 관리</h1>
            <h2 className="text-sm text-gray-500">나의 숙소 관리하기</h2>
          </div>
        </Link>
        <Link
          href="/activities/register/category"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <MdOutlineSportsEsports className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">체험활동 등록</h1>
            <h2 className="text-sm text-gray-500">나의 체험활동 등록하기</h2>
          </div>
        </Link>
        <Link
          href="/users/activities"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <MdSportsEsports className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">체험활동 관리</h1>
            <h2 className="text-sm text-gray-500">나의 체험활동 관리하기</h2>
          </div>
        </Link>
        <Link
          href="/seller/bookings"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <BsBookmark className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">나의 숙소 예약 내역</h1>
            <h2 className="text-sm text-gray-500">
              사용자가 예약한 내 숙소 내역 보기
            </h2>
          </div>
        </Link>
        <Link
          href="/seller/activities/bookings"
          className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
        >
          <FaBookmark className="text-xl md:text-3xl" />
          <div>
            <h1 className="font-semibold">나의 체험활동 예약 내역</h1>
            <h2 className="text-sm text-gray-500">
              사용자가 예약한 내 체험활동 내역 보기
            </h2>
          </div>
        </Link>
      </div>

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
