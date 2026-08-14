"use client";

import { useCallback, useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  /** Texto mostrado no lugar da imagem enquanto o arquivo não existir. */
  placeholderLabel?: string;
  className?: string;
  imageClassName?: string;
}

/**
 * Mostra uma imagem e, se o arquivo ainda não tiver sido adicionado ao
 * projeto, cai num placeholder discreto no lugar de um ícone de imagem
 * quebrada. Serve para deixar a página apresentável enquanto as artes
 * definitivas não chegam.
 */
export function ImageWithPlaceholder({
  src,
  alt,
  placeholderLabel = "Imagem em breve",
  className,
  imageClassName,
}: ImageWithPlaceholderProps) {
  const [failed, setFailed] = useState(false);

  // O erro de carregamento costuma acontecer antes da hidratação, então o
  // onError do React nunca chega a disparar. Checar o estado do elemento no
  // momento em que ele é montado cobre esse caso.
  const checkOnMount = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 bg-cream-dark text-ink-soft/60",
          className,
        )}
      >
        <ImageIcon className="h-6 w-6" />
        <span className="px-3 text-center text-[11px] leading-tight">{placeholderLabel}</span>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-cream-dark", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={checkOnMount}
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}
