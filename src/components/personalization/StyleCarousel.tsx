"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StyledPhotoCover } from "@/components/personalization/StyledPhotoCover";
import { visualStyleOptions } from "@/components/personalization/wizardOptions";
import { ThemeId, VisualStyleId } from "@/types/story";
import { cn } from "@/lib/utils";

interface StyleCarouselProps {
  theme?: ThemeId;
  photoDataUrl?: string;
  onSelect: (style: VisualStyleId) => void;
}

export function StyleCarousel({ theme, photoDataUrl, onSelect }: StyleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = visualStyleOptions[activeIndex];

  function goTo(index: number) {
    setActiveIndex((index + visualStyleOptions.length) % visualStyleOptions.length);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[240px]">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Estilo anterior"
          className="absolute left-[-14px] top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="overflow-hidden rounded-card shadow-lg">
          <StyledPhotoCover
            key={active.id}
            photoDataUrl={photoDataUrl}
            theme={theme}
            visualStyle={active.id}
            className="animate-fade-in-up"
          />
        </div>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Próximo estilo"
          className="absolute right-[-14px] top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="font-display text-base font-semibold text-ink">{active.label}</p>

      <div className="flex items-center gap-2">
        {visualStyleOptions.map((style, index) => (
          <button
            key={style.id}
            type="button"
            aria-label={style.label}
            onClick={() => goTo(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex ? "w-6 bg-primary" : "w-2 bg-ink/15",
            )}
          />
        ))}
      </div>

      <Button size="lg" onClick={() => onSelect(active.id)} className="w-full sm:w-auto">
        Escolher este estilo
      </Button>
    </div>
  );
}
