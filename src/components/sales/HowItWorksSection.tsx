import { BookOpenCheck, Compass, PenLine } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

const steps = [
  {
    icon: PenLine,
    title: "Conte quem é seu filho",
    description: "Nome, idade, uma foto e o jeitinho dele. Leva menos de 2 minutos.",
  },
  {
    icon: Compass,
    title: "Escolha o mundo dele",
    description: "Dinossauros, espaço, magia, piratas, animais ou fundo do mar.",
  },
  {
    icon: BookOpenCheck,
    title: "Veja ele virar o protagonista",
    description: "A história nasce na hora, feita em cima do DNA do Protagonista dele.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <SectionTitle
          title="Como funciona"
          subtitle="Três perguntas rápidas e você já vê a história dele começando."
        />

        <div className="relative mx-auto mt-12 max-w-4xl">
          {/* Linha que costura os três passos no desktop. */}
          <div
            className="absolute inset-x-[16%] top-[52px] hidden border-t-2 border-dashed border-primary/25 sm:block"
            aria-hidden
          />

          <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="flex flex-col items-center text-center">
                <span className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full border border-ink/5 bg-white shadow-md shadow-ink/5">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                    <Icon className="h-8 w-8 text-primary-dark" />
                  </span>
                  <span className="absolute -right-1 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                </span>
                <p className="mt-5 font-display text-base font-semibold text-ink">{title}</p>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-ink-soft">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
