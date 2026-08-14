import { StorySession } from "@/types/story";

export interface GeneratedImage {
  bytes: Uint8Array;
  mimeType: string;
}

/**
 * Contrato que qualquer provedor de imagem precisa cumprir. Trocar de
 * provedor (Pollinations grátis, OpenAI pago, etc) não deve exigir mudança
 * em quem consome, só na escolha feita em `getImageProvider()`.
 */
export interface ImageProvider {
  readonly name: string;
  generateCover(session: StorySession): Promise<GeneratedImage>;
  generatePage(session: StorySession, pageIndex: number): Promise<GeneratedImage>;
}
