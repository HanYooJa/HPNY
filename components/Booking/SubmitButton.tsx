"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function SubmitButton() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()

  // Optional Chaining으로 params 및 searchParams 값 설정
  const id = params?.id || ""
  const checkIn = searchParams?.get("checkIn") || ""
  const checkOut = searchParams?.get("checkOut") || ""
  const guestCount = searchParams?.get("guestCount") || ""
  const totalAmount = searchParams?.get("totalAmount") || ""
  const totalDays = searchParams?.get("totalDays") || ""

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/bookings", {
        roomId: id,
        checkIn: checkIn,
        checkOut: checkOut,
        guestCount: guestCount,
        totalAmount: totalAmount,
        totalDays: totalDays,
      })

      if (res.status === 200) {
        toast.success("예약을 완료했습니다.")
        router.replace(`/users/bookings/${res.data.id}`)
      } else {
        toast.error("다시 시도해주세요.")
      }
    } catch (error) {
      toast.error("예약 처리 중 오류가 발생했습니다.")
      console.error("Booking error:", error)
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={status === "unauthenticated"}
        onClick={handleSubmit}
        className="bg-lime-600 hover:bg-lime-500 px-6 py-3 text-white rounded-md w-full disabled:bg-gray-300"
      >
        확인 및 결제
      </button>
    </div>
  )
}
