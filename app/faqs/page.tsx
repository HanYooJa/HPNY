import { FaqType } from "@/interface"

export default async function FaqPage() {
  const data: FaqType[] = await getData()

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
        {data?.map((faq) => (
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

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs`, {
      cache: "force-cache",
    })

    if (!res.ok) {
      throw new Error("failed to fetch")
    }

    return res.json()
  } catch (e) {
    console.error(e)
  }
}
