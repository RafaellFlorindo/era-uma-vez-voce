"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Lock, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { offer, pageTiers, formatPrice, DEFAULT_TIER_INDEX } from "@/config/offer";
import { handleInitiateCheckout } from "@/lib/checkout";
import { trackEvent } from "@/lib/analytics";
import { useStorySessionStore } from "@/store/storySession";
import { cn } from "@/lib/utils";

interface OfferSectionProps {
  childName: string;
  /** Chamado quando ainda não existe história gerada para vender. */
  onNeedsStory: () => void;
}

export function OfferSection({ childName, onNeedsStory }: OfferSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState(DEFAULT_TIER_INDEX);
  const session = useStorySessionStore((s) => s.session);
  const preview = useStorySessionStore((s) => s.preview);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedRef.current) {
          trackedRef.current = true;
          trackEvent("offer_viewed", { childName });
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [childName]);

  const selectedTier = pageTiers[selectedTierIndex];
  const pricePerPage = selectedTier.price / selectedTier.pages;

  // Sem prévia gerada não existe livro para entregar depois do pagamento.
  // Nesse caso o botão leva ao wizard em vez de cobrar por algo inexistente.
  const hasStory = Boolean(preview);
  const ctaLabel = !hasStory
    ? "Criar a história do meu filho"
    : `Quero completar a história de ${childName || "meu filho"}`;

  function handleBuy() {
    if (!preview) {
      trackEvent("offer_cta_without_story");
      onNeedsStory();
      return;
    }
    void handleInitiateCheckout(
      selectedTier,
      session,
      { title: preview.title, intro: preview.intro, pages: preview.pages },
      { childName, source: "offer_section" },
    );
  }

  return (
    <section ref={ref} id="oferta" className="scroll-mt-8 py-16 sm:py-24">
      <Container>
        <Reveal className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-[1.75rem] leading-[1.12] font-semibold text-balance text-ink sm:text-4xl">
            E isso foi só a primeira página.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            Leve a aventura completa {childName ? `de ${childName}` : "do seu filho"} para
            casa hoje, com todas as ilustrações e a narração para ouvir antes de dormir.
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="mx-auto mt-12 max-w-md overflow-hidden rounded-card bg-white shadow-[var(--shadow-lift)] ring-1 ring-cream-deep"
        >
          <div className="relative overflow-hidden bg-secondary px-6 py-6 text-center text-white">
            <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
            <p className="relative font-display text-lg leading-snug font-semibold text-balance sm:text-xl">
              A história completa {childName ? `de ${childName}` : "do seu filho"}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <ul className="flex flex-col gap-3">
              {offer.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-success/12">
                    <Check className="h-3 w-3 text-success" strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="my-7 rule-soft" />

            <div>
              <p className="mb-1 text-sm font-semibold text-ink">Tamanho do livro</p>
              <p className="mb-4 text-xs leading-relaxed text-ink-soft">
                Quanto mais páginas, mais capítulos e ilustrações na aventura dele.
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {pageTiers.map((tier, index) => {
                  const active = index === selectedTierIndex;
                  return (
                    <button
                      key={tier.pages}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedTierIndex(index)}
                      className={cn(
                        "relative flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border-2 px-2 pt-4 pb-3 text-center transition-all duration-200",
                        active
                          ? "-translate-y-0.5 border-primary bg-primary/8 shadow-[var(--shadow-card)]"
                          : "border-ink/10 bg-cream hover:border-primary/40 hover:bg-primary/4",
                      )}
                    >
                      {tier.badge && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold tracking-wide whitespace-nowrap text-ink uppercase shadow-[var(--shadow-sm)]">
                          {tier.badge}
                        </span>
                      )}
                      <span className="font-display text-xl font-bold text-ink">{tier.pages}</span>
                      <span className="text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                        páginas
                      </span>
                      <span className="mt-1 text-xs font-bold text-primary-dark">
                        {formatPrice(tier.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 text-center">
              <p className="text-xs font-medium tracking-[0.14em] text-ink-faint uppercase">
                Pagamento único
              </p>
              <span className="font-display text-[3.25rem] leading-none font-bold text-primary-dark">
                {formatPrice(selectedTier.price)}
              </span>
              <p className="mt-2 text-xs text-ink-soft">
                Sai a {formatPrice(pricePerPage)} por página ilustrada. O livro é seu para
                sempre.
              </p>
            </div>

            <Button size="lg" className="mt-6 w-full" onClick={handleBuy}>
              {ctaLabel}
            </Button>

            {!hasStory && (
              <p className="mt-2.5 text-center text-xs text-ink-soft">
                Primeiro monte a prévia gratuita. Leva 2 minutos.
              </p>
            )}

            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-ink-faint">
              <li className="inline-flex items-center gap-1">
                <Lock className="h-3 w-3" /> Pagamento seguro
              </li>
              <li className="inline-flex items-center gap-1">
                <Zap className="h-3 w-3" /> Acesso imediato
              </li>
              <li className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> 7 dias de garantia
              </li>
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
