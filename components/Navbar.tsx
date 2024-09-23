"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineMenu, AiOutlineUser } from "react-icons/ai"
import { GiNightSleep } from "react-icons/gi"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

const LOGOUT_USER_MENU = [
  { id: 1, title: "로그인", url: "/users/signin" },
  { id: 2, title: "회원가입", url: "/users/signin" },
  { id: 3, title: "FAQ", url: "/faqs" },
]

const LOGIN_USER_MENU = [
  { id: 1, title: "마이페이지", url: "/users/mypage" },
  { id: 2, title: "FAQ", url: "/faqs" },
  { id: 3, title: "로그아웃", url: "#", signout: true },
]

export default function Navbar() {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const { status, data: session } = useSession()
  const router = useRouter()

  return (
    <nav className="h-20 z-[20] border border-b-gray-20 w-full shadow-sm p-4 sm:px-10 flex justify-between items-center align-middle fixed top-0 bg-white">
      <div className="grow basis-0 hidden font-semibold text-lg sm:text-xl text-lime-500 cursor-pointer sm:flex sm:gap-2">
        <GiNightSleep className="text-4xl my-auto" />
        <Link href="/" className="my-auto block">
          Comma
        </Link>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-semibold  my-auto hover:text-lime-600"
        >
          숙소
        </button>
        <div>|</div>
        <button
          type="button"
          onClick={() => router.push("/activities")}
          className="font-semibold my-auto hover:text-lime-600"
        >
          활동
        </button>
      </div>

      <div className="grow basis-0 hidden md:flex gap-4 align-middle justify-end relative">
        {status === "authenticated" ? (
          <Link
            href={`/rooms/register/category`}
            className="font-semibold text-sm my-auto px-4 py-3 rounded-full hover:bg-gray-50"
          >
            당신의 공간을 등록해주세요
          </Link>
        ) : (
          <Link
            href={`/users/signin`}
            className="font-semibold text-sm my-auto px-4 py-3 rounded-full hover:bg-gray-50"
          >
            로그인 후 사용해주세요
          </Link>
        )}

        <button
          type="button"
          onClick={() => setShowMenu((val) => !val)}
          className="flex align-middle gap-3 rounded-full border border-gray-20 shadow-sm px-4 py-3 my-auto hover:shadow-lg"
        >
          <AiOutlineMenu />

          {status === "authenticated" && session?.user?.image ? (
            <img
              src={session?.user?.image}
              alt="profile img"
              className="rounded-full w-4 h-4 my-auto"
            />
          ) : (
            <AiOutlineUser />
          )}
        </button>

        {showMenu && (
          <div className="border border-gray-200 shadow-lg py-2 flex flex-col absolute top-12 bg-white w-60 rounded-lg">
            {status === "unauthenticated"
              ? LOGOUT_USER_MENU.map((menu) => (
                  <button
                    type="button"
                    key={menu.id}
                    className="h-10 hover:bg-gray-50 pl-3 text-sm text-gray-700 text-left"
                    onClick={() => {
                      router.push(menu.url)
                      setShowMenu(false)
                    }}
                  >
                    {menu.title}
                  </button>
                ))
              : LOGIN_USER_MENU.map((menu) => (
                  <button
                    type="button"
                    key={menu.id}
                    className="h-10 hover:bg-gray-50 pl-3 text-sm text-gray-700 text-left"
                    onClick={() => {
                      menu.signout ? signOut({ callbackUrl: "/" }) : null
                      router.push(menu.url)
                      setShowMenu(false)
                    }}
                  >
                    {menu.title}
                  </button>
                ))}
          </div>
        )}
      </div>
    </nav>
  )
}
