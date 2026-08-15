"use client";

import { Sparkles } from "lucide-react";
import { useStorySessionStore } from "@/store/storySession";
import { generateLivePreview } from "@/services/story/mockStoryGenerator";
import { StyledPhotoCover } from "@/components/personalization/StyledPhotoCover";
import { cn } from "@/lib/utils";

export function LivePreviewCard() {
  const session = useStorySessionStore((s) => s.session);
  const preview = generateLivePreview(session);

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-card bg-white shadow-[var(--shadow-card)] ring-1 ring-cream-deep">
      <div className="flex items-center gap-2 border-b border-ink/10 bg-cream px-4 py-2.5">
        <Sparkles className={cn("h-3.5 w-3.5", preview.ready ? "text-primary" : "text-ink-soft/40")} />
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {preview.ready ? "Prévia sendo criada ao vivo" : "Aguardando respostas..."}
        </span>
      </div>

      <div className="flex items-center gap-4 p-4">
        <StyledPhotoCover
          photoDataUrl={session.photoDataUrl}
          theme={session.theme}
          visualStyle={session.visualStyle}
          title={preview.title}
          size="sm"
          className="w-16 shrink-0 sm:w-20"
        />

        <div key={preview.title} className="animate-fade-in-up">
          <p className="font-display text-sm font-semibold leading-snug text-ink sm:text-base">
            {preview.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft sm:text-sm">{preview.snippet}</p>
        </div>
      </div>
    </div>
  );
}
