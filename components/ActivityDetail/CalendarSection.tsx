"use client"

import { filterState } from "@/atom"
import { useRecoilState } from "recoil"
import dayjs from "dayjs"
import "dayjs/locale/ko"
import Calendar from "react-calendar"
import { useState, useEffect } from "react"

export default function CalendarSection() {
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [filterValue, setFilterValue] = useRecoilState(filterState)

  // 기본 체크인 날짜를 당일로 설정
  useEffect(() => {
    if (!filterValue.checkIn) {
      setFilterValue({
        ...filterValue,
        checkIn: dayjs().format("YYYY-MM-DD"), // 기본 체크인 날짜는 당일
        checkOut: dayjs().format("YYYY-MM-DD"), // 기본 체크아웃 날짜도 동일하게 설정
      })
    }
    setShowCalendar(true)
  }, [filterValue, setFilterValue])

  const onChangeCheckIn = (e: any) => {
    setFilterValue({
      ...filterValue,
      checkIn: dayjs(e).format("YYYY-MM-DD"),
      checkOut: dayjs(e).format("YYYY-MM-DD"), // 체크인과 동일한 날로 기본 설정
    })
  }

  const onChangeCheckOut = (e: any) => {
    setFilterValue({
      ...filterValue,
      checkOut: dayjs(e).format("YYYY-MM-DD"),
    })
  }

  // 예약 버튼 활성화 조건 계산
  const isBookingValid =
    filterValue.checkIn &&
    filterValue.checkOut &&
    dayjs(filterValue.checkOut).isSameOrAfter(dayjs(filterValue.checkIn))

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="text-gray-500 text-sm">
        {filterValue.checkIn && filterValue.checkOut
          ? `${filterValue.checkIn} ~ ${filterValue.checkOut}`
          : "체크인/체크아웃 날짜를 입력해주세요"}
      </div>
      {showCalendar && (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Calendar
            next2Label={null}
            prev2Label={null}
            className="mt-4 mx-auto"
            onChange={onChangeCheckIn}
            minDate={new Date()}
            defaultValue={
              filterValue.checkIn ? new Date(filterValue.checkIn) : null
            }
            formatDay={(locale, date) => dayjs(date).format("DD")}
          />
          <Calendar
            next2Label={null}
            prev2Label={null}
            className="mt-4 mx-auto"
            onChange={onChangeCheckOut}
            minDate={
              filterValue.checkIn ? new Date(filterValue.checkIn) : new Date()
            }
            defaultValue={
              filterValue.checkOut ? new Date(filterValue.checkOut) : null
            }
            formatDay={(locale, date) => dayjs(date).format("DD")}
          />
        </div>
      )}
    </div>
  )
}
