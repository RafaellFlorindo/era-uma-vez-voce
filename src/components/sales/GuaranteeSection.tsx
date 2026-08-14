import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";

// PLACEHOLDER: substituir pelo texto oficial da política de garantia/reembolso.
const guaranteeText =
  "[Inserir aqui a política oficial: prazo de satisfação, condições de reembolso e como solicitar.]";

export function GuaranteeSection() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-card bg-white p-8 text-center shadow-sm shadow-ink/5">
          <ShieldCheck className="h-9 w-9 text-success" />
          <p className="font-display text-lg font-semibold text-ink">Satisfação garantida</p>
          <p className="text-sm text-ink-soft">{guaranteeText}</p>
        </div>
      </Container>
    </section>
  );
}
