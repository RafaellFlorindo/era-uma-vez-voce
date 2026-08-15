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
  /**
   * Quantas imagens este provedor aguenta em voo ao mesmo tempo.
   *
   * Existe porque o provedor gratuito responde 429 quando recebe as 4
   * imagens do livro de uma vez, e o livro saía com só uma ilustração.
   */
  readonly maxConcurrency: number;
  generateCover(session: StorySession): Promise<GeneratedImage>;
  generatePage(session: StorySession, pageIndex: number): Promise<GeneratedImage>;
}
