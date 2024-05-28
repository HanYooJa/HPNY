'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

export default function SubmitButton() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()

  const id = params?.id
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guestCount = searchParams.get('guestCount')
  const totalAmount = searchParams.get('totalAmount')
  const totalDays = searchParams.get('totalDays')

  const handleSubmit = async () => {
    const res = await axios.post('/api/bookings', {
      roomId: id,
      checkIn: checkIn,
      checkOut: checkOut,
      guestCount: guestCount,
      totalAmount: totalAmount,
      totalDays: totalDays,
    })

    if (res.status === 200) {
      toast.success('예약을 완료했습니다.')
      router.replace(`/users/bookings/${res.data.id}`)
    } else {
      toast.error('다시 시도해주세요.')
    }
  }

  return (
    <div>
      <PayPalScriptProvider options={{ clientId:"AQQMOvSjXVQpbgMabqrY5aXp3roWjXgZDCb6JUv0i3olvzWdXAmGShcsug4fJXTVIO-BxRkwsOxV6TAc" }}>
        <PayPalButtons />
      </PayPalScriptProvider>
    </div>
  )
}