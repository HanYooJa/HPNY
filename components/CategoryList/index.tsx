"use client"

import { filterState, sortState } from "@/atom" // sortState import 추가
import { CATEGORY_DATA } from "@/constants"
import { ACTIVITY_CATEGORY_DATA } from "@/constants" // 활동 카테고리 데이터 import
import { useRecoilState } from "recoil"
import { usePathname } from "next/navigation"

import cn from "classnames"
import { BiReset } from "react-icons/bi"

export default function CategoryList() {
  const [filterValue, setFilterValue] = useRecoilState(filterState)
  const [sortBy, setSortBy] = useRecoilState(sortState) // sortState 상태 관리
  const pathname = usePathname() // 현재 경로 가져오기

  // 페이지에 따라 카테고리 데이터를 변경
  const isActivityPage = pathname === "/activities"
  const categoryData = isActivityPage ? ACTIVITY_CATEGORY_DATA : CATEGORY_DATA

  return (
    <>
      {/* 카테고리 리스트 */}
      <div className="flex gap-6 fixed top-20 inset-x-0 mx-auto overflow-x-auto w-full px-6 sm:px-28 bg-white z-10 mb-6 justify-center whitespace-nowrap">
        <button
          className="flex-none justify-center gap-3 py-4 w-24 text-center"
          onClick={() => {
            setFilterValue({
              ...filterValue,
              category: "",
            })
          }}
        >
          <div
            className={cn(
              "flex flex-col justify-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer",
              {
                "underline underline-offset-8 font-semibold text-black":
                  filterValue.category === "",
              },
            )}
          >
            <div className="text-2xl mx-auto">
              <BiReset />
            </div>
            <div className="text-xs">전체</div>
          </div>
        </button>
        {categoryData?.map((category) => (
          <button
            type="button"
            key={category.title}
            onClick={() => {
              setFilterValue({
                ...filterValue,
                category: category.title,
              })
            }}
            className={cn(
              "w-24 flex-none text-gray-500 hover:text-gray-700 gap-3 justify-center text-center py-4",
              {
                "text-black font-semibold underline underline-offset-8":
                  filterValue.category === category.title,
              },
            )}
          >
            <div className="flex flex-col justify-center gap-3">
              <div className="text-2xl mx-auto">
                <category.Icon />
              </div>
              <div className="text-gray-700 text-xs text-center whitespace-nowrap">
                {category.title}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 정렬 옵션 왼쪽으로 이동 */}
      <div className="fixed top-36 left-6 flex justify-start gap-4 bg-white p-2 z-10">
        {" "}
        {/* left-6와 justify-start로 왼쪽 정렬 설정 */}
        <label htmlFor="sortBy" className="font-semibold">
          정렬 기준:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="views">조회수 순</option>
          <option value="comments">후기 순</option>
          <option value="likes">찜한 순</option>
          <option value="bookings">예약된 순</option>
        </select>
      </div>
    </>
  )
}
