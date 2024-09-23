"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { SiNaver } from "react-icons/si"
import { RiKakaoTalkFill } from "react-icons/ri"
import toast from "react-hot-toast"

export default function SignInPage() {
  const router = useRouter()
  const { status } = useSession()
  const [isSeller, setIsSeller] = useState(false) // 판매자 로그인 여부 상태

  console.log("로그인 상태:", status)
  console.log("isSeller 상태:", isSeller) // isSeller 값 확인

  // 구글 로그인 핸들러
  const handleClickGoogle = () => {
    try {
      console.log("Google 로그인 시도, isSeller:", isSeller) // 디버그용 로그
      signIn("google", { callbackUrl: `/?isSeller=${isSeller}` }) // isSeller 값을 쿼리 매개변수로 전달
    } catch (e) {
      console.log(e)
      toast.error("다시 시도해주세요")
    }
  }

  // 네이버 로그인 핸들러
  const handleClickNaver = () => {
    try {
      console.log("Naver 로그인 시도, isSeller:", isSeller) // 디버그용 로그
      signIn("naver", { callbackUrl: `/?isSeller=${isSeller}` }) // isSeller 값을 쿼리 매개변수로 전달
    } catch (e) {
      console.log(e)
      toast.error("다시 시도해주세요")
    }
  }

  // 카카오 로그인 핸들러
  const handleClickKakao = () => {
    try {
      console.log("Kakao 로그인 시도, isSeller:", isSeller) // 디버그용 로그
      signIn("kakao", { callbackUrl: `/?isSeller=${isSeller}` }) // isSeller 값을 쿼리 매개변수로 전달
    } catch (e) {
      console.log(e)
      toast.error("다시 시도해주세요")
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      toast.error("접근할 수 없습니다.")
      router.replace("/")
    }
  }, [router, status])

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

      {/* 사용자와 판매자 토글 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={() => setIsSeller(false)}
          className={`px-4 py-2 rounded-md ${!isSeller ? "bg-gray-300" : "bg-gray-100"}`}
        >
          사용자 로그인
        </button>
        <button
          type="button"
          onClick={() => setIsSeller(true)}
          className={`px-4 py-2 rounded-md ${isSeller ? "bg-gray-300" : "bg-gray-100"}`}
        >
          판매자 로그인
        </button>
      </div>

      <div className="flex flex-col gap-5 mt-16">
        <button
          type="button"
          onClick={handleClickGoogle}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <FcGoogle className="absolute left-5 text-xl my-auto inset-y-0" />
          구글로 {isSeller ? "판매자" : "사용자"} 로그인하기
        </button>
        <button
          type="button"
          onClick={handleClickNaver}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <SiNaver className="absolute left-6 text-green-400 my-auto inset-y-0" />
          네이버로 {isSeller ? "판매자" : "사용자"} 로그인하기
        </button>
        <button
          type="button"
          onClick={handleClickKakao}
          className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
        >
          <RiKakaoTalkFill className="absolute left-5 text-yellow-950 text-xl my-auto inset-y-0" />
          카카오로 {isSeller ? "판매자" : "사용자"} 로그인하기
        </button>
      </div>
    </div>
  )
}
