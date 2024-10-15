"use client"

import { useState } from "react"
import { BookingType } from "@/interface"
import Modal from "../Modal"
import axios from "axios"
import { toast } from "react-hot-toast"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"

interface RefundProps {
  booking: BookingType
  canRefund: boolean
}

export default function RefundButton({ booking, canRefund }: RefundProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isRefund, setIsRefund] = useState<boolean>(false)
  const router = useRouter()

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const handleRefund = async () => {
    try {
      const res = await axios.patch(`/api/bookings/${booking.id}`, {
        status: "CANCEL",
      })

      if (res.status === 200) {
        toast.success("해당 예약을 취소했습니다.")
        setIsRefund(true)
        closeModal()
        router.push("/users/bookings")
      } else {
        toast.error("다시 시도해주세요.")
      }
    } catch (error) {
      console.error("Error during refund:", error)
      toast.error("예약 취소 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="flex flex-col items-center mb-4">
      <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}
      >
        {booking?.status !== "SUCCESS" ? (
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "checkout",
              tagline: false,
              height: 55,
            }}
            onApprove={(data, actions) => {
              if (actions && actions.order) {
                return actions.order.capture().then(function () {
                  toast.success("결제가 완료되었습니다.")
                  router.push("/users/bookings")
                })
              } else {
                toast.error("결제 처리 중 오류가 발생했습니다.")
                return Promise.reject(
                  new Error("actions.order가 정의되지 않았습니다."),
                )
              }
            }}
            onError={() => {
              toast.error("결제 중 오류가 발생했습니다.")
            }}
          />
        ) : (
          <p>결제 완료</p>
        )}
      </PayPalScriptProvider>

      {booking?.status === "CANCEL" || isRefund ? (
        <button
          className="bg-lime-600 hover:bg-lime-500 text-white rounded-md disabled:bg-gray-300 px-5 py-2.5 w-full mt-4"
          disabled
        >
          예약 취소 완료
        </button>
      ) : (
        <button
          type="button"
          disabled={!canRefund && !booking?.room?.freeCancel}
          onClick={openModal}
          className="bg-lime-600 hover:bg-lime-500 text-white rounded-md disabled:bg-gray-300 px-5 py-2.5 w-full mt-4"
        >
          예약 취소하기
        </button>
      )}

      <Modal isOpen={isOpen} closeModal={closeModal} title="예약 취소">
        <div className="flex flex-col gap-2 mt-4">
          <h1 className="text-lg font-semibold">예약을 취소 하시겠습니까?</h1>
          <p className="text-gray-600">
            예약을 취소하면 재예약이 어려울 수 있습니다. 환불금은 예약 취소 후
            2~3일 내에 결제한 카드로 입금됩니다. 동의하시는 경우에만 아래 버튼을
            눌러 예약을 취소하세요.
          </p>
          <button
            type="button"
            onClick={handleRefund}
            className="mt-8 bg-lime-600 hover:bg-lime-500 text-white rounded-md px-5 py-2.5"
          >
            예약 취소하기
          </button>
        </div>
      </Modal>
    </div>
  )
}
