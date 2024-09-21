"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { AiOutlineComment, AiOutlineHeart, AiOutlineUser } from "react-icons/ai"
import { BsHouseAdd, BsHouseCheck, BsBookmark } from "react-icons/bs"
import { MdOutlineSportsEsports, MdSportsEsports } from "react-icons/md"
import UpgradeToSeller from "@/components/UpgradeToSeller" // 판매자 전환 컴포넌트 임포트

export default function UserMyPage() {
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

  // 판매자 여부 확인
  const isSeller = session?.user?.role === "SELLER"

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
        {/* 공통 섹션: 개인정보 */}
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

        {/* 판매자 전용 섹션 */}
        {isSeller ? (
          <>
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
                <h2 className="text-sm text-gray-500">
                  나의 체험활동 등록하기
                </h2>
              </div>
            </Link>
            <Link
              href="/users/activities"
              className="shadow-lg rounded-lg flex flex-col justify-between p-4 gap-12 hover:shadow-xl"
            >
              <MdSportsEsports className="text-xl md:text-3xl" />
              <div>
                <h1 className="font-semibold">체험활동 관리</h1>
                <h2 className="text-sm text-gray-500">
                  나의 체험활동 관리하기
                </h2>
              </div>
            </Link>
            {/* 판매자 전용: 나의 숙소 예약 내역 */}
            <Link
              href="/seller/bookings" // 판매자 예약 내역 페이지로 리디렉션
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
          </>
        ) : (
          // 사용자 전용 섹션
          <>
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
          </>
        )}
      </div>

      {/* 판매자 전환 컴포넌트 */}
      {!isSeller && (
        <div className="mt-8">
          <UpgradeToSeller />
        </div>
      )}
    </div>
  )
}
