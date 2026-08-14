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

/**
 * Gera o e-book em PDF (capa + páginas com imagem e texto) e dispara o
 * download no navegador. Lança erro se a geração falhar.
 */
export async function downloadAiEbook(session: StorySession, story: GeneratedStoryText): Promise<void> {
  const response = await fetch("/api/generate-ebook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session, story }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Falha ao gerar e-book (${response.status}).`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(session.childName || "historia").toLowerCase()}-era-uma-vez-voce.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
