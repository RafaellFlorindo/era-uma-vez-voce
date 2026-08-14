"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { offer, pageTiers, formatPrice } from "@/config/offer";
import { handleInitiateCheckout } from "@/lib/checkout";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface OfferSectionProps {
  childName: string;
}

export function OfferSection({ childName }: OfferSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

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
  const totalPrice = offer.price + selectedTier.extraPrice;

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

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-ink">Número de páginas</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {pageTiers.map((tier, index) => {
                  const active = index === selectedTierIndex;
                  return (
                    <button
                      key={tier.pages}
                      type="button"
                      onClick={() => setSelectedTierIndex(index)}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-3 text-center transition-colors",
                        active
                          ? "border-primary bg-primary/10"
                          : "border-ink/10 bg-cream hover:border-primary/40",
                      )}
                    >
                      <span className="font-display text-lg font-bold text-ink">{tier.pages}</span>
                      <span className="text-[11px] uppercase tracking-wide text-ink-soft">páginas</span>
                      <span className="text-[11px] font-semibold text-primary-dark">
                        {tier.extraPrice === 0 ? "Incluído" : `+ ${formatPrice(tier.extraPrice)}`}
                      </span>
                      {tier.savings && (
                        <span className="text-[10px] text-success">economia {formatPrice(tier.savings)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-end justify-center gap-2">
              <span className="text-sm text-ink-soft line-through">
                {formatPrice(offer.compareAtPrice + selectedTier.extraPrice)}
              </span>
              <span className="font-display text-3xl font-bold text-primary-dark">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() =>
                handleInitiateCheckout({ childName, price: totalPrice, pages: selectedTier.pages })
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
