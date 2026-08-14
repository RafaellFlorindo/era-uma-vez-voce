"use client";

import { useEffect, useRef, useState } from "react";
import { ImageOff, Lock, Loader2, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StyledPhotoCover } from "@/components/personalization/StyledPhotoCover";
import { fetchAiNarration } from "@/services/story/aiStoryClient";
import { buildPageImageUrl } from "@/services/story/pollinationsImage";
import { trackEvent } from "@/lib/analytics";
import { StorySession, StoryPreview } from "@/types/story";

interface StoryPreviewSectionProps {
  session: StorySession;
  preview: StoryPreview;
  aiImageUrl?: string;
  generatedByAi?: boolean;
  onUnlock: () => void;
}

/**
 * Mantém um cache de promises de narração por página, e já dispara a
 * geração de todas assim que a prévia aparece — assim, quando o usuário
 * clicar "Ouvir", o áudio já está pronto (ou quase) em vez de começar do
 * zero e demorar até 30s, o que derrubava a conversão.
 */
function useNarrationPrefetch(pages: string[]) {
  const cacheRef = useRef<Map<number, Promise<string>>>(new Map());

  function getAudio(index: number): Promise<string> {
    const existing = cacheRef.current.get(index);
    if (existing) return existing;

    const promise = fetchAiNarration(pages[index]).catch((error) => {
      cacheRef.current.delete(index); // permite tentar de novo num próximo clique
      throw error;
    });
    cacheRef.current.set(index, promise);
    return promise;
  }

  useEffect(() => {
    pages.forEach((_, index) => {
      getAudio(index).catch(() => {
        /* erro tratado no clique, aqui só evita unhandled rejection */
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  return getAudio;
}

export function StoryPreviewSection({
  session,
  preview,
  aiImageUrl,
  generatedByAi,
  onUnlock,
}: StoryPreviewSectionProps) {
  const getAudio = useNarrationPrefetch(preview.pages);
  const childName = session.childName;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="flex items-center justify-center gap-1.5 text-center font-display text-lg font-medium text-primary-dark sm:text-xl">
        <Sparkles className="h-5 w-5" />A história de {childName || "seu filho"} começou...
      </p>
      {generatedByAi && (
        <p className="mt-1 text-center text-xs font-medium text-success">
          Texto criado agora mesmo por inteligência artificial
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-card bg-white shadow-xl shadow-ink/10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.3fr]">
          <div className="flex items-center justify-center bg-secondary p-6">
            <StyledPhotoCover
              photoDataUrl={session.photoDataUrl}
              theme={session.theme}
              visualStyle={session.visualStyle}
              aiImageUrl={aiImageUrl}
              title={preview.title}
              className="max-w-[220px]"
            />
          </div>
          <div className="p-6 sm:p-8">
            <p className="font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
              {preview.title}
            </p>
            <p className="mt-3 text-sm text-ink-soft">{preview.intro}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-ink/10 p-6 sm:p-8">
          {preview.pages.map((page, index) => (
            <PageBlock
              key={index}
              label={`Página ${index + 1}`}
              content={page}
              imageUrl={buildPageImageUrl(session, index)}
              getAudio={() => getAudio(index)}
            />
          ))}

          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <Lock className="h-5 w-5 text-primary-dark" />
            </div>
            <p className="mt-3 font-display text-base font-semibold text-ink">E essa foi só o começo...</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
              A partir da página 4, novos capítulos e ilustrações exclusivas esperam por{" "}
              {childName || "seu filho"}.
            </p>
            <Button onClick={onUnlock} className="mt-4 w-full sm:w-auto">
              Quero ver a história completa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type NarrationState = "idle" | "loading" | "playing" | "error";

function PageBlock({
  label,
  content,
  imageUrl,
  getAudio,
}: {
  label: string;
  content: string;
  imageUrl: string;
  getAudio: () => Promise<string>;
}) {
  const [state, setState] = useState<NarrationState>("idle");
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);
  const retryCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleImageError() {
    // A API gratuita às vezes bloqueia o pedido com um desafio anti-bot que
    // não dá pra resolver automaticamente — tenta de novo algumas vezes
    // antes de desistir e mostrar um estado de erro.
    if (retryCountRef.current < 2) {
      retryCountRef.current += 1;
      setTimeout(() => setRetryKey((k) => k + 1), 1200);
    } else {
      setImageStatus("error");
    }
  }

  async function handleNarrate() {
    if (state === "loading") return;

    if (state === "playing") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setState("playing");
      return;
    }

    setState("loading");
    trackEvent("narration_requested", { label });
    try {
      const audioDataUrl = await getAudio();
      const audio = new Audio(audioDataUrl);
      audio.onended = () => setState("idle");
      audioRef.current = audio;
      await audio.play();
      setState("playing");
    } catch (error) {
      console.warn("[narration] falhou:", error);
      setState("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-cream">
      <div className="relative aspect-video w-full bg-ink/5">
        {imageStatus !== "error" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={retryKey}
            src={retryKey > 0 ? `${imageUrl}&retry=${retryKey}` : imageUrl}
            alt={label}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              imageStatus === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageStatus("loaded")}
            onError={handleImageError}
          />
        )}
        {imageStatus === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-ink-soft/50" />
          </div>
        )}
        {imageStatus === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-ink-soft/50">
            <ImageOff className="h-5 w-5" />
            <span className="text-[11px]">Ilustração indisponível no momento</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">{label}</p>
          <button
            onClick={handleNarrate}
            className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink-soft shadow-sm transition-colors hover:text-primary-dark"
          >
            {state === "loading" && <Loader2 className="h-3 w-3 animate-spin" />}
            {state === "playing" && <Pause className="h-3 w-3" />}
            {(state === "idle" || state === "error") && <Play className="h-3 w-3" />}
            {state === "loading" ? "Preparando..." : state === "playing" ? "Pausar" : "Ouvir"}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-ink-soft">{content}</p>
        {state === "error" && (
          <p className="mt-1.5 text-xs text-primary-dark">Não foi possível gerar a narração agora.</p>
        )}
      </div>
    </div>
  );
}
