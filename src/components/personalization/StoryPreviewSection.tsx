"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Lock, Loader2, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StyledPhotoCover } from "@/components/personalization/StyledPhotoCover";
import { downloadAiEbook, fetchAiNarration } from "@/services/story/aiStoryClient";
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
  const [ebookState, setEbookState] = useState<"idle" | "loading" | "error">("idle");

  async function handleDownloadEbook() {
    if (ebookState === "loading") return;
    setEbookState("loading");
    trackEvent("ebook_download_requested", { childName });
    try {
      await downloadAiEbook(session, { title: preview.title, intro: preview.intro, pages: preview.pages });
      setEbookState("idle");
    } catch (error) {
      console.warn("[ebook] falhou:", error);
      setEbookState("error");
    }
  }

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
              getAudio={() => getAudio(index)}
            />
          ))}

          <button
            onClick={handleDownloadEbook}
            disabled={ebookState === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 bg-cream py-3 text-xs font-medium text-ink-soft transition-colors hover:border-primary/40 hover:text-primary-dark disabled:opacity-60"
          >
            {ebookState === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {ebookState === "loading" ? "Montando o PDF de prévia..." : "Baixar estas páginas em PDF"}
          </button>
          {ebookState === "error" && (
            <p className="text-center text-xs text-primary-dark">Não foi possível gerar o PDF agora.</p>
          )}

          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-cream p-5 text-center">
            <p className="blur-[3px] select-none text-sm leading-relaxed text-ink-soft">
              A aventura de {childName || "seu filho"} continua se desenrolando, capítulo após
              capítulo, com novas descobertas e ilustrações exclusivas esperando em cada página...
            </p>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream/85 px-4">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
                <Lock className="h-3.5 w-3.5" />
                Página 4 em diante bloqueadas
              </span>
              <Button onClick={onUnlock}>Quero ver a história completa</Button>
            </div>
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
