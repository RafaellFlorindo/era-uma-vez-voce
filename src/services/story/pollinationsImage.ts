import { StorySession } from "@/types/story";

interface ScenePrompt {
  companion: string;
  scene: string;
}

// Descrições em inglês (modelos de imagem respondem melhor nesse idioma),
// reaproveitando o mesmo universo por trás de cada tema no restante do app.
const THEME_PROMPTS: Record<string, ScenePrompt> = {
  dinossauros: { companion: "a gentle giant dinosaur friend", scene: "a lush prehistoric valley with a waterfall" },
  espaco: { companion: "a cute friendly green alien", scene: "a colorful outer space scene with planets and stars" },
  piratas: { companion: "a colorful parrot and a treasure map", scene: "a pirate ship deck on a turquoise sea" },
  magia: { companion: "a tiny glowing fairy", scene: "an enchanted forest with magical floating lights" },
  animais: { companion: "a curious cute fox", scene: "a colorful forest full of flowers and small animals" },
  "fundo-do-mar": { companion: "a gentle sea turtle", scene: "a colorful coral reef underwater with sunlight rays" },
};

const STYLE_PROMPTS: Record<string, string> = {
  "livro-3d": "3D Pixar Disney style, vibrant rendering",
  aquarela: "soft watercolor illustration style, delicate brush strokes",
  "conto-classico": "classic vintage storybook illustration style",
  cartoon: "bold cartoon illustration style, expressive linework",
};

const PERSONALITY_WORDS: Record<string, string> = {
  curioso: "curious",
  corajoso: "brave",
  engracado: "funny",
  carinhoso: "warm-hearted",
  aventureiro: "adventurous",
  criativo: "creative",
  inteligente: "clever",
  timido: "gentle",
};

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 1_000_000;
}

/**
 * Gera a URL de uma imagem via Pollinations.ai (API pública, gratuita, sem
 * chave). O navegador carrega a URL como uma <img> normal — a geração
 * acontece no primeiro request. Não usa a foto enviada (a API não aceita
 * imagem de referência no endpoint gratuito), então o personagem é genérico,
 * não idêntico à criança — serve para validar o pipeline até definirmos o
 * provedor final com preservação de identidade.
 */
export function buildCoverImageUrl(session: StorySession): string {
  const name = session.childName?.trim() || "a child";
  const age = session.age ?? 6;
  const gender = session.gender === "menino" ? "boy" : session.gender === "menina" ? "girl" : "child";
  const personalityWord = PERSONALITY_WORDS[session.personality[0] ?? "curioso"];
  const theme = THEME_PROMPTS[session.theme ?? "magia"];
  const style = STYLE_PROMPTS[session.visualStyle ?? "livro-3d"];

  const prompt = [
    `a ${personalityWord} ${age}-year-old ${gender} character named ${name}`,
    `standing next to ${theme.companion}`,
    `in ${theme.scene}`,
    style,
    "vertical children's book cover illustration, warm cinematic lighting, high quality, no text, no watermark",
  ].join(", ");

  const seed = hashSeed(`${name}|${session.theme}|${session.visualStyle}`);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&seed=${seed}&nologo=true`;
}
