import { RotateCcw, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { support } from "@/config/offer";

export function GuaranteeSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal className="relative mx-auto max-w-xl overflow-hidden rounded-card bg-white p-8 text-center shadow-[var(--shadow-card)] ring-1 ring-cream-deep sm:p-10">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-success/12 blur-3xl" />

          <div className="relative flex flex-col items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/12 ring-1 ring-success/25">
              <ShieldCheck className="h-8 w-8 text-success" />
            </span>

            <div>
              <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
                7 dias de garantia, sem perguntas
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                Se o livro não for o que você imaginou, escreva para{" "}
                <a
                  href={`mailto:${support.email}`}
                  className="font-semibold text-primary-dark underline underline-offset-2"
                >
                  {support.email}
                </a>{" "}
                em até 7 dias após a compra e devolvemos 100% do valor. Você fica
                com o livro do mesmo jeito.
              </p>
            </div>

            <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint">
              <RotateCcw className="h-3.5 w-3.5" />
              Reembolso processado em até 5 dias úteis
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
