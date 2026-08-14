import { offer } from "@/config/offer";
import { trackEvent } from "@/lib/analytics";
import { appendUtmParams } from "@/lib/utm";

/**
 * Abstração para o início do checkout. Hoje apenas redireciona para a URL
 * configurada em `offer.ts` preservando UTMs; futuramente pode disparar
 * criação de sessão de pagamento real sem alterar os call sites.
 */
export function handleInitiateCheckout(context: Record<string, unknown> = {}) {
  trackEvent("initiate_checkout", context);

  if (!offer.checkoutUrl) {
     
    console.warn("[checkout] checkoutUrl não configurada em src/config/offer.ts");
    return;
  }

  const url = appendUtmParams(offer.checkoutUrl);
  window.location.href = url;
}
