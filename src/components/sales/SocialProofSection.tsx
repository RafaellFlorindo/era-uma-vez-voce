import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

// PLACEHOLDER: substituir por depoimentos reais de clientes antes do lançamento.
const testimonialPlaceholders = [
  {
    name: "[Nome do pai/mãe]",
    text: "[Depoimento real a ser inserido aqui]",
  },
  {
    name: "[Nome do pai/mãe]",
    text: "[Depoimento real a ser inserido aqui]",
  },
  {
    name: "[Nome do pai/mãe]",
    text: "[Depoimento real a ser inserido aqui]",
  },
];

export function SocialProofSection() {
  return (
    <section className="bg-cream-dark py-14 sm:py-20">
      <Container>
        <SectionTitle title="O que os pais estão dizendo" />
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {testimonialPlaceholders.map((t, i) => (
            <div key={i} className="rounded-card bg-white p-5 shadow-sm shadow-ink/5">
              <p className="text-sm italic text-ink-soft">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold text-ink">{t.name}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
