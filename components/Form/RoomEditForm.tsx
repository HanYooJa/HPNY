/* eslint-disable @next/next/no-img-element */
"use client"

import { RoomFeatureProps } from "@/app/rooms/(form)/register/feature/page"
import { CATEGORY, FeatureFormField, RoomEditField } from "@/constants"
import { RoomFormType, RoomType } from "@/interface"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import AddressSearch from "./AddressSearch"
import { AiFillCamera } from "react-icons/ai"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import cn from "classnames"

export default function RoomEditForm({ data }: { data: RoomType }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageKeys, setImageKeys] = useState<string[] | null>(null)
  let newImageKeys: string[] = []

  // 파일 선택 및 미리보기 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files) return

    const newImageUrls: string[] = []
    const newFiles: File[] = []

    Array.from(files).forEach((file: File) => {
      newImageUrls.push(URL.createObjectURL(file))
      newFiles.push(file)
    })

    setImages((prev) => [...prev, ...newImageUrls])
    setImageFiles((prev) => [...prev, ...newFiles])
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormType>()

  const onClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    title: keyof RoomFeatureProps,
  ) => {
    setValue(title, event?.target?.checked)
  }

  const deleteImages = async () => {
    if (!imageKeys) return
    for (const key of imageKeys) {
      try {
        const res = await axios.post("/api/cloudinary-delete", {
          public_id: key,
        })

        if (res.status === 200) {
          console.log("File Deleted: ", key)
        } else {
          console.error("Cloudinary delete failed for: ", key)
        }
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
    setImageKeys(null)
  }

  // Cloudinary에 이미지 업로드
  async function uploadImages(files: File[]) {
    const uploadedImageUrls: string[] = []

    if (!files || files.length === 0) {
      toast.error("이미지를 한 개 이상 업로드해주세요")
      return
    }

    if (images === data.images) {
      return data.images
    }

    try {
      await deleteImages()
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rmif9xfe",
        )

        try {
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
          )

          const imageUrl = res.data.secure_url
          newImageKeys.push(res.data.public_id)
          uploadedImageUrls.push(imageUrl)
        } catch (error) {
          console.error("Error uploading images: ", error)
        }
      }

      return uploadedImageUrls
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (data) {
      Object.keys(data)?.forEach((key) => {
        const field = key as keyof RoomFormType
        if (RoomEditField.includes(field)) {
          setValue(field, data[field])
        }
      })
    }

    if (data.imageKeys) {
      setImageKeys(data.imageKeys)
    }

    if (data.images) {
      setImages(data.images)
    }
  }, [data, setValue])

  return (
    <form
      className="px-4 md:max-w-4xl mx-auto py-8 my-20 flex flex-col gap-8"
      onSubmit={handleSubmit(async (res) => {
        try {
          const imageUrls = await uploadImages(imageFiles)
          const result = await axios.patch(`/api/rooms?id=${data.id}`, {
            ...res,
            images: imageUrls,
            imageKeys: newImageKeys.length > 0 ? newImageKeys : imageKeys,
          })

          if (result.status === 200) {
            toast.success("숙소를 수정했습니다.")
            router.replace("/users/rooms")
          } else {
            toast.error("다시 시도해주세요")
          }
        } catch (e) {
          console.log(e)
          toast.error("데이터 수정 중 문제가 생겼습니다.")
        }
      })}
    >
      <h1 className="font-semibold text-lg md:text-2xl text-center">
        숙소 수정하기
      </h1>

      {/* 나머지 폼 필드 */}

      <div className="mt-10 max-w-lg mx-auto flex flex-wrap gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="미리보기"
            width={100}
            height={100}
            className="rounded-md"
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-semibold leading-6 text-gray-900"
        >
          뒤로가기
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-lime-600 hover:bg-lime-500 px-8 py-2.5 font-semibold text-white disabled:bg-gray-300"
        >
          수정하기
        </button>
      </div>
    </form>
  )
}
