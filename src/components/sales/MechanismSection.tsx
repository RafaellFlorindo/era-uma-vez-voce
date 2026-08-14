import { BookHeart, Camera, Heart, Sparkles, User, Wand2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

const inputs = [
  { icon: Camera, label: "Foto" },
  { icon: User, label: "Nome" },
  { icon: Sparkles, label: "Idade" },
  { icon: Heart, label: "Personalidade" },
  { icon: Wand2, label: "Mundo favorito" },
];

export function MechanismSection() {
  return (
    <section className="bg-cream-dark py-14 sm:py-20">
      <Container>
        <SectionTitle
          eyebrow="Nosso mecanismo exclusivo"
          title="Não trocamos apenas o nome dentro de uma história pronta."
          subtitle="A maioria dos livros personalizados troca o nome e pronto. O nosso monta a história inteira em cima de quem seu filho é."
        />

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center">
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
            {inputs.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-ink/5 bg-white px-3 py-5 text-center shadow-sm shadow-ink/5 transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <span className="text-xs font-semibold text-ink">{label}</span>
              </div>
            ))}
          </div>

          <Connector />

          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-accent/25 blur-xl" />
            <div className="relative rounded-full bg-secondary px-10 py-4 text-center font-display text-lg font-semibold text-white shadow-lg shadow-secondary/30 sm:text-xl">
              DNA do Protagonista
            </div>
          </div>

          <Connector />

          <div className="flex items-center gap-2.5 rounded-full border-2 border-dashed border-primary/40 bg-white px-8 py-3.5 text-center font-display text-lg font-semibold text-primary-dark sm:text-xl">
            <BookHeart className="h-5 w-5" />
            Uma história que só existe para ele
          </div>

          <p className="mt-8 max-w-xl text-center text-base leading-relaxed text-ink-soft">
            Cada detalhe que você conta muda o personagem, o mundo e o rumo da
            aventura. Duas crianças nunca recebem a mesma história.
          </p>
        </div>
      </Container>
    </section>
  );
}

function Connector() {
  return (
    <div className="flex h-10 flex-col items-center justify-center gap-1" aria-hidden>
      <span className="h-1 w-1 rounded-full bg-primary/30" />
      <span className="h-1 w-1 rounded-full bg-primary/50" />
      <span className="h-1 w-1 rounded-full bg-primary/70" />
    </div>
  );
}
