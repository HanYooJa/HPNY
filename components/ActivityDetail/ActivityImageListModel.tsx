import { BLUR_DATA_URL } from "@/constants"
import { ActivityType } from "@/interface"
import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import { Fragment } from "react"

export default function ActivityImageListModal({
  isOpen,
  closeModal,
  data,
}: {
  isOpen: boolean
  closeModal: () => void
  data: ActivityType
}) {
  // 기본 이미지 설정
  const defaultImage = "/images/default-activity.jpg"

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg md:text-2xl font-medium leading-6 text-gray-900"
                  >
                    이미지 전체 보기
                  </Dialog.Title>
                  <div className="mt-10 mb-20 max-w-xl mx-auto flex flex-col gap-4">
                    {data?.images?.length > 0 ? (
                      data.images.map((img) => (
                        <Image
                          key={img}
                          alt="activity img"
                          src={img}
                          width={1000}
                          height={1000}
                          className="mx-auto"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                        />
                      ))
                    ) : (
                      <Image
                        alt="default activity img"
                        src={defaultImage}
                        width={1000}
                        height={1000}
                        className="mx-auto"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-lime-100 px-4 py-2 text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      닫기
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
