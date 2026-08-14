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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 p-3 backdrop-blur-sm sm:hidden">
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
    </div>
  );
}
