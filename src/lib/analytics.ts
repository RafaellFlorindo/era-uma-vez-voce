import { getStoredUtmParams } from "@/lib/utm";

export type AnalyticsEvent =
  | "page_view"
  | "hero_cta_clicked"
  | "personalization_started"
  | "child_name_completed"
  | "theme_selected"
  | "personalization_completed"
  | "preview_viewed"
  | "offer_viewed"
  | "initiate_checkout"
  | "ai_story_generation_failed"
  | "narration_requested";

export type AnalyticsPayload = Record<string, unknown>;

/**
 * Camada abstrata de tracking. Hoje só loga em desenvolvimento;
 * futuramente conectar Meta Pixel, GA4, etc. sem mudar os call sites.
 */
export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  const utm = getStoredUtmParams();
  const data = { event, ...payload, ...utm, timestamp: new Date().toISOString() };

  if (process.env.NODE_ENV !== "production") {
     
    console.log("[analytics]", data);
  }

  // TODO: encaminhar `data` para Meta Pixel (fbq) e Google Analytics (gtag) quando integrados.
}
