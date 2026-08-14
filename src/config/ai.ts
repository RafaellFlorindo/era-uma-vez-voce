/**
 * Modelos e parâmetros centralizados. Trocar de provedor ou de modelo exige
 * mexer só aqui, não nos call sites.
 */
export const aiConfig = {
  // Texto e narração (Gemini)
  textModel: "gemini-3.6-flash",
  ttsModel: "gemini-2.5-flash-preview-tts",
  ttsVoice: "Kore",

  // Imagem via Gemini (hoje sem cota no plano gratuito)
  imageModel: "gemini-2.5-flash-image",

  // Imagem via OpenAI. "medium" equilibra qualidade e custo: cerca de
  // US$ 0,04 a US$ 0,06 por imagem, contra US$ 0,17+ em "high".
  openaiImageModel: "gpt-image-1",
  openaiImageQuality: "medium",
  openaiCoverSize: "1024x1536",
  openaiPageSize: "1536x1024",
};

export const isAiConfigured = Boolean(process.env.GEMINI_API_KEY);
