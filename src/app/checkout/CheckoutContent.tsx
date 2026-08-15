"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Headphones, Lock, Sparkles, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { caktoCheckoutUrl, formatPrice } from "@/config/offer";

export function CheckoutContent() {
  const params = useSearchParams();

  const offerId = params.get("offer") ?? "";
  const childName = params.get("name") ?? "";
  const pages = params.get("pages");
  const priceParam = params.get("price");
  const price = priceParam ? Number(priceParam) : null;

  const headline = childName
    ? `Só faltam alguns dados para a história de ${childName} começar`
    : "Só faltam alguns dados para a história começar";

  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <header className="border-b border-ink/10 bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <span className="font-display text-base font-semibold text-ink">Era Uma Vez Você</span>
          <span className="w-16" aria-hidden />
        </Container>
      </header>

      <div className="border-b border-primary/10 bg-primary/5 py-2.5">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs font-medium text-primary-dark">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Pagamento 100% seguro e criptografado
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Acesso imediato após a confirmação
            </span>
            <span className="flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5" />
              Suporte se precisar de ajuda
            </span>
          </div>
        </Container>
      </div>

      <Container className="flex flex-1 flex-col py-8 sm:py-10">
        <div className="mx-auto mb-6 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-dark">
            <Sparkles className="h-3.5 w-3.5" />
            Última etapa
          </span>
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {headline}
          </h1>
          {pages && price !== null && (
            <p className="mt-3 text-sm text-ink-soft">
              Livro com {pages} páginas por{" "}
              <span className="font-semibold text-primary-dark">{formatPrice(price)}</span> — pagamento único,
              o livro é seu para sempre.
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-xl overflow-hidden rounded-card bg-white shadow-xl shadow-ink/10">
          {offerId ? (
            <iframe
              key={offerId}
              src={caktoCheckoutUrl(offerId)}
              title="Finalizar pagamento"
              className="h-[1250px] w-full border-0 sm:h-[1150px]"
              allow="payment"
            />
          ) : (
            <p className="p-8 text-center text-sm text-ink-soft">
              Oferta não encontrada. Volte e escolha o tamanho do livro novamente.
            </p>
          )}
        </div>

        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-ink-soft/70">
          Pagamento processado com segurança pela Cakto. Seus dados de cartão nunca passam pelos
          nossos servidores.
        </p>
      </Container>
    </main>
  );
}
