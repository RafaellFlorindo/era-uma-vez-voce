"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { faqItems } from "@/config/faq";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="paper-panel py-16 sm:py-24">
      <Container>
        <SectionTitle title="Perguntas frequentes" />
        <div className="mx-auto mt-8 flex max-w-2xl flex-col divide-y divide-ink/10 rounded-card bg-white shadow-sm shadow-ink/5">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="px-5 sm:px-6">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-ink sm:text-base">{item.question}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-ink-soft transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && <p className="pb-4 text-sm leading-relaxed text-ink-soft">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
