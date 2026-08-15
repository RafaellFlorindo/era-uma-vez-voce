import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({ eyebrow, title, subtitle, align = "center", className }: SectionTitleProps) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && (
        <span
          className={cn(
            "mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark",
            align === "center" ? "justify-center" : "",
          )}
        >
          <span aria-hidden className="h-px w-6 bg-primary/40" />
          {eyebrow}
          <span aria-hidden className="h-px w-6 bg-primary/40" />
        </span>
      )}
      <h2 className="font-display text-[1.75rem] leading-[1.12] font-semibold text-balance text-ink sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{subtitle}</p>
      )}
    </Reveal>
  );
}
