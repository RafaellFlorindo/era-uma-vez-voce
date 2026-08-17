"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { ArrowRight, Clock, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
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
      className="relative overflow-hidden bg-gradient-to-b from-cream-dark via-cream to-cream pt-12 pb-16 sm:pt-20 sm:pb-24"
    >
      {/* Atmosfera: manchas quentes fora de foco, como luz atravessando papel. */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[26rem] w-[26rem] rounded-full bg-accent/25 blur-[100px]" />
      <div className="pointer-events-none absolute top-52 -right-28 h-[30rem] w-[30rem] rounded-full bg-primary/12 blur-[110px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-cream/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-dark shadow-[var(--shadow-sm)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Um livro que só existe para ele
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[2.1rem] leading-[1.08] font-semibold text-balance text-ink sm:text-5xl md:text-[3.75rem]">
              O dia em que seu filho descobre que{" "}
              <em className="highlight-marker not-italic text-primary-dark">
                o herói da história é ele
              </em>
              .
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Um livro criado do zero com o nome dele, o rosto dele, o jeitinho
              dele e o mundo que ele mais ama. Nenhuma outra criança vai ter uma
              história igual.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-center gap-4">
              <Button size="lg" onClick={handleClick} className="group w-full sm:w-auto">
                Criar a história do meu filho
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-ink-soft">
                <TrustItem icon={<Clock className="h-3.5 w-3.5" />}>Leva 2 minutos</TrustItem>
                <TrustItem icon={<Sparkles className="h-3.5 w-3.5" />}>Prévia grátis antes de decidir</TrustItem>
                <TrustItem icon={<ShieldCheck className="h-3.5 w-3.5" />}>Sem cadastro nem cartão</TrustItem>
              </ul>
            </div>
          </Reveal>
        </div>

        <HeroTransformDemo />
      </Container>
    </section>
  );
});

function TrustItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span className="text-success">{icon}</span>
      {children}
    </li>
  );
}

function HeroTransformDemo() {
  return (
    <Reveal delay={320} className="mx-auto mt-14 flex max-w-2xl flex-col items-center sm:mt-20">
      <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
        <PolaroidCard label="A foto que você envia" tone="photo" tilt="-3deg" />

        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary-dark ring-1 ring-primary/20">
            <Wand2 className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
            vira
          </span>
        </div>

        <PolaroidCard label="O herói do livro dele" tone="character" tilt="2.5deg" featured />
      </div>

      <p className="mt-8 max-w-md text-center font-display text-lg leading-snug font-medium text-balance text-secondary sm:text-xl">
        &ldquo;Gabriel e a Jornada no Vale dos Dinossauros&rdquo;
      </p>
      <p className="mt-1.5 text-[13px] text-ink-faint">Exemplo real gerado na plataforma</p>
    </Reveal>
  );
}

function PolaroidCard({
  label,
  tone,
  tilt,
  featured = false,
}: {
  label: string;
  tone: "photo" | "character";
  tilt: string;
  featured?: boolean;
}) {
  const src = tone === "photo" ? "/hero/gabriel-foto.jpg" : "/hero/gabriel-heroi.jpg";

  return (
    <figure
      style={{ rotate: tilt }}
      className={`relative w-44 rounded-2xl bg-white p-2.5 pb-3 transition-[rotate,box-shadow,scale] duration-500 hover:rotate-0 hover:scale-[1.03] sm:w-52 ${
        featured ? "shadow-[var(--shadow-lift)] ring-1 ring-accent/40" : "shadow-[var(--shadow-card)]"
      }`}
    >
      {featured && (
        <span className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap uppercase tracking-wider text-ink shadow-[var(--shadow-sm)]">
          O livro dele
        </span>
      )}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-cream-dark">
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 640px) 176px, 208px"
          className="object-cover"
          priority={tone === "photo"}
        />
      </div>
      <figcaption className="mt-2.5 text-center font-display text-[13px] font-medium text-ink-soft">
        {label}
      </figcaption>
    </figure>
  );
}
