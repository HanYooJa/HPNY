import cn from "classnames"

interface StepperProps {
  count?: number
  totalSteps?: number
  className?: string
}

export default function Stepper({
  count = 1,
  totalSteps = 5, // 기본값을 5로 설정
  className = "",
}: StepperProps) {
  return (
    <div className={cn("flex gap-3 h-4 w-full justify-center ", className)}>
      {" "}
      {/* w-full과 justify-center를 사용해 중앙 정렬 */}
      {[...Array(totalSteps)].map((_, i) => (
        <div
          key={`step-${i}`}
          className={cn(
            "flex-grow h-full rounded-md",
            i < count ? "bg-black" : "bg-gray-300", // 활성화된 스텝과 비활성화된 스텝을 구분
          )}
        />
      ))}
    </div>
  )
}
