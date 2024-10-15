"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { SiNaver } from "react-icons/si"
import { RiKakaoTalkFill } from "react-icons/ri"
import toast from "react-hot-toast"
import { useSetRecoilState } from "recoil"
import { roleState } from "@/atom"

export default function SignInPage() {
  const router = useRouter()
  const { status, data: session } = useSession()
  const [isSeller, setIsSeller] = useState(false)
  const setRole = useSetRecoilState(roleState)

  useEffect(() => {
    if (status === "authenticated") {
      setRole(session?.user?.role || "USER")
      if (session?.user?.role === "SELLER") {
        router.push("/seller/mypage")
      } else {
        router.push("/users/mypage")
      }
    }
  }, [status, session, router, setRole])

  const handleClick = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: `/?isSeller=${isSeller}` })
    } catch (e) {
      toast.error("다시 시도해주세요")
    }
  }

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold text-center">
          로그인 또는 회원가입
        </h1>
        <hr className="border-b-gray-300" />
        <div className="text-xl md:text-2xl font-semibold">
          Comma에 오신 것을 환영합니다.
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        SNS 계정을 이용해서 로그인 또는 회원가입을 해주세요.
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={() => setIsSeller(false)}
          className={`px-4 py-2 rounded-md ${
            !isSeller ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          사용자 로그인
        </button>
        <button
          type="button"
          onClick={() => setIsSeller(true)}
          className={`px-4 py-2 rounded-md ${
            isSeller ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          판매자 로그인
        </button>
      </div>

      <div className="flex flex-col gap-5 mt-16">
        <button
          type="button"
          onClick={() => handleClick("google")}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <FcGoogle className="absolute left-5 text-xl my-auto inset-y-0" />
          구글로 {isSeller ? "판매자" : "사용자"} 로그인하기
        </button>
        <button
          type="button"
          onClick={() => handleClick("naver")}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <SiNaver className="absolute left-6 text-green-400 my-auto inset-y-0" />
          네이버로 {isSeller ? "판매자" : "사용자"} 로그인하기
        </button>
        <button
          type="button"
          onClick={() => handleClick("kakao")}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <RiKakaoTalkFill className="absolute left-5 text-yellow-950 text-xl my-auto inset-y-0" />
          카카오로 {isSeller ? "판매자" : "사용자"} 로그인하기
        </button>
      </div>
    </div>
  )
}
