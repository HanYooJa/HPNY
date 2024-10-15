import cn from "classnames"

interface StepperProps {
  count?: number
  totalSteps?: number
  className?: string
}

export default function Stepper({
  count = 1,
  totalSteps = 5,
  className = "",
}: StepperProps) {
  return (
    <div className={cn("flex gap-3 h-4 w-full justify-center ", className)}>
      {" "}
      {[...Array(totalSteps)].map((_, i) => (
        <div
          key={`step-${i}`}
          className={cn(
            "flex-grow h-full rounded-md",
            i < count ? "bg-black" : "bg-gray-300",
          )}
        />
      ))}
    </div>
  )
}
