import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 active:scale-[0.98]",
  secondary:
    "bg-secondary text-white hover:opacity-90 active:scale-[0.98]",
  outline:
    "bg-transparent border-2 border-ink/15 text-ink hover:border-ink/30",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3.5",
  lg: "text-lg px-8 py-4.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
