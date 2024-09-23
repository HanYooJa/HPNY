"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AiOutlineUser, AiOutlineHeart, AiOutlineComment } from "react-icons/ai"
import { BsBookmark } from "react-icons/bs"
import SwitchRoleButton from "@/components/SwitchRoleButton"

export default function UserMyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "SELLER") {
      router.replace("/seller/mypage") // 판매자일 경우 판매자 마이페이지로 리다이렉션
    }
  }, [session, status, router])

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

      <div className="mt-8">
        <SwitchRoleButton isSeller={false} /> {/* 사용자 전환 버튼 */}
      </div>
    </div>
  )
}
