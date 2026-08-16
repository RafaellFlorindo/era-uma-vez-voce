import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WizardShellProps {
  step: number;
  totalSteps: number;
  children: ReactNode;
}

export function WizardShell({ step, totalSteps, children }: WizardShellProps) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-card bg-white p-6 shadow-[var(--shadow-lift)] ring-1 ring-cream-deep sm:p-8">
      <div className="mb-6 flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < step ? "bg-primary" : "bg-ink/10",
            )}
          />
        ))}
      </div>
      <div className="animate-fade-in-up" key={step}>
        {children}
      </div>
    </div>
  );
}
