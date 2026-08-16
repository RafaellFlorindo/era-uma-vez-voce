"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

interface StickyMobileCtaProps {
  heroRef: React.RefObject<HTMLElement | null>;
  wizardRef: React.RefObject<HTMLElement | null>;
  onClick: () => void;
}

export function StickyMobileCta({ heroRef, wizardRef, onClick }: StickyMobileCtaProps) {
  const [pastHero, setPastHero] = useState(false);
  const [insideWizard, setInsideWizard] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setPastHero(heroBottom < 0);

      const wizardEl = wizardRef.current;
      if (wizardEl) {
        const rect = wizardEl.getBoundingClientRect();
        setInsideWizard(rect.top < window.innerHeight * 0.6 && rect.bottom > 100);
      }
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef, wizardRef]);

  if (!pastHero || insideWizard) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-deep bg-cream/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(46,36,24,0.25)] backdrop-blur-md sm:hidden">
      <Button
        size="md"
        className="w-full"
        onClick={() => {
          trackEvent("hero_cta_clicked", { location: "sticky_mobile" });
          onClick();
        }}
      >
        Criar minha história
      </Button>
      <p className="mt-1.5 text-center text-[11px] text-ink-faint">
        Grátis para ver a prévia. Leva 2 minutos.
      </p>
    </div>
  );
}
