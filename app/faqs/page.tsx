"use client"

import { FaqType } from "@/interface"

const faqData: FaqType[] = [
  {
    id: 1,
    title: "로그인은 어떻게 하나요?",
    desc: "Comma에서 로그인은 우측 상단에서 할 수 있습니다.",
  },
  {
    id: 2,
    title: "예약은 어떻게 하나요?",
    desc: "원하는 숙소나 활동을 선택 후 예약 버튼을 눌러 예약을 진행할 수 있습니다.",
  },
  {
    id: 3,
    title: "판매자로 등록하려면 어떻게 해야 하나요?",
    desc: "마이페이지에서 판매자 등록을 신청할 수 있습니다.",
  },
]

export default function FaqPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-lg md:text-3xl font-semibold">
        Comma가 처음이신가요?
      </h1>
      <p className="mt-2 text-gray-600">
        Comma를 이용해주셔서 감사합니다☺️ Comma 사용법을 알려드릴게요🙌
      </p>
      <hr />
      <br />
      <h2>1. 로그인을 한다</h2>
      <br />
      <h2>2. 마이페이지에 간다</h2>
      <p>
        - 마이페이지에서 사용자로 이용할 건지 판매자로 이용할 건지 선택할 수
        있습니다.
      </p>
      <br />
      <h2>3. 사용자일 경우</h2>
      <p>
        - 메인페이지에서 상단 가운데에 있는 숙소나 활동 중 원하는 페이지를 선택
        후, 마음에 드는 숙소나 활동을 예약하면 됩니다.
      </p>
      <p>- 마이페이지에서 다양한 기능을 사용하실 수 있습니다.</p>
      <br />
      <h2>4. 판매자일 경우</h2>
      <p>
        - 메인페이지 상단 오른쪽 또는 마이페이지에서 숙소나 활동을 등록할 수
        있습니다.
      </p>
      <p>- 마이페이지에서 다양한 기능을 사용하실 수 있습니다.</p>

      <div className="mt-8 flex flex-col mb-10">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="py-5 border-b border-b-gray-200 text-black items-center font-semibold"
          >
            <div>{faq.title}</div>
            <div className="text-gray-600 font-normal mt-2">{faq.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
