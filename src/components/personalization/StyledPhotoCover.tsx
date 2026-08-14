"use client";

import { ThemeId, VisualStyleId } from "@/types/story";
import { THEME_VISUALS, VISUAL_STYLE_FILTERS } from "@/services/story/mockStoryGenerator";
import { cn } from "@/lib/utils";

interface StyledPhotoCoverProps {
  photoDataUrl?: string;
  theme?: ThemeId;
  visualStyle?: VisualStyleId;
  title?: string;
  size?: "sm" | "lg";
  className?: string;
}

/**
 * "Gera" a capa do livro a partir da foto real enviada pelos pais, aplicando
 * um filtro CSS + overlay temático + o companheiro de aventura por cima —
 * simula uma ilustração sem depender de geração de imagem por IA (fase 1).
 */
export function StyledPhotoCover({
  photoDataUrl,
  theme,
  visualStyle,
  title,
  size = "lg",
  className,
}: StyledPhotoCoverProps) {
  const visual = theme ? THEME_VISUALS[theme] : undefined;
  const styleFilter = visualStyle ? VISUAL_STYLE_FILTERS[visualStyle] : "";
  const filter = [visual?.filter, styleFilter].filter(Boolean).join(" ");

  if (!photoDataUrl) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/covers/${theme ?? "magia"}.svg`}
          alt={title ?? ""}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoDataUrl}
        alt={title ?? "Foto personalizada"}
        className="h-full w-full object-cover transition-[filter] duration-500"
        style={{ filter: filter || undefined }}
      />
      {visual && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background: `linear-gradient(160deg, ${visual.colorFrom}55, ${visual.colorTo}99)`,
          }}
        />
      )}
      {visual && (
        <div
          className={cn(
            "animate-fade-in-up absolute flex items-center justify-center rounded-full bg-white shadow-md",
            size === "sm" ? "bottom-1 right-1 h-6 w-6 text-sm" : "bottom-3 right-3 h-11 w-11 text-2xl",
          )}
          title={visual.companionLabel}
        >
          {visual.companionEmoji}
        </div>
      )}
    </div>
  );
}
