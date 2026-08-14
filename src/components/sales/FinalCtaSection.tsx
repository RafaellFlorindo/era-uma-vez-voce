"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
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
    <section className="bg-secondary py-16 sm:py-20">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Toda criança merece viver uma história em que ela é o herói.
          </h2>
          <Button size="lg" variant="primary" className="mt-7" onClick={handleClick}>
            Criar a história do meu filho
          </Button>
        </div>
      </Container>
    </section>
  );
}
