import { useState } from "react"
import Script from "next/script"
import DaumPostcodeEmbed from "react-daum-postcode"
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"

interface RoomAddressProps {
  address?: string
  lat?: number
  lng?: number
}

interface AddressProps {
  setValue: UseFormSetValue<RoomAddressProps>
  register: UseFormRegister<RoomAddressProps>
  errors: FieldErrors<RoomAddressProps>
}

export default function AddressSearch({
  register,
  errors,
  setValue,
}: AddressProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState<boolean>(false)

  const handleComplete = (data: any) => {
    let fullAddress = data.address
    let extraAddress = ""

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : ""
    }

    console.log(`주소: ${fullAddress}`)
    setValue("address", fullAddress)
    setIsOpen(false)

    if (isKakaoMapLoaded) {
      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.addressSearch(fullAddress, function (result: any, status: any) {
        if (status === window.kakao.maps.services.Status.OK) {
          const lat = parseFloat(result[0].y)
          const lng = parseFloat(result[0].x)
          console.log(`위도: ${lat}, 경도: ${lng}`)

          setValue("lat", lat)
          setValue("lng", lng)
        } else {
          console.error("Geocoding 실패", status)
        }
      })
    } else {
      console.error("Kakao Maps가 로드되지 않았습니다.")
    }
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&libraries=services&autoload=false`}
        onLoad={() => {
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
              console.log("Kakao Maps가 성공적으로 로드되었습니다.")
              setIsKakaoMapLoaded(true)
            })
          } else {
            console.error("Kakao Maps가 로드되지 않았습니다.")
          }
        }}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-lg font-semibold">
          활동 위치
        </label>
        <div className="grid md:grid-cols-4 gap-6">
          <input
            readOnly
            placeholder="주소를 입력해주세요"
            {...register("address", { required: true })}
            className="col-span-3 block w-full outline-none px-4 py-2 rounded-lg border-2 focus:border-black placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setIsOpen((val) => !val)}
            className="bg-lime-600 hover:bg-lime-500 py-1.5 px-2 rounded text-white"
          >
            주소 검색
          </button>
        </div>
        {errors.address && errors.address.type === "required" && (
          <span className="text-red-600 text-sm">필수 항목입니다.</span>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 border border-gray-300 w-full rounded-md p-2 max-w-lg mx-auto">
          <DaumPostcodeEmbed onComplete={handleComplete} />
        </div>
      )}
    </>
  )
}
