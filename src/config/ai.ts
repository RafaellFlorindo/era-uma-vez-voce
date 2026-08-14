/**
 * Nomes de modelo centralizados — trocar de provedor/modelo no futuro exige
 * mexer só aqui, não nos call sites.
 */
export const aiConfig = {
  textModel: "gemini-3.6-flash",
  imageModel: "gemini-2.5-flash-image",
  ttsModel: "gemini-2.5-flash-preview-tts",
  ttsVoice: "Kore",
};

export const isAiConfigured = Boolean(process.env.GEMINI_API_KEY);
