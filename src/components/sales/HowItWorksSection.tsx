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

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="relative flex flex-col items-center rounded-card bg-white p-6 text-center shadow-sm shadow-ink/5"
            >
              <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                <Icon className="h-7 w-7 text-primary-dark" />
              </span>
              <p className="mt-4 font-display text-base font-semibold text-ink">{title}</p>
              <p className="mt-2 text-sm text-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
