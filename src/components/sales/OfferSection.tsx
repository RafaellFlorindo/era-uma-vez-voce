"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { offer, pageTiers, formatPrice, DEFAULT_TIER_INDEX } from "@/config/offer";
import { handleInitiateCheckout } from "@/lib/checkout";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface OfferSectionProps {
  childName: string;
}

export function OfferSection({ childName }: OfferSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState(DEFAULT_TIER_INDEX);

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

  const ctaLabel = childName
    ? `Quero completar a história de ${childName}`
    : "Quero criar a história do meu filho";

  const selectedTier = pageTiers[selectedTierIndex];

  return (
    <section ref={ref} className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            E isso foi só a primeira página.
          </h2>
          <p className="mt-3 text-base text-ink-soft sm:text-lg">
            Leve a aventura completa {childName ? `de ${childName}` : "do seu filho"} para
            casa hoje, com todas as ilustrações e a narração para ouvir antes de dormir.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-card bg-white shadow-xl shadow-ink/10">
          <div className="bg-secondary px-6 py-5 text-center text-white">
            <p className="font-display text-lg font-semibold sm:text-xl">
              A história completa {childName ? `de ${childName}` : "do seu filho"}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <ul className="flex flex-col gap-3">
              {offer.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <p className="mb-1 text-sm font-semibold text-ink">Tamanho do livro</p>
              <p className="mb-3 text-xs text-ink-soft">
                Quanto mais páginas, mais capítulos e ilustrações na aventura dele.
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {pageTiers.map((tier, index) => {
                  const active = index === selectedTierIndex;
                  return (
                    <button
                      key={tier.pages}
                      type="button"
                      onClick={() => setSelectedTierIndex(index)}
                      className={cn(
                        "relative flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 pb-3 pt-4 text-center transition-colors",
                        active
                          ? "border-primary bg-primary/10"
                          : "border-ink/10 bg-cream hover:border-primary/40",
                      )}
                    >
                      {tier.badge && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink">
                          {tier.badge}
                        </span>
                      )}
                      <span className="font-display text-lg font-bold text-ink">{tier.pages}</span>
                      <span className="text-[11px] uppercase tracking-wide text-ink-soft">páginas</span>
                      <span className="mt-0.5 text-xs font-bold text-primary-dark">
                        {formatPrice(tier.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="font-display text-4xl font-bold text-primary-dark">
                {formatPrice(selectedTier.price)}
              </span>
              <p className="mt-1 text-xs text-ink-soft">
                Pagamento único. O livro é seu para sempre.
              </p>
            </div>

            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={() =>
                handleInitiateCheckout(selectedTier.checkoutUrl, {
                  childName,
                  price: selectedTier.price,
                  pages: selectedTier.pages,
                })
              }
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
