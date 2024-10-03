"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useRecoilState } from "recoil"
import { activityFormState } from "@/atom"
import Stepper from "@/components/Form/Stepper"
import NextButton from "@/components/Form/NextButton"
import AddressSearch from "@/components/Form/AddressSearch"

interface ActivityAddressProps {
  address?: string
  lat?: number // number 타입으로 설정
  lng?: number // number 타입으로 설정
}

export default function ActivityRegisterAddress() {
  const router = useRouter()
  const [activityForm, setActivityForm] = useRecoilState(activityFormState)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ActivityAddressProps>()

  const onSubmit = (data: ActivityAddressProps) => {
    const lat = activityForm?.lat ? Number(activityForm.lat) : undefined // number로 변환
    const lng = activityForm?.lng ? Number(activityForm.lng) : undefined // number로 변환

    // lat과 lng가 유효한 숫자인지 확인
    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
      alert("위도와 경도가 유효하지 않습니다. 다시 시도해주세요.")
      return
    }

    setActivityForm({
      ...activityForm,
      address: data?.address || "", // 기본값 설정
      images: activityForm?.images || [], // 기본값 설정
      title: activityForm?.title || "", // 기본값 설정
      desc: activityForm?.desc || "", // 기본값 설정
      price: activityForm?.price || 0, // 기본값 설정
      category: activityForm?.category || "", // 기본값 설정
      lat: lat, // number로 변환된 값 설정
      lng: lng, // number로 변환된 값 설정
    })

    router.push("/activities/register/image")
  }

  useEffect(() => {
    if (activityForm) {
      setValue("address", activityForm?.address || "")
    }
  }, [activityForm, setValue])

  return (
    <>
      <Stepper count={4} totalSteps={4} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          활동의 위치를 입력해주세요
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
