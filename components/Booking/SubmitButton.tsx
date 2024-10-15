"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

export default function SubmitButton() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()

  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isBookingComplete, setIsBookingComplete] = useState<boolean>(false)

  const id = params?.id || ""
  const checkIn = searchParams?.get("checkIn") || ""
  const checkOut = searchParams?.get("checkOut") || ""
  const guestCount = searchParams?.get("guestCount") || ""
  const totalAmount = searchParams?.get("totalAmount") || ""
  const totalDays = searchParams?.get("totalDays") || ""

  const handleSubmit = async () => {
    try {
      const isRoomBooking = searchParams?.get("type") === "room"
      const apiEndpoint = isRoomBooking
        ? "/api/bookings"
        : "/api/bookings/activities"

      const payload = {
        checkIn,
        checkOut,
        guestCount,
        totalAmount,
        totalDays,
      }

      if (isRoomBooking) {
        payload["roomId"] = id
      } else {
        payload["activityId"] = id
      }

      const res = await axios.post(apiEndpoint, payload)

      if (res.status === 200) {
        toast.success("예약을 완료했습니다.")
        setBookingId(res.data.id)
        setIsBookingComplete(true)
      } else {
        toast.error("다시 시도해주세요.")
      }
    } catch (error) {
      toast.error("예약 처리 중 오류가 발생했습니다.")
      console.error("Booking error:", error)
    }
  }

  const handleApprove = async (data, actions) => {
    if (actions.order) {
      return actions.order.capture().then(async function () {
        try {
          await axios.patch(`/api/bookings/${bookingId}`, {
            status: "SUCCESS",
          })
          toast.success("결제가 완료되었습니다.")
          router.replace(`/users/bookings/${bookingId}`)
        } catch (error) {
          toast.error("결제 완료 후 상태 업데이트 중 오류가 발생했습니다.")
        }
      })
    } else {
      toast.error("결제 처리 중 오류가 발생했습니다.")
    }
  }

  return (
    <div>
      {!isBookingComplete ? (
        <button
          type="button"
          disabled={status === "unauthenticated"}
          onClick={handleSubmit}
          className="bg-lime-600 hover:bg-lime-500 px-6 py-3 text-white rounded-md w-full disabled:bg-gray-300"
        >
          확인 및 결제
        </button>
      ) : (
        <PayPalScriptProvider
          options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}
        >
          <div className="mt-4">
            <PayPalButtons
              style={{ layout: "vertical", color: "gold", height: 55 }}
              onApprove={handleApprove}
              onError={() => {
                toast.error("결제 중 오류가 발생했습니다.")
              }}
            />
          </div>
        </PayPalScriptProvider>
      )}
    </div>
  )
}
