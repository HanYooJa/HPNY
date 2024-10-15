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
    const lat = getValues("lat")
    const lng = getValues("lng")

    console.log("Submitted lat:", lat)
    console.log("Submitted lng:", lng)

    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
      alert("위도와 경도가 유효하지 않습니다. 다시 시도해주세요.")
      return
    }

    setActivityForm({
      ...activityForm,
      address: data?.address || "",
      lat: lat,
      lng: lng,
      title: activityForm?.title || "",
      desc: activityForm?.desc || "",
      price: activityForm?.price || 0,
      images: activityForm?.images || [],
      category: activityForm?.category || "",
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
