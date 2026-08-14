import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({ eyebrow, title, subtitle, align = "center", className }: SectionTitleProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-dark">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base text-ink-soft sm:text-lg">{subtitle}</p>}
    </div>
  );
}
