"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { readOrderToken } from "@/lib/checkout";
import { support } from "@/config/offer";

/**
 * Ponte entre o checkout da Cakto e o livro.
 *
 * É esta URL que deve ser configurada no painel da Cakto como página de
 * obrigado. Ela recupera o token que guardamos antes do redirecionamento e
 * manda a pessoa para o livro dela.
 */
/** localStorage é uma fonte externa: `useSyncExternalStore` é a forma que o
 * React oferece para lê-la sem cascatear render dentro de um efeito.
 * No servidor devolve `undefined`, que a página trata como "ainda apurando"
 * e renderiza como carregando. */
const NO_SUBSCRIPTION = () => () => {};

export default function ObrigadoPage() {
  const token = useSyncExternalStore(
    NO_SUBSCRIPTION,
    readOrderToken,
    () => undefined,
  );

  useEffect(() => {
    if (token) window.location.replace(`/meu-livro/${token}`);
  }, [token]);

  return (
    <main className="flex-1 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-md rounded-card bg-white p-8 text-center shadow-[var(--shadow-card)] ring-1 ring-cream-deep sm:p-10">
          {token === undefined || token ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="font-display text-lg font-semibold text-ink">
                Obrigado! Levando você até o livro...
              </p>
            </div>
          ) : (
            // Sem token: comprou em outro navegador, ou o armazenamento foi
            // limpo. O link do livro também vai por e-mail, então esse é o
            // caminho de recuperação.
            <div className="flex flex-col items-center gap-4">
              <p className="font-display text-lg font-semibold text-ink">
                Pagamento recebido, obrigado!
              </p>
              <p className="text-sm leading-relaxed text-ink-soft">
                Não encontramos o pedido neste navegador. Isso acontece quando a
                compra foi feita em outro aparelho. Escreva para{" "}
                <a
                  href={`mailto:${support.email}`}
                  className="font-semibold text-primary-dark underline underline-offset-2"
                >
                  {support.email}
                </a>{" "}
                com o e-mail usado na compra que a gente envia o link do livro.
              </p>
              <Link href="/">
                <Button variant="outline">Voltar para o início</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
