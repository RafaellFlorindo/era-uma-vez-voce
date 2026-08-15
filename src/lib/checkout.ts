import { trackEvent } from "@/lib/analytics";
import { appendUtmParams } from "@/lib/utm";
import { PageTier } from "@/config/offer";

interface CheckoutContext {
  childName?: string;
  [key: string]: unknown;
}

/**
 * Leva o visitante para a nossa página de checkout (com nossa marca e o
 * pagamento da Cakto embutido num iframe) em vez de sair direto para o
 * domínio deles.
 */
export function handleInitiateCheckout(tier: PageTier, context: CheckoutContext = {}) {
  trackEvent("initiate_checkout", { ...context, pages: tier.pages, price: tier.price });

  const params = new URLSearchParams({
    offer: tier.offerId,
    pages: String(tier.pages),
    price: String(tier.price),
  });
  if (context.childName) params.set("name", context.childName);

  const url = appendUtmParams(`/checkout?${params.toString()}`);
  window.location.href = url;
}
