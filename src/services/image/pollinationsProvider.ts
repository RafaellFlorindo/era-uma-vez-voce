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

const MAX_ATTEMPTS = 4;
const BASE_BACKOFF_MS = 2500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sem chave, a API gratuita limita por taxa e responde 429 com facilidade.
 * Insistir com espera crescente é a diferença entre um livro completo e um
 * livro com uma ilustração só.
 */
async function fetchImage(
  prompt: string,
  width: number,
  height: number,
  seed: number,
): Promise<GeneratedImage> {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt,
  )}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

  let lastStatus = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(url);

    if (response.ok) {
      const contentType = response.headers.get("content-type") ?? "image/jpeg";
      const buffer = await response.arrayBuffer();
      return { bytes: new Uint8Array(buffer), mimeType: contentType };
    }

    lastStatus = response.status;

    // 4xx que não seja 429 é erro de pedido: repetir não vai mudar nada.
    const worthRetrying = response.status === 429 || response.status >= 500;
    if (!worthRetrying || attempt === MAX_ATTEMPTS) break;

    await sleep(BASE_BACKOFF_MS * attempt);
  }

  throw new Error(`Pollinations respondeu ${lastStatus}.`);
}

export const pollinationsImageProvider: ImageProvider = {
  name: "pollinations",
  // Uma por vez: em paralelo, a API gratuita rejeita quase tudo.
  maxConcurrency: 1,

  generateCover(session: StorySession) {
    const seed = hashSeed(`${session.childName}|${session.theme}|${session.visualStyle}|cover`);
    return fetchImage(buildCoverPrompt(session), 768, 1024, seed);
  },

  generatePage(session: StorySession, pageIndex: number) {
    const seed = hashSeed(`${session.childName}|${session.theme}|${session.visualStyle}|p${pageIndex}`);
    return fetchImage(buildPagePrompt(session, pageIndex), 1024, 768, seed);
  },
};
