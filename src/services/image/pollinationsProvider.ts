import "server-only";
import { StorySession } from "@/types/story";
import { GeneratedImage, ImageProvider } from "@/services/image/types";
import { buildCoverPrompt, buildPagePrompt } from "@/services/image/prompts";

/**
 * Provedor gratuito, sem chave. Não aceita a foto da criança como
 * referência, então o personagem sai genérico. Serve para desenvolvimento
 * e validação; para produção, usar o provedor pago.
 */
function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  return hash % 1_000_000;
}

async function fetchImage(prompt: string, width: number, height: number, seed: number): Promise<GeneratedImage> {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt,
  )}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Pollinations respondeu ${response.status}.`);

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = await response.arrayBuffer();
  return { bytes: new Uint8Array(buffer), mimeType: contentType };
}

export const pollinationsImageProvider: ImageProvider = {
  name: "pollinations",

  generateCover(session: StorySession) {
    const seed = hashSeed(`${session.childName}|${session.theme}|${session.visualStyle}|cover`);
    return fetchImage(buildCoverPrompt(session), 768, 1024, seed);
  },

  generatePage(session: StorySession, pageIndex: number) {
    const seed = hashSeed(`${session.childName}|${session.theme}|${session.visualStyle}|p${pageIndex}`);
    return fetchImage(buildPagePrompt(session, pageIndex), 1024, 768, seed);
  },
};
