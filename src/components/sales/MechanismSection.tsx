import { Camera, Heart, Sparkles, User, Wand2 } from "lucide-react";
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

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-6">
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
            {inputs.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-card bg-white p-4 text-center shadow-sm shadow-ink/5"
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-ink-soft">{label}</span>
              </div>
            ))}
          </div>

          <div className="h-8 w-0.5 bg-ink/15" />

          <div className="rounded-card bg-secondary px-8 py-4 text-center font-display text-lg font-semibold text-white shadow-lg shadow-secondary/25 sm:text-xl">
            DNA do Protagonista
          </div>

          <div className="h-8 w-0.5 bg-ink/15" />

          <div className="rounded-card border-2 border-dashed border-primary/40 bg-white px-8 py-4 text-center font-display text-lg font-semibold text-primary-dark sm:text-xl">
            História única
          </div>

          <p className="mt-4 max-w-xl text-center text-base text-ink-soft">
            Cada detalhe que você conta muda o personagem, o mundo e o rumo da
            aventura. Duas crianças nunca recebem a mesma história.
          </p>
        </div>
      </Container>
    </section>
  );
}
