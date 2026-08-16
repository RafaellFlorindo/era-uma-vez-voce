"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Loader2, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StyledPhotoCover } from "@/components/personalization/StyledPhotoCover";
import { fetchAiNarration } from "@/services/story/aiStoryClient";
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
 * Só a página 1 tem narração de graça — dispara a busca assim que a prévia
 * aparece, pra já estar pronta (ou quase) quando o usuário clicar "Ouvir".
 */
function useNarrationPrefetch(firstPage: string) {
  const promiseRef = useRef<Promise<string> | null>(null);

  function getAudio(): Promise<string> {
    if (promiseRef.current) return promiseRef.current;
    const promise = fetchAiNarration(firstPage).catch((error) => {
      promiseRef.current = null; // permite tentar de novo num próximo clique
      throw error;
    });
    promiseRef.current = promise;
    return promise;
  }

  useEffect(() => {
    getAudio().catch(() => {
      /* erro tratado no clique, aqui só evita unhandled rejection */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage]);

  return getAudio;
}

export function StoryPreviewSection({
  session,
  preview,
  aiImageUrl,
  generatedByAi,
  onUnlock,
}: StoryPreviewSectionProps) {
  const getAudio = useNarrationPrefetch(preview.pages[0]);
  const childName = session.childName;

  // Mesma imagem da capa, só que borrada — representa as páginas 2, 3 e 4
  // sem custar geração extra por visitante.
  const lockedThumbUrl = aiImageUrl ?? `/covers/${session.theme ?? "magia"}.jpg`;

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

      <div className="mt-6 overflow-hidden rounded-card bg-white shadow-[var(--shadow-lift)] ring-1 ring-cream-deep">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.3fr]">
          <div className="flex items-center justify-center bg-cream p-6">
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
          <PageBlock label="Página 1" content={preview.pages[0]} getAudio={getAudio} />

          <button
            onClick={onUnlock}
            className="group grid w-full grid-cols-3 gap-2 rounded-xl border border-primary/20 bg-cream p-2"
          >
            {[2, 3, 4].map((n) => (
              <div key={n} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-ink/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lockedThumbUrl}
                  alt={`Página ${n} (bloqueada)`}
                  className="h-full w-full scale-110 object-cover blur-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                  <Lock className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
          </button>

          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <Lock className="h-5 w-5 text-primary-dark" />
            </div>
            <p className="mt-3 font-display text-base font-semibold text-ink">E essa foi só o começo...</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
              As páginas 2, 3 e 4 com ilustrações completas esperam por {childName || "seu filho"}{" "}
              do outro lado.
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
  getAudio,
}: {
  label: string;
  content: string;
  getAudio: () => Promise<string>;
}) {
  const [state, setState] = useState<NarrationState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    <div className="rounded-xl border border-ink/10 bg-cream p-4">
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
  );
}
