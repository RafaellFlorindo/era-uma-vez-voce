"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { trackEvent } from "@/lib/analytics";

interface HeroProps {
  onStart: () => void;
}

export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero({ onStart }, ref) {
  function handleClick() {
    trackEvent("hero_cta_clicked", { location: "hero" });
    onStart();
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream pt-10 pb-14 sm:pt-16 sm:pb-20"
    >
      <div className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-dark">
            <Sparkles className="h-3.5 w-3.5" />
            Uma história feita só para ele
          </span>

          <h1 className="font-display text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl md:text-5xl">
            Seu filho nunca mais vai ouvir uma história do mesmo jeito.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Transforme seu filho no personagem principal de uma aventura criada
            especialmente para ele — com seu nome, seu rosto e tudo aquilo que
            ele mais ama.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button size="lg" onClick={handleClick} className="group">
              Criar a história do meu filho
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <span className="text-sm text-ink-soft">
              Leva menos de 2 minutos para começar.
            </span>
          </div>
        </div>

        <HeroTransformDemo />
      </Container>
    </section>
  );
});

function HeroTransformDemo() {
  return (
    <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-3 sm:mt-16">
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
        <PolaroidCard label="Gabriel" tone="photo" />

        <ArrowRight className="hidden h-6 w-6 shrink-0 rotate-90 text-primary sm:block sm:rotate-0" />
        <div className="block h-6 w-6 shrink-0 rotate-90 text-primary sm:hidden">
          <ArrowRight className="h-6 w-6" />
        </div>

        <PolaroidCard label="Gabriel, o Herói" tone="character" />
      </div>

      <p className="mt-2 max-w-md text-center font-display text-lg font-medium text-secondary sm:text-xl">
        &ldquo;Gabriel e a Jornada no Vale dos Dinossauros&rdquo;
      </p>
    </div>
  );
}

function PolaroidCard({ label, tone }: { label: string; tone: "photo" | "character" }) {
  const src = tone === "photo" ? "/hero/gabriel-foto.png" : "/hero/gabriel-heroi.png";

  return (
    <div className="w-40 rotate-[-2deg] rounded-2xl bg-white p-2.5 shadow-xl shadow-ink/10 transition-transform hover:rotate-0 sm:w-44">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-cream-dark">
        <Image
          src={src}
          alt={label}
          fill
          sizes="176px"
          className="object-cover"
          priority={tone === "photo"}
        />
      </div>
      <p className="mt-2 text-center font-display text-sm font-medium text-ink">{label}</p>
    </div>
  );
}
