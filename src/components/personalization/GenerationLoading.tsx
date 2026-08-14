"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationLoadingProps {
  childName: string;
  hasPhoto?: boolean;
  onComplete: () => void;
}

const STEP_DURATION_MS = 900;

function buildLabels(name: string, hasPhoto: boolean) {
  return [
    `Conhecendo ${name}`,
    "Escolhendo sua aventura",
    hasPhoto ? `Transformando a foto de ${name} em personagem` : "Criando seu personagem",
    "Escrevendo o primeiro capítulo...",
  ];
}

export function GenerationLoading({ childName, hasPhoto = false, onComplete }: GenerationLoadingProps) {
  const labels = buildLabels(childName || "seu filho", hasPhoto);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= labels.length) {
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setActiveIndex((i) => i + 1), STEP_DURATION_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center rounded-card bg-white p-8 text-center shadow-xl shadow-ink/10 sm:p-10">
      <span className="text-4xl">✨</span>
      <p className="mt-4 font-display text-xl font-semibold text-ink">
        Estamos dando vida à aventura de {childName || "seu filho"}...
      </p>

      <ul className="mt-8 flex w-full flex-col gap-3 text-left">
        {labels.map((label, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                done && "bg-success/10 text-success",
                active && "bg-primary/10 text-primary-dark",
                !done && !active && "text-ink-soft/50",
              )}
            >
              {done ? (
                <Check className="h-4 w-4 shrink-0" />
              ) : active ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-current" />
              )}
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
