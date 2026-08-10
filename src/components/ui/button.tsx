import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-[13px] font-semibold px-7 py-3.5 uppercase tracking-widest cursor-pointer",
          variant === 'default' && "bg-accent text-white hover:bg-accent/90 shadow-md",
          variant === 'outline' && "border border-primary text-primary hover:bg-primary/5",
          variant === 'ghost' && "hover:bg-primary/5 text-primary",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
