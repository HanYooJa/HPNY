// app/activities/(form)/register/address/page.tsx (ActivityRegisterAddress Component)
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
  lat?: number
  lng?: number
}

export default function ActivityRegisterAddress() {
  const router = useRouter()
  const [activityForm, setActivityForm] = useRecoilState(activityFormState)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ActivityAddressProps>()

  const onSubmit = (data: ActivityAddressProps) => {
    // useForm에서 최신 위도와 경도 값을 가져오기
    const lat = getValues("lat")
    const lng = getValues("lng")

    // 로그를 추가하여 lat과 lng 값 확인
    console.log("Submitted lat:", lat)
    console.log("Submitted lng:", lng)

    // lat과 lng가 유효한지 확인
    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
      alert("위도와 경도가 유효하지 않습니다. 다시 시도해주세요.")
      return
    }

    // Recoil 상태 업데이트
    setActivityForm({
      ...activityForm,
      address: data?.address || "",
      lat: lat,
      lng: lng,
      title: activityForm?.title || "", // 기본값 설정
      desc: activityForm?.desc || "", // 기본값 설정
      price: activityForm?.price || 0, // 기본값 설정
      images: activityForm?.images || [], // 기본값 설정
      category: activityForm?.category || "", // 기본값 설정
    })

    console.log("Updated activityForm:", activityForm)
    router.push("/activities/register/image")
  }

  useEffect(() => {
    if (activityForm) {
      setValue("address", activityForm?.address || "")
      setValue("lat", activityForm?.lat || 0)
      setValue("lng", activityForm?.lng || 0)
      console.log("Initial activityForm:", activityForm)
    }
  }, [activityForm, setValue])

  return (
    <>
      <Stepper count={3} totalSteps={4} />
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
