"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";

interface FinalCtaSectionProps {
  onStart: () => void;
}

export function FinalCtaSection({ onStart }: FinalCtaSectionProps) {
  function handleClick() {
    trackEvent("hero_cta_clicked", { location: "final_cta" });
    onStart();
  }

  return (
    <section className="relative overflow-hidden bg-secondary py-20 sm:py-28">
      {/* Céu noturno: é a seção do "antes de dormir", então escurece e brilha. */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent/18 blur-[100px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <Container className="relative">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <Reveal as="h2" className="font-display text-[1.75rem] leading-[1.14] font-semibold text-balance text-white sm:text-4xl">
            Toda criança merece se ver como o herói da própria história.
          </Reveal>
          <Reveal as="p" delay={100} className="mt-5 text-base leading-relaxed text-balance text-white/80 sm:text-lg">
            Daqui a alguns anos ele não vai lembrar do brinquedo que ganhou.
            Vai lembrar da noite em que descobriu que a história era sobre ele.
          </Reveal>
          <Reveal delay={200}>
            <Button size="lg" variant="primary" className="mt-8" onClick={handleClick}>
              Criar a história do meu filho
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
