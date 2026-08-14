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

// Ações genéricas por posição na história — mantém o personagem/estilo
// consistentes entre as imagens, variando só o momento da cena.
const PAGE_ACTIONS = [
  "at the very start of the adventure, curiously discovering something new",
  "in the middle of an exciting moment, full of action and wonder",
  "triumphant at the end of the adventure, celebrating happily",
];

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 1_000_000;
}

function buildCharacterDescription(session: StorySession): { description: string; theme: ScenePrompt; style: string } {
  const name = session.childName?.trim() || "a child";
  const age = session.age ?? 6;
  const gender = session.gender === "menino" ? "boy" : session.gender === "menina" ? "girl" : "child";
  const personalityWord = PERSONALITY_WORDS[session.personality[0] ?? "curioso"];
  const theme = THEME_PROMPTS[session.theme ?? "magia"];
  const style = STYLE_PROMPTS[session.visualStyle ?? "livro-3d"];

  return {
    description: `a ${personalityWord} ${age}-year-old ${gender} character named ${name}`,
    theme,
    style,
  };
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
  const { description, theme, style } = buildCharacterDescription(session);

  const prompt = [
    description,
    `standing next to ${theme.companion}`,
    `in ${theme.scene}`,
    style,
    "vertical children's book cover illustration, warm cinematic lighting, high quality, no text, no watermark",
  ].join(", ");

  const seed = hashSeed(`${session.childName}|${session.theme}|${session.visualStyle}|cover`);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&seed=${seed}&nologo=true`;
}

/**
 * Mesma lógica da capa, mas para uma página específica da história (0, 1, 2...),
 * variando a ação da cena para dar sensação de progressão mantendo o mesmo
 * personagem, companheiro e estilo visual.
 */
export function buildPageImageUrl(session: StorySession, pageIndex: number): string {
  const { description, theme, style } = buildCharacterDescription(session);
  const action = PAGE_ACTIONS[pageIndex % PAGE_ACTIONS.length];

  const prompt = [
    description,
    `with ${theme.companion}`,
    action,
    `in ${theme.scene}`,
    style,
    "children's book illustration, warm cinematic lighting, high quality, no text, no watermark",
  ].join(", ");

  const seed = hashSeed(`${session.childName}|${session.theme}|${session.visualStyle}|page${pageIndex}`);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&seed=${seed}&nologo=true`;
}
