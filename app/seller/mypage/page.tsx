"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { AiOutlineUser, AiOutlineHeart, AiOutlineComment } from "react-icons/ai"
import { BsHouseAdd, BsHouseCheck, BsBookmark } from "react-icons/bs"
import { MdOutlineSportsEsports, MdSportsEsports } from "react-icons/md"

export default function SellerMyPage() {
  const { data: session, status } = useSession()

  // 세션 로딩 중일 때 처리
  if (status === "loading") {
    return <p>로딩 중...</p>
  }

  // 세션이 없는 경우(비인증 상태)
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
        {/* 판매자 전용: 숙소 등록 */}
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

        {/* 판매자 전용: 숙소 관리 */}
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

        {/* 판매자 전용: 체험활동 등록 */}
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

        {/* 판매자 전용: 체험활동 관리 */}
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

        {/* 판매자 전용: 나의 숙소 예약 내역 */}
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
