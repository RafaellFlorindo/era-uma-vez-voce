import { trackEvent } from "@/lib/analytics";
import { appendUtmParams, getStoredUtmParams } from "@/lib/utm";
import { caktoCheckoutUrl, PageTier } from "@/config/offer";
import { OrderStory } from "@/types/order";
import { StorySession } from "@/types/story";

interface CheckoutContext {
  childName?: string;
  [key: string]: unknown;
}

/** Onde guardamos o token do pedido para reencontrá-lo na volta do checkout. */
const ORDER_TOKEN_KEY = "euv_order_token";

export function storeOrderToken(token: string): void {
  try {
    localStorage.setItem(ORDER_TOKEN_KEY, token);
  } catch {
    /* modo privado pode bloquear: seguimos, o link do e-mail cobre o caso */
  }
}

export function readOrderToken(): string | null {
  try {
    return localStorage.getItem(ORDER_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Registra o pedido no servidor e leva o visitante ao checkout da Cakto.
 *
 * A ordem importa: o pedido precisa existir ANTES do redirecionamento,
 * senão o pagamento chega na Cakto sem nenhuma ligação com a história que
 * a pessoa acabou de montar, e não há como saber que livro entregar.
 */
export async function handleInitiateCheckout(
  tier: PageTier,
  session: StorySession,
  story: OrderStory,
  context: CheckoutContext = {},
): Promise<void> {
  trackEvent("initiate_checkout", { ...context, pages: tier.pages, price: tier.price });

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, story, pages: tier.pages, utm: getStoredUtmParams() }),
    });

    if (!response.ok) throw new Error(`Falha ao criar pedido (${response.status}).`);

    const { token, checkoutUrl } = (await response.json()) as {
      token: string;
      checkoutUrl: string;
    };

    storeOrderToken(token);
    window.location.href = appendUtmParams(checkoutUrl);
  } catch (error) {
    // Perder a venda por causa de um erro nosso é pior do que entregar um
    // pedido sem registro: manda para o checkout mesmo assim e reconcilia
    // depois pelo e-mail do comprador.
    console.error("[checkout] não foi possível registrar o pedido:", error);
    trackEvent("order_creation_failed", { message: String(error) });
    window.location.href = appendUtmParams(caktoCheckoutUrl(tier.offerId));
  }
}
