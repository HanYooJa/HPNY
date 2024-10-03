/* eslint-disable @next/next/no-img-element */
"use client"

import { roomFormState } from "@/atom"
import { useRouter } from "next/navigation"
import { useRecoilState, useResetRecoilState } from "recoil"
import { useForm } from "react-hook-form"
import Stepper from "@/components/Form/Stepper"
import NextButton from "@/components/Form/NextButton"
import { AiFillCamera } from "react-icons/ai"
import toast from "react-hot-toast"
import axios from "axios"
import { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface RoomImageProps {
  images?: string[]
}

export default function RoomRegisterImage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [roomForm, setRoomForm] = useRecoilState(roomFormState)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)
  const resetRoomForm = useResetRecoilState(roomFormState)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomImageProps>()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (!files) return
    if (files.length + images.length > 5) {
      toast.error("최대 5장의 사진만 업로드할 수 있습니다.")
      return
    }

    const newFiles: File[] = Array.from(files)
    const newImagePreviews: string[] = []

    newFiles.forEach((file) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onloadend = () => {
        if (fileReader.result) {
          newImagePreviews.push(fileReader.result.toString())
        }
      }
    })

    setImages((prevFiles) => [...prevFiles, ...newFiles])
    setImagePreviews((prev) => [...prev, ...newImagePreviews])
  }

  async function uploadImages(files: File[]) {
    const uploadedImageUrls: string[] = []

    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      )

      try {
        const res = await fetch(`/api/cloudinary-upload`, {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          uploadedImageUrls.push(data.url) // 서버에서 전달된 이미지 URL 사용
        } else {
          console.error("Error uploading image:", res.statusText)
          toast.error("이미지 업로드에 실패했습니다.")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        toast.error("이미지 업로드 중 문제가 발생했습니다.")
      }
    }

    return uploadedImageUrls
  }

  const onSubmit = async () => {
    try {
      setDisableSubmit(true)
      const imageUrls = await uploadImages(images)

      if (!imageUrls || imageUrls.length === 0) {
        toast.error("이미지 업로드 중 문제가 발생했습니다.")
        return
      }

      const result = await axios.post("/api/rooms", {
        ...roomForm,
        images: imageUrls,
      })

      console.log("Response Status:", result.status) // 응답 상태 출력
      toast.success("숙소를 등록했습니다.")
      resetRoomForm()
      router.push("/")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data) // 에러 내용 로그
        console.error("Status code:", error.response?.status) // 상태 코드 로그
        toast.error(
          "Error: " + error.response?.data?.error ||
            "데이터 생성 중 문제가 발생했습니다.",
        )
      } else {
        console.error("Unexpected error:", error)
        toast.error("예상치 못한 오류가 발생했습니다.")
      }
    } finally {
      setDisableSubmit(false)
    }
  }

  return (
    <>
      <Stepper count={5} totalSteps={5} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)} // onSubmit을 여기에 연결합니다.
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          숙소의 사진을 추가해주세요
        </h1>
        <p className="text-sm md:text-base text-gray-500 text-center">
          숙소 사진은 최대 5장까지 추가할 수 있습니다.
        </p>
        <div className="flex flex-col gap-2">
          <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <AiFillCamera className="mx-auto h-12 w-12 text-gray-300" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-lime-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-lime-600 focus-within:ring-offset-2 hover:text-lime-500"
                  >
                    <span>최대 5장의 사진을</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      {...register("images", { required: true })}
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">업로드 해주세요</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF 등 이미지 포맷만 가능
                </p>
              </div>
            </div>
          </div>
          {errors?.images && errors?.images?.type === "required" && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>
        <div className="mt-10 max-w-lg mx-auto flex flex-wrap gap-4">
          {imagePreviews.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt="미리보기"
              width={100}
              height={100}
              className="rounded-md"
            />
          ))}
        </div>
        <NextButton
          type="submit"
          text="완료"
          disabled={isSubmitting || disableSubmit}
        />
      </form>
    </>
  )
}
