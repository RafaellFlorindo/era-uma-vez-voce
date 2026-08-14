import { StorySession } from "@/types/story";

interface ThemePrompt {
  companion: string;
  scene: string;
}

// Descrições em inglês: os modelos de imagem respondem melhor nesse idioma.
export const THEME_PROMPTS: Record<string, ThemePrompt> = {
  dinossauros: { companion: "a gentle giant dinosaur friend", scene: "a lush prehistoric valley with a waterfall" },
  espaco: { companion: "a cute friendly green alien", scene: "a colorful outer space scene with planets and stars" },
  piratas: { companion: "a colorful parrot and a treasure map", scene: "a pirate ship deck on a turquoise sea" },
  magia: { companion: "a tiny glowing fairy", scene: "an enchanted forest with magical floating lights" },
  animais: { companion: "a curious cute fox", scene: "a colorful forest full of flowers and small animals" },
  "fundo-do-mar": { companion: "a gentle sea turtle", scene: "a colorful coral reef underwater with sunlight rays" },
};

export const STYLE_PROMPTS: Record<string, string> = {
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

/** Ação da cena por posição na história, para dar progressão sem trocar o personagem. */
export const PAGE_ACTIONS = [
  "at the very start of the adventure, curiously discovering something new",
  "in the middle of an exciting moment, full of action and wonder",
  "triumphant at the end of the adventure, celebrating happily",
];

export function describeCharacter(session: StorySession): string {
  const age = session.age ?? 6;
  const gender = session.gender === "menino" ? "boy" : session.gender === "menina" ? "girl" : "child";
  const personality = PERSONALITY_WORDS[session.personality[0] ?? "curioso"];
  return `a ${personality} ${age}-year-old ${gender}`;
}

export function buildCoverPrompt(session: StorySession): string {
  const theme = THEME_PROMPTS[session.theme ?? "magia"];
  const style = STYLE_PROMPTS[session.visualStyle ?? "livro-3d"];

  return [
    describeCharacter(session),
    `standing next to ${theme.companion}`,
    `in ${theme.scene}`,
    style,
    "vertical children's book cover illustration, warm cinematic lighting, high quality, no text, no watermark",
  ].join(", ");
}

export function buildPagePrompt(session: StorySession, pageIndex: number): string {
  const theme = THEME_PROMPTS[session.theme ?? "magia"];
  const style = STYLE_PROMPTS[session.visualStyle ?? "livro-3d"];
  const action = PAGE_ACTIONS[pageIndex % PAGE_ACTIONS.length];

  return [
    describeCharacter(session),
    `with ${theme.companion}`,
    action,
    `in ${theme.scene}`,
    style,
    "children's book illustration, warm cinematic lighting, high quality, no text, no watermark",
  ].join(", ");
}

/** Instrução extra usada quando existe foto da criança para servir de referência. */
export function buildPhotoReferenceInstruction(session: StorySession): string {
  const style = STYLE_PROMPTS[session.visualStyle ?? "livro-3d"];
  return `Turn the child in this photo into a children's book character, keeping the face clearly recognizable. Style: ${style}.`;
}
