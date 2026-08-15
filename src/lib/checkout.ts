import { trackEvent } from "@/lib/analytics";
import { appendUtmParams } from "@/lib/utm";
import { caktoCheckoutUrl, PageTier } from "@/config/offer";

interface CheckoutContext {
  childName?: string;
  [key: string]: unknown;
}

/**
 * Leva o visitante direto para o checkout hospedado da Cakto (fora do
 * nosso site), com as UTMs preservadas na URL.
 */
export function handleInitiateCheckout(tier: PageTier, context: CheckoutContext = {}) {
  trackEvent("initiate_checkout", { ...context, pages: tier.pages, price: tier.price });

  const url = appendUtmParams(caktoCheckoutUrl(tier.offerId));
  window.location.href = url;
}
