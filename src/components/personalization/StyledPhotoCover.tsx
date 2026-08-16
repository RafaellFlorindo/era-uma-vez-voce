"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
  /** URL de imagem gerada por IA (ex: Pollinations). Quando presente, tem prioridade sobre a foto+filtro. */
  aiImageUrl?: string;
}

/**
 * "Gera" a capa do livro. Prioridade:
 * 1. `aiImageUrl` — imagem real gerada por IA (Pollinations por enquanto).
 * 2. foto enviada pelos pais + filtro CSS temático (fallback enquanto a IA carrega ou falha).
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
  const [aiImageStatus, setAiImageStatus] = useState<"loading" | "ready" | "error">(
    aiImageUrl ? "loading" : "error",
  );

  const visual = theme ? THEME_VISUALS[theme] : undefined;
  const styleFilter = visualStyle ? VISUAL_STYLE_FILTERS[visualStyle] : "";
  const filter = [visual?.filter, styleFilter].filter(Boolean).join(" ");

  const showAiImage = Boolean(aiImageUrl) && aiImageStatus !== "error";
  const showFallback = !showAiImage || aiImageStatus === "loading";

  return (
    <div className={cn("relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-lg", className)}>
      {showFallback &&
        (photoDataUrl ? (
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
        ))}

      {aiImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={aiImageUrl}
          alt={title ?? "Personagem gerado por IA"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            aiImageStatus === "ready" ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setAiImageStatus("ready")}
          onError={() => setAiImageStatus("error")}
        />
      )}

      {aiImageStatus === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/10 backdrop-blur-[1px]">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Gerando ilustração...
          </span>
        </div>
      )}

      {showFallback && visual && (
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
