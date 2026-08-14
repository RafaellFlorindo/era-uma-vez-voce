"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function DemoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionTitle
          title="A carinha dele quando percebe que a história é sobre ele."
          subtitle="É o mesmo livro que ele vai pedir para ouvir de novo toda noite."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-card bg-white shadow-xl shadow-ink/10">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col justify-center bg-gradient-to-br from-secondary to-[#1d4655] p-8 text-center text-white sm:p-10">
                <span className="text-5xl">🦕</span>
                <p className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl">
                  Gabriel e a Jornada no Vale dos Dinossauros
                </p>
                <span className="mt-3 text-sm text-white/70">Capa personalizada</span>
              </div>

              <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary-dark">
                  Página 1
                </p>
                <p className="text-base leading-relaxed text-ink-soft">
                  &ldquo;Naquela manhã, Gabriel ainda não sabia que estava
                  prestes a encontrar algo que nenhuma outra criança havia
                  visto antes...&rdquo;
                </p>

                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="mt-2 flex items-center gap-3 rounded-full bg-cream-dark px-4 py-3 text-left transition-colors hover:bg-accent/20"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {playing ? "Ouvindo a história de Gabriel..." : "Ouvir a história de Gabriel"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
