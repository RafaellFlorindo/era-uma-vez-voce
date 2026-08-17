"use client";

import { useEffect, useRef } from "react";
import { Hero } from "@/components/sales/Hero";
import { DemoSection } from "@/components/sales/DemoSection";
import { MechanismSection } from "@/components/sales/MechanismSection";
import { HowItWorksSection } from "@/components/sales/HowItWorksSection";
import { PersonalizationSection } from "@/components/personalization/PersonalizationSection";
import { OfferSection } from "@/components/sales/OfferSection";
import { SocialProofSection } from "@/components/sales/SocialProofSection";
import { GuaranteeSection } from "@/components/sales/GuaranteeSection";
import { FaqSection } from "@/components/sales/FaqSection";
import { FinalCtaSection } from "@/components/sales/FinalCtaSection";
import { useStorySessionStore } from "@/store/storySession";
import { trackEvent } from "@/lib/analytics";
import { captureUtmParams } from "@/lib/utm";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const wizardRef = useRef<HTMLElement>(null);
  const childName = useStorySessionStore((s) => s.session.childName);

  useEffect(() => {
    captureUtmParams();
    trackEvent("page_view");
  }, []);

  function scrollToWizard() {
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="flex-1">
      <Hero ref={heroRef} onStart={scrollToWizard} />
      <DemoSection onStart={scrollToWizard} />
      <MechanismSection />
      <HowItWorksSection />
      <PersonalizationSection ref={wizardRef} />
      <OfferSection childName={childName} onNeedsStory={scrollToWizard} />
      <SocialProofSection />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection onStart={scrollToWizard} />
    </main>
  );
}
