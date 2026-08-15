import { trackEvent } from "@/lib/analytics";
import { appendUtmParams } from "@/lib/utm";

/**
 * Abstração para o início do checkout. Redireciona para a URL de checkout
 * da Cakto passada pelo chamador (uma por faixa de páginas), preservando
 * UTMs.
 */
export function handleInitiateCheckout(checkoutUrl: string, context: Record<string, unknown> = {}) {
  trackEvent("initiate_checkout", context);

  if (!checkoutUrl) {
    console.warn("[checkout] checkoutUrl vazia — verifique src/config/offer.ts");
    return;
  }

  const url = appendUtmParams(checkoutUrl);
  window.location.href = url;
}
