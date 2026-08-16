import { StorySession } from "@/types/story";

export interface GeneratedStoryText {
  title: string;
  intro: string;
  pages: string[];
}

/** Chama a rota server-side que gera o texto da história via Gemini. Lança erro se falhar. */
export async function fetchAiStoryText(session: StorySession): Promise<GeneratedStoryText> {
  const response = await fetch("/api/generate-story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Falha ao gerar história (${response.status}).`);
  }

  return response.json();
}

/** Chama a rota server-side que gera a narração em áudio via Gemini TTS. Lança erro se falhar. */
export async function fetchAiNarration(text: string): Promise<string> {
  const response = await fetch("/api/generate-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Falha ao gerar narração (${response.status}).`);
  }

  const { audioDataUrl } = await response.json();
  return audioDataUrl as string;
}

/*
 * O download do e-book saiu daqui de propósito. Ele agora mora em
 * /api/orders/{token}/ebook, atrás da verificação de pagamento: a rota
 * antiga gerava o livro completo para qualquer um que soubesse chamá-la.
 */
