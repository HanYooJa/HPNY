"use client"

import { AiOutlineUser } from "react-icons/ai"
import { GiNightSleep } from "react-icons/gi"

export default function Introduce() {
  return (
    <>
      <div className="xl:w-[1280px] xl:mx-auto w-full  mt-[80px]">
        <section className="h-[320px] flex flex-col justify-center gap-[40px] px-[20px]  xl:px-[16px]">
          <h1 className="text-[36px] font-bold text-lime-500 flex gap-[10px] items-center justify-center">
            <GiNightSleep className="text-[56px] my-auto" />
            Comma
          </h1>
          <p className="text-[18px] font-semibold mb-6">
            <span className="text-lime-500 text-[22px]">Comma</span>는 기존 숙박
            어플의 불편한 점들을 개선하여 만든 플랫폼 입니다. <br />
            사용자들이 더욱 쉽고 빠르게 숙소를 등록하고 예약할 수 있도록
            도와줍니다. <br /> Next.js를 기반으로 구축되었으며 Supabase, Prisma,
            NextAuth 등 다양한 기술을 활용하여 빠르고 안정적인 서비스를
            제공합니다.
          </p>
        </section>
        <section className="h-[320px] bg-[rgba(132,204,22,0.09)] px-[20px] xl:px-[16px] flex flex-col justify-center gap-[20px]">
          <h3 className="mb-2 text-[24px] font-bold">주요 기능</h3>
          <ul className="list-inside list-none flex gap-[10px]">
            <li className="text-[18px] font-semibold h-[120px] w-1/4 rounded-[4px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center">
              숙소 등록 및 관리
            </li>
            <li className="text-[18px] font-semibold h-[120px] w-1/4 rounded-[4px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center">
              숙소 검색 및 예약
            </li>
            <li className="text-[18px] font-semibold h-[120px] w-1/4 rounded-[4px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center">
              사용자 리뷰 및 평점
            </li>
            <li className="text-[18px] font-semibold h-[120px] w-1/4 rounded-[4px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center">
              맞춤형 검색
            </li>
          </ul>
        </section>
        <section className="h-[320px] flex flex-col justify-center gap-[10px] px-[20px]  xl:px-[16px]">
          <h1 className="text-[24px] font-bold">팀원 소개</h1>
          <ul className="text-base font-bold list-none list-inside flex justify-evenly">
            <li className="w-[180px] h-[200px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-[4px] flex flex-col justify-center items-center gap-[20px]">
              <AiOutlineUser className="text-xl md:text-3xl" />
              <p>박진아</p>
            </li>
            <li className="w-[180px] h-[200px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-[4px] flex flex-col justify-center items-center gap-[20px]">
              <AiOutlineUser className="text-xl md:text-3xl" />
              <p>노수빈</p>
            </li>
            <li className="w-[180px] h-[200px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-[4px] flex flex-col justify-center items-center gap-[20px]">
              <AiOutlineUser className="text-xl md:text-3xl" />
              <p>한유정</p>
            </li>
            <li className="w-[180px] h-[200px] shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-[4px] flex flex-col justify-center items-center gap-[20px]">
              <AiOutlineUser className="text-xl md:text-3xl" />
              <p>양유나</p>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
