"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WizardShell } from "@/components/personalization/WizardShell";
import { GenerationLoading } from "@/components/personalization/GenerationLoading";
import { StoryPreviewSection } from "@/components/personalization/StoryPreviewSection";
import { LivePreviewCard } from "@/components/personalization/LivePreviewCard";
import { PhotoUploadField } from "@/components/personalization/PhotoUploadField";
import { StyleCarousel } from "@/components/personalization/StyleCarousel";
import {
  ageOptions,
  genderOptions,
  personalityOptions,
  themeOptions,
  visualStyleOptions,
} from "@/components/personalization/wizardOptions";
import { useStorySessionStore } from "@/store/storySession";
import { generateMockStoryPreview } from "@/services/story/mockStoryGenerator";
import { fetchAiStoryText } from "@/services/story/aiStoryClient";
import { getTemplateCoverUrl } from "@/services/story/previewTemplates";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ChildGender, StoryPreview } from "@/types/story";

type Phase = "form" | "loading" | "preview";

const TOTAL_STEPS = 4;

interface PersonalizationSectionProps {
  onPreviewReady?: () => void;
}

export const PersonalizationSection = forwardRef<HTMLElement, PersonalizationSectionProps>(
  function PersonalizationSection({ onPreviewReady }, ref) {
    const session = useStorySessionStore((s) => s.session);
    const setChildName = useStorySessionStore((s) => s.setChildName);
    const setAge = useStorySessionStore((s) => s.setAge);
    const setGender = useStorySessionStore((s) => s.setGender);
    const setPhoto = useStorySessionStore((s) => s.setPhoto);
    const setTheme = useStorySessionStore((s) => s.setTheme);
    const togglePersonality = useStorySessionStore((s) => s.togglePersonality);
    const setVisualStyle = useStorySessionStore((s) => s.setVisualStyle);
    const setStep = useStorySessionStore((s) => s.setStep);
    const setStoredPreview = useStorySessionStore((s) => s.setPreview);
    const resetSession = useStorySessionStore((s) => s.reset);

    const [phase, setPhase] = useState<Phase>("form");
    const [preview, setPreview] = useState<StoryPreview | null>(null);
    const [usedRealAi, setUsedRealAi] = useState(false);
    const step = Math.min(session.currentStep || 1, TOTAL_STEPS);
    const aiStoryPromiseRef = useRef<Promise<StoryPreview> | null>(null);
    const phaseContentRef = useRef<HTMLDivElement>(null);
    const prevPhaseRef = useRef<Phase | null>(null);

    useEffect(() => {
      trackEvent("personalization_started");
    }, []);

    // Ao trocar de fase (form -> loading -> preview) o card muda de altura,
    // e o scroll do usuário pode acabar sobrando embaixo, cortando o topo do
    // conteúdo novo. Realinha o topo do card com o topo da tela sempre que
    // a fase muda de verdade — comparar com o valor anterior (em vez de um
    // simples "é a primeira renderização?") evita disparo em falso quando o
    // StrictMode do React invoca o efeito duas vezes na montagem.
    useEffect(() => {
      if (prevPhaseRef.current !== null && prevPhaseRef.current !== phase) {
        phaseContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      prevPhaseRef.current = phase;
    }, [phase]);

    function goToStep(next: number) {
      setStep(next);
    }

    function handleChildInfoSubmit() {
      trackEvent("child_name_completed", { childName: session.childName, hasPhoto: Boolean(session.photoDataUrl) });
      goToStep(2);
    }

    function handleThemeSubmit(theme: (typeof themeOptions)[number]["id"]) {
      setTheme(theme);
      trackEvent("theme_selected", { theme });
      goToStep(3);
    }

    function handlePersonalityContinue() {
      goToStep(4);
    }

    function handleStyleSubmit(style: (typeof visualStyleOptions)[number]["id"]) {
      const finalSession = { ...session, visualStyle: style };
      setVisualStyle(style);
      trackEvent("personalization_completed", finalSession);

      // Dispara a geração real em paralelo com a animação de loading, com
      // fallback silencioso pro mock caso a API falhe ou demore demais.
      aiStoryPromiseRef.current = fetchAiStoryText(finalSession)
        .then((ai) => {
          setUsedRealAi(true);
          return {
            title: ai.title,
            intro: ai.intro,
            coverUrl: `/covers/${finalSession.theme ?? "magia"}.jpg`,
            pages: ai.pages,
          };
        })
        .catch((error) => {
          console.warn("[ai] geração real falhou, usando mock:", error);
          trackEvent("ai_story_generation_failed", { message: String(error) });
          return generateMockStoryPreview(finalSession);
        });

      setPhase("loading");
    }

    async function handleLoadingComplete() {
      const generated = (await aiStoryPromiseRef.current) ?? generateMockStoryPreview(session);
      setPreview(generated);
      // Publica no store para a seção de oferta poder vender esta história.
      setStoredPreview(generated);
      setPhase("preview");
      trackEvent("preview_viewed", { title: generated.title });
      onPreviewReady?.();
    }

    function handleUnlock() {
      if (!preview) return;
      const target = document.getElementById("oferta-cartao") ?? document.getElementById("oferta");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return (
      <section ref={ref} id="criar-historia" className="paper-panel py-16 sm:py-24">
        <Container>
          <div ref={phaseContentRef} className="scroll-mt-6">
          <SectionTitle
            title={phase === "preview" ? "Sua história está tomando forma..." : "Vamos criar uma história agora?"}
            subtitle={
              phase === "form"
                ? "Conforme você responde, o livro vai sendo criado ao vivo, bem aqui."
                : undefined
            }
          />

          <div className="mt-8 space-y-5">
            {phase === "form" && <LivePreviewCard />}

            {phase === "form" && (
              <WizardShell step={step} totalSteps={TOTAL_STEPS}>
                {step === 1 && (
                  <StepChildInfo
                    childName={session.childName}
                    age={session.age}
                    gender={session.gender}
                    photoDataUrl={session.photoDataUrl}
                    onChangeName={setChildName}
                    onChangeAge={setAge}
                    onChangeGender={setGender}
                    onChangePhoto={setPhoto}
                    onSubmit={handleChildInfoSubmit}
                    onReset={resetSession}
                  />
                )}
                {step === 2 && (
                  <StepTheme childName={session.childName} onBack={() => goToStep(1)} onSubmit={handleThemeSubmit} />
                )}
                {step === 3 && (
                  <StepPersonality
                    childName={session.childName}
                    selected={session.personality}
                    onToggle={togglePersonality}
                    onBack={() => goToStep(2)}
                    onContinue={handlePersonalityContinue}
                  />
                )}
                {step === 4 && (
                  <StepStyle
                    childName={session.childName}
                    onBack={() => goToStep(3)}
                    onSubmit={handleStyleSubmit}
                  />
                )}
              </WizardShell>
            )}

            {phase === "loading" && (
              <GenerationLoading
                childName={session.childName}
                hasPhoto={Boolean(session.photoDataUrl)}
                onComplete={handleLoadingComplete}
              />
            )}

            {phase === "preview" && preview && (
              <StoryPreviewSection
                session={session}
                preview={preview}
                aiImageUrl={getTemplateCoverUrl(session.theme)}
                generatedByAi={usedRealAi}
                onUnlock={handleUnlock}
              />
            )}
          </div>
          </div>
        </Container>
      </section>
    );
  },
);

// --- Etapas ---

function StepChildInfo({
  childName,
  age,
  gender,
  photoDataUrl,
  onChangeName,
  onChangeAge,
  onChangeGender,
  onChangePhoto,
  onSubmit,
  onReset,
}: {
  childName: string;
  age?: number;
  gender?: ChildGender;
  photoDataUrl?: string;
  onChangeName: (name: string) => void;
  onChangeAge: (age: number) => void;
  onChangeGender: (gender: ChildGender) => void;
  onChangePhoto: (dataUrl: string | undefined) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const canSubmit = childName.trim().length > 0 && Boolean(age);
  const hasExistingData = Boolean(childName || age || gender || photoDataUrl);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="text-center">
        <label className="font-display text-xl font-semibold text-ink sm:text-2xl">
          Quem é a estrela da história?
        </label>
        <p className="mt-1 text-sm text-ink-soft">Conte sobre a criança para começarmos a criar.</p>
        {hasExistingData && (
          <button
            type="button"
            onClick={onReset}
            className="mt-1 text-xs font-medium text-ink-soft underline-offset-2 hover:text-primary-dark hover:underline"
          >
            Não é você? Recomeçar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink">Nome da criança</label>
        <input
          value={childName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Ex: Gabriel"
          className="w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 text-base text-ink outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink">Idade</label>
        <div className="grid grid-cols-4 gap-2">
          {ageOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChangeAge(option)}
              className={cn(
                "rounded-xl border-2 py-2.5 text-sm font-semibold transition-colors",
                age === option
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-ink/10 bg-cream text-ink hover:border-primary/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink">
          Gênero <span className="font-normal text-ink-soft">(opcional)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChangeGender(option.id)}
              className={cn(
                "rounded-xl border-2 py-2.5 text-sm font-semibold transition-colors",
                gender === option.id
                  ? "border-primary bg-primary/10 text-primary-dark"
                  : "border-ink/10 bg-cream text-ink hover:border-primary/40",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <PhotoUploadField value={photoDataUrl} onChange={onChangePhoto} />

      <Button type="submit" size="lg" disabled={!canSubmit} className="mx-auto w-full sm:w-auto">
        Continuar <ArrowRight className="h-5 w-5" />
      </Button>
    </form>
  );
}

function StepTheme({
  childName,
  onBack,
  onSubmit,
}: {
  childName: string;
  onBack: () => void;
  onSubmit: (theme: (typeof themeOptions)[number]["id"]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <label className="text-center font-display text-xl font-semibold text-ink sm:text-2xl">
        Que aventura {childName || "ele(a)"} escolheria?
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themeOptions.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSubmit(theme.id)}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-ink/10 bg-cream px-3 py-4 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="text-3xl">{theme.emoji}</span>
            <span className="text-sm font-medium text-ink">{theme.label}</span>
          </button>
        ))}
      </div>
      <BackButton onClick={onBack} />
    </div>
  );
}

function StepPersonality({
  childName,
  selected,
  onToggle,
  onBack,
  onContinue,
}: {
  childName: string;
  selected: string[];
  onToggle: (trait: (typeof personalityOptions)[number]["id"]) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <label className="font-display text-xl font-semibold text-ink sm:text-2xl">
          Como é {childName || "ele(a)"}?
        </label>
        <p className="mt-1 text-sm text-ink-soft">Escolha até 3 características.</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {personalityOptions.map((trait) => {
          const active = selected.includes(trait.id);
          return (
            <button
              key={trait.id}
              onClick={() => onToggle(trait.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 transition-colors",
                active ? "border-primary bg-primary/10" : "border-ink/10 bg-cream hover:border-primary/40",
              )}
            >
              <span className="text-2xl">{trait.emoji}</span>
              <span className="text-xs font-medium text-ink">{trait.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3">
        <BackButton onClick={onBack} />
        <Button onClick={onContinue} disabled={selected.length === 0}>
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepStyle({
  childName,
  onBack,
  onSubmit,
}: {
  childName: string;
  onBack: () => void;
  onSubmit: (style: (typeof visualStyleOptions)[number]["id"]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <label className="text-center font-display text-xl font-semibold text-ink sm:text-2xl">
        Qual estilo combina mais com a história {childName ? `de ${childName}` : "dele(a)"}?
      </label>
      <StyleCarousel onSelect={onSubmit} />
      <BackButton onClick={onBack} />
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-sm font-medium text-ink-soft underline-offset-2 hover:underline">
      Voltar
    </button>
  );
}
