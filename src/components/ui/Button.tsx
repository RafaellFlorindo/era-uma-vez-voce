import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * O primário tem uma borda inferior sólida (via --shadow-cta) que dá
 * volume de tecla física e afunda no `:active`. É o único elemento da
 * página com esse tratamento, para que nada dispute atenção com ele.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[var(--shadow-cta)] hover:bg-primary-dark hover:shadow-[var(--shadow-cta-hover)] hover:-translate-y-px active:translate-y-0.5 active:shadow-[0_0_0_var(--color-primary-deep)]",
  secondary:
    "bg-secondary text-white shadow-[0_2px_0_#1c4351,0_12px_24px_-10px_rgba(44,95,111,0.5)] hover:brightness-110 hover:-translate-y-px active:translate-y-0.5 active:shadow-[0_0_0_#1c4351]",
  outline:
    "bg-cream/60 border-2 border-ink/15 text-ink hover:border-primary/50 hover:bg-cream hover:text-primary-dark",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3.5",
  lg: "text-lg px-8 py-4.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group/btn relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-button font-semibold tracking-[-0.01em] transition-all duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-dark",
          "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/25 blur-md motion-safe:animate-[cta-sheen_5s_ease-in-out_infinite]"
          />
        )}
        <span className="relative inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
Button.displayName = "Button";
