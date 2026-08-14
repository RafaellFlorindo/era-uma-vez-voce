import "server-only";
import { ImageProvider } from "@/services/image/types";
import { openaiImageProvider } from "@/services/image/openaiProvider";
import { pollinationsImageProvider } from "@/services/image/pollinationsProvider";

export type { GeneratedImage, ImageProvider } from "@/services/image/types";

/**
 * Escolhe o provedor de imagem conforme a variável IMAGE_PROVIDER.
 *
 * Para virar a chave para a OpenAI, basta preencher no .env.local:
 *   IMAGE_PROVIDER=openai
 *   OPENAI_API_KEY=sk-...
 *
 * Sem isso, cai no provedor gratuito, que não usa a foto da criança.
 */
export function getImageProvider(): ImageProvider {
  const configured = process.env.IMAGE_PROVIDER?.toLowerCase();

  if (configured === "openai") return openaiImageProvider;
  if (configured === "pollinations") return pollinationsImageProvider;

  // Sem configuração explícita: usa OpenAI se houver chave, senão o gratuito.
  return process.env.OPENAI_API_KEY ? openaiImageProvider : pollinationsImageProvider;
}
