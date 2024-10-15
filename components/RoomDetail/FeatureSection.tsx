import { RoomType } from "@/interface"
import Image from "next/image"
import { AiOutlineCheckCircle, AiOutlineWifi } from "react-icons/ai"
import { BsDoorClosed, BsFan } from "react-icons/bs"
import { AiOutlineDesktop } from "react-icons/ai"
import { PiMountainsDuotone, PiBathtub } from "react-icons/pi"
import { MdOutlineLocalLaundryService } from "react-icons/md"
import { LuParkingCircle } from "react-icons/lu"
import { GiBarbecue } from "react-icons/gi"
import cn from "classnames"
import CalendarSection from "./CalendarSection"
import BookingSection from "./BookingSection"

export default function FeatureSection({
  data,
  comments,
}: {
  data: RoomType
  comments: number
}) {
  return (
    <div className="md:grid md:grid-cols-3 gap-8 mt-8 relative">
      <div className="col-span-2">
        {/* 호스트 정보 */}
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-lg md:text-xl">
              {data?.user?.name ?? "사용자"}님이 호스팅하는 숙소
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {data?.user?.desc ?? "호스트 설명이 없습니다."}
            </p>
          </div>
          <Image
            src={data?.user?.image || "/images/user.png"}
            alt="user image"
            width={50}
            height={50}
            className="rounded-full shadow"
          />
        </div>

        {/* 무료 취소 */}
        <div className="mt-4 flex flex-col gap-6 py-6 border-y border-gray-300">
          <div className="flex gap-6 items-center px-4">
            <AiOutlineCheckCircle className="text-lg md:text-2xl" />
            <span
              className={cn("text-gray-600", {
                "line-through": !data?.freeCancel,
              })}
            >
              무료 취소
            </span>
          </div>
        </div>

        {/* 숙소 설명 */}
        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl">숙소 설명</h1>
          {data?.desc ?? "설명이 없습니다."}
        </div>

        {/* 숙박 장소 설명 */}
        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl">숙박 장소</h1>
          {data?.bedroomDesc ?? "설명이 없습니다."}
        </div>

        {/* 숙소 편의시설 */}
        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl">숙소 편의시설</h1>
          <div className="grid md:grid-cols-2 gap-1">
            <div className="flex gap-2 items-center mt-4">
              <AiOutlineCheckCircle className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.freeCancel,
                })}
              >
                무료 취소
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <BsDoorClosed className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.selfCheckIn,
                })}
              >
                셀프 체크인
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <AiOutlineDesktop className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.officeSpace,
                })}
              >
                사무 시설
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <PiMountainsDuotone className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.hasMountainView,
                })}
              >
                마운틴 뷰
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <PiBathtub className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.hasShampoo,
                })}
              >
                샴푸 및 욕실 용품
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <MdOutlineLocalLaundryService className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.hasFreeLaundry,
                })}
              >
                무료 세탁
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <BsFan className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.hasAirConditioner,
                })}
              >
                에어컨
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <AiOutlineWifi className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.hasWifi,
                })}
              >
                무료 와이파이
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <GiBarbecue className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.hasBarbeque,
                })}
              >
                바베큐 시설
              </span>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <LuParkingCircle className="text-lg md:text-2xl" />
              <span
                className={cn("text-gray-600", {
                  "line-through": !data?.hasFreeParking,
                })}
              >
                무료 주차
              </span>
            </div>
          </div>
        </div>

        {/* 캘린더 */}
        <div className="py-8 px-4 border-b border-gray-300 leading-8 text-gray-800">
          <h1 className="font-semibold text-xl mb-2">캘린더</h1>
          <CalendarSection />
        </div>
      </div>
      <BookingSection data={data} comments={comments} />
    </div>
  )
}
