"use client"

import { roomFormState } from "@/atom"
import { useRouter } from "next/navigation"
import { useRecoilState } from "recoil"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import Stepper from "@/components/Form/Stepper"
import NextButton from "@/components/Form/NextButton"
import AddressSearch from "@/components/Form/AddressSearch"

interface RoomAddressProps {
  address?: string
  lat?: number // 변경된 부분: number 타입으로 설정
  lng?: number // 변경된 부분: number 타입으로 설정
}

export default function RoomRegisterAddress() {
  const router = useRouter()
  const [roomForm, setRoomForm] = useRecoilState(roomFormState)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoomAddressProps>()

  const onSubmit = (data: RoomAddressProps) => {
    const lat = Number(data.lat) // number 타입으로 변환
    const lng = Number(data.lng) // number 타입으로 변환

    if (isNaN(lat) || isNaN(lng)) {
      alert("위도와 경도가 유효하지 않습니다. 다시 시도해주세요.")
      return
    }

    setRoomForm({
      ...roomForm,
      address: data.address,
      lat: lat, // number 타입으로 설정
      lng: lng, // number 타입으로 설정
    })

    router.push("/rooms/register/feature")
  }

  useEffect(() => {
    if (roomForm) {
      setValue("address", roomForm.address)
      setValue("lat", roomForm.lat) // number으로 설정
      setValue("lng", roomForm.lng) // number으로 설정
    }
  }, [roomForm, setValue])

  return (
    <>
      <Stepper count={3} totalSteps={5} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          숙소의 위치를 입력해주세요
        </h1>

        <AddressSearch
          register={register}
          errors={errors}
          setValue={setValue}
        />

        <NextButton type="submit" />
      </form>
    </>
  )
}
