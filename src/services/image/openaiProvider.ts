import "server-only";
import { aiConfig } from "@/config/ai";
import { StorySession } from "@/types/story";
import { GeneratedImage, ImageProvider } from "@/services/image/types";
import {
  buildCoverPrompt,
  buildPagePrompt,
  buildPhotoReferenceInstruction,
} from "@/services/image/prompts";

const GENERATIONS_URL = "https://api.openai.com/v1/images/generations";
const EDITS_URL = "https://api.openai.com/v1/images/edits";

function requireApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY não configurada no servidor.");
  return key;
}

function decodeDataUrl(dataUrl: string): { bytes: Uint8Array; mimeType: string } | null {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], bytes: Buffer.from(match[2], "base64") };
}

async function readImageFromResponse(response: Response): Promise<GeneratedImage> {
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`OpenAI respondeu ${response.status}: ${detail.slice(0, 300)}`);
  }
  const body = (await response.json()) as { data?: { b64_json?: string }[] };
  const b64 = body.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI não retornou imagem.");
  return { bytes: Buffer.from(b64, "base64"), mimeType: "image/png" };
}

/**
 * Gera do zero, a partir apenas do texto.
 */
async function generateFromPrompt(prompt: string, size: string): Promise<GeneratedImage> {
  const response = await fetch(GENERATIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireApiKey()}`,
    },
    body: JSON.stringify({
      model: aiConfig.openaiImageModel,
      prompt,
      size,
      quality: aiConfig.openaiImageQuality,
      n: 1,
    }),
  });
  return readImageFromResponse(response);
}

/**
 * Gera usando a foto da criança como referência, para o personagem sair
 * parecido com ela. É o caminho que justifica o custo do provedor pago.
 */
async function generateFromPhoto(
  prompt: string,
  size: string,
  photoDataUrl: string,
): Promise<GeneratedImage> {
  const photo = decodeDataUrl(photoDataUrl);
  if (!photo) throw new Error("Foto da criança em formato inválido.");

  const form = new FormData();
  form.append("model", aiConfig.openaiImageModel);
  form.append("prompt", prompt);
  form.append("size", size);
  form.append("quality", aiConfig.openaiImageQuality);
  form.append("n", "1");
  form.append(
    "image",
    new Blob([new Uint8Array(photo.bytes)], { type: photo.mimeType }),
    "crianca.jpg",
  );

  const response = await fetch(EDITS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${requireApiKey()}` },
    body: form,
  });
  return readImageFromResponse(response);
}

export const openaiImageProvider: ImageProvider = {
  name: "openai",
  // A conta paga aguenta o livro inteiro de uma vez.
  maxConcurrency: 4,

  async generateCover(session: StorySession) {
    const prompt = session.photoDataUrl
      ? `${buildPhotoReferenceInstruction(session)} ${buildCoverPrompt(session)}`
      : buildCoverPrompt(session);

    return session.photoDataUrl
      ? generateFromPhoto(prompt, aiConfig.openaiCoverSize, session.photoDataUrl)
      : generateFromPrompt(prompt, aiConfig.openaiCoverSize);
  },

  async generatePage(session: StorySession, pageIndex: number) {
    const prompt = session.photoDataUrl
      ? `${buildPhotoReferenceInstruction(session)} ${buildPagePrompt(session, pageIndex)}`
      : buildPagePrompt(session, pageIndex);

    return session.photoDataUrl
      ? generateFromPhoto(prompt, aiConfig.openaiPageSize, session.photoDataUrl)
      : generateFromPrompt(prompt, aiConfig.openaiPageSize);
  },
};
