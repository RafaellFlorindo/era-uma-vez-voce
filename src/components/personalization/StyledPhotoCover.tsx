"use client";

import { useState } from "react";
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
  /** URL de imagem fixa (arquivo local), sempre a mesma pro tema — simula a ilustração já gerada. Tem prioridade sobre a foto+filtro. */
  aiImageUrl?: string;
}

/**
 * "Gera" a capa do livro. Prioridade:
 * 1. `aiImageUrl` — ilustração fixa do tema (arquivo local, carrega instantâneo, sem loading).
 * 2. foto enviada pelos pais + filtro CSS temático (fallback se o arquivo do tema falhar).
 * 3. capa ilustrada genérica (sem foto nenhuma).
 */
export function StyledPhotoCover({
  photoDataUrl,
  theme,
  visualStyle,
  title,
  size = "lg",
  className,
  aiImageUrl,
}: StyledPhotoCoverProps) {
  const [aiImageFailed, setAiImageFailed] = useState(false);

  const visual = theme ? THEME_VISUALS[theme] : undefined;
  const styleFilter = visualStyle ? VISUAL_STYLE_FILTERS[visualStyle] : "";
  const filter = [visual?.filter, styleFilter].filter(Boolean).join(" ");

  const showAiImage = Boolean(aiImageUrl) && !aiImageFailed;

  return (
    <div className={cn("relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg", className)}>
      {showAiImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={aiImageUrl}
          alt={title ?? "Ilustração do tema"}
          className="h-full w-full object-cover"
          onError={() => setAiImageFailed(true)}
        />
      ) : photoDataUrl ? (
        <>
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
              style={{ background: `linear-gradient(160deg, ${visual.colorFrom}55, ${visual.colorTo}99)` }}
            />
          )}
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={theme ? `/covers/${theme}.jpg` : "/covers/mae-filho.jpg"}
          alt={title ?? ""}
          className="h-full w-full object-cover"
        />
      )}

      {!showAiImage && visual && (
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
