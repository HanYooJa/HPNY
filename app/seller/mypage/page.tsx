"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { BsHouseAdd, BsHouseCheck, BsBookmark } from "react-icons/bs"
import { MdOutlineSportsEsports, MdSportsEsports } from "react-icons/md"
import { useRouter } from "next/navigation"

export default function SellerMyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      return // 로딩 중에는 아무 것도 하지 않음
    }

    if (status === "unauthenticated") {
      router.push("/users/signin") // 로그인 페이지로 이동
    } else if (session?.user?.role === "USER") {
      router.push("/users/mypage") // 사용자 마이페이지로 이동
    }
  }, [session, status, router])

  if (status === "loading") {
    return <p>로딩 중...</p>
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
      </div>
    </div>
  )
}
