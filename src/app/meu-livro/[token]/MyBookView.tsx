"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, Download, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { trackEvent } from "@/lib/analytics";
import { support } from "@/config/offer";
import { OrderPublicView } from "@/types/order";

/** Enquanto o livro é gerado, consultamos o status neste intervalo. */
const POLL_INTERVAL_MS = 4000;

export function MyBookView({ initial }: { initial: OrderPublicView }) {
  const [order, setOrder] = useState(initial);

  const waiting = order.status === "aguardando_pagamento";
  const generating = order.status === "pago";
  const ready = order.downloadReady;
  const failed = order.status === "falhou";

  useEffect(() => {
    if (ready || order.status === "reembolsado") return;

    const id = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${order.token}`, { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as OrderPublicView;
        setOrder((current) => {
          if (next.downloadReady && !current.downloadReady) {
            trackEvent("purchase_confirmed", { title: next.title });
          }
          return next;
        });
      } catch {
        /* rede instável: a próxima rodada tenta de novo */
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [order.token, ready, order.status]);

  return (
    <main className="flex-1 py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-lg overflow-hidden rounded-card bg-white text-center shadow-[var(--shadow-lift)] ring-1 ring-cream-deep">
          <div className="relative overflow-hidden bg-secondary px-6 py-7 text-white">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-accent/25 blur-2xl" />
            <p className="relative font-display text-xl leading-snug font-semibold text-balance sm:text-2xl">
              {order.title}
            </p>
            <p className="relative mt-1 text-sm text-white/75">
              {order.pages} páginas ilustradas para {order.childName}
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {ready && <ReadyState token={order.token} childName={order.childName} />}
            {generating && <GeneratingState childName={order.childName} />}
            {waiting && <WaitingState />}
            {failed && <FailedState token={order.token} />}
            {order.status === "reembolsado" && (
              <p className="text-sm text-ink-soft">
                Este pedido foi reembolsado. Se isso não parece certo, fale com a
                gente em {support.email}.
              </p>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

function ReadyState({ token, childName }: { token: string; childName: string }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/12 ring-1 ring-success/25">
        <BookOpenCheck className="h-8 w-8 text-success" />
      </span>

      <div>
        <p className="font-display text-xl font-semibold text-ink">
          O livro {childName ? `de ${childName}` : "está pronto"}!
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Baixe o PDF e leia hoje à noite. O link fica salvo: você pode voltar
          aqui e baixar de novo quando quiser.
        </p>
      </div>

      {/* Âncora, não botão: é um download de arquivo, não navegação de app. */}
      <a
        href={`/api/orders/${token}/ebook`}
        onClick={() => trackEvent("ebook_download_requested", { token })}
        className="group/btn relative inline-flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-button bg-primary px-8 py-4.5 text-lg font-semibold text-white shadow-[var(--shadow-cta)] transition-all duration-200 ease-out hover:-translate-y-px hover:bg-primary-dark hover:shadow-[var(--shadow-cta-hover)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-dark active:translate-y-0.5"
      >
        <Download className="h-5 w-5" />
        Baixar o livro em PDF
      </a>

      <p className="text-xs text-ink-faint">Guarde este link. Ele é o acesso ao livro.</p>
    </div>
  );
}

function GeneratingState({ childName }: { childName: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-9 w-9 animate-spin text-primary" />
      <p className="font-display text-lg font-semibold text-ink">
        Pagamento confirmado. Estamos desenhando o livro.
      </p>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        As ilustrações {childName ? `de ${childName}` : "do seu filho"} estão
        sendo criadas uma a uma. Leva alguns minutos e esta página se atualiza
        sozinha quando ficar pronto.
      </p>
    </div>
  );
}

function WaitingState() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-9 w-9 animate-spin text-ink-faint" />
      <p className="font-display text-lg font-semibold text-ink">
        Aguardando a confirmação do pagamento
      </p>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        Assim que o pagamento for aprovado, o livro começa a ser gerado
        automaticamente aqui. No Pix costuma levar menos de um minuto.
      </p>
    </div>
  );
}

function FailedState({ token }: { token: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <TriangleAlert className="h-7 w-7 text-primary-dark" />
      </span>
      <p className="font-display text-lg font-semibold text-ink">
        Seu pagamento está confirmado, mas a geração falhou
      </p>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        Nada foi perdido. Tente de novo abaixo, e se continuar falhando escreva
        para {support.email} que a gente resolve na mão.
      </p>
      <a
        href={`/api/orders/${token}/ebook`}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-button border-2 border-ink/15 bg-cream/60 px-6 py-3.5 font-semibold text-ink transition-colors hover:border-primary/50 hover:bg-cream hover:text-primary-dark"
      >
        <RefreshCw className="h-4 w-4" />
        Tentar gerar de novo
      </a>
    </div>
  );
}
