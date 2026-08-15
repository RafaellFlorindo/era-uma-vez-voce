"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import { demoBook } from "@/config/demo";

export function DemoSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionTitle
          eyebrow="Veja antes de acreditar"
          title="A carinha dele quando percebe que a história é sobre ele."
          subtitle="É o mesmo livro que ele vai pedir para ouvir de novo toda noite."
        />

        <Reveal
          delay={100}
          className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-card bg-white shadow-[var(--shadow-lift)] ring-1 ring-cream-deep"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[3/4] bg-secondary">
              <ImageWithPlaceholder
                src={demoBook.cover.imageUrl}
                alt={demoBook.cover.alt}
                placeholderLabel="Capa de exemplo"
                className="absolute inset-0"
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-accent/18 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-primary-dark uppercase">
                Livro de exemplo
              </span>
              <p className="mt-3 font-display text-xl leading-snug font-semibold text-balance text-ink sm:text-2xl">
                {demoBook.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                O nome no título, o rosto na capa e a aventura preferida dele por
                dentro. É assim que fica o livro do seu filho.
              </p>
              <NarrationPlayer />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-ink/10 p-6 sm:grid-cols-3 sm:p-8">
            {demoBook.pages.map((page, index) => (
              <div key={index} className="flex flex-col gap-2.5">
                <ImageWithPlaceholder
                  src={page.imageUrl}
                  alt={`Página ${index + 1} do livro de exemplo`}
                  placeholderLabel={`Ilustração da página ${index + 1}`}
                  className="aspect-[4/3] w-full rounded-xl"
                />
                <p className="text-xs leading-relaxed text-ink-soft">{page.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function NarrationPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const audio = new Audio(demoBook.audioUrl);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setUnavailable(true);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || unavailable) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setUnavailable(true));
  }

  return (
    <button
      onClick={toggle}
      disabled={unavailable}
      className="mt-5 flex items-center gap-3 rounded-full bg-cream-dark px-4 py-3 text-left transition-colors hover:bg-accent/20 disabled:cursor-default disabled:opacity-70 disabled:hover:bg-cream-dark"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
      </span>
      <span className="text-sm font-medium text-ink">
        {unavailable
          ? "Narração de exemplo em breve"
          : playing
            ? `Ouvindo a história de ${demoBook.childName}...`
            : `Ouvir a história de ${demoBook.childName}`}
      </span>
    </button>
  );
}
