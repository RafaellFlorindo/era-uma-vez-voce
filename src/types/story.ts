export type ThemeId =
  | "dinossauros"
  | "espaco"
  | "piratas"
  | "magia"
  | "animais"
  | "fundo-do-mar";

export type PersonalityTrait =
  | "curioso"
  | "corajoso"
  | "engracado"
  | "carinhoso"
  | "aventureiro"
  | "criativo"
  | "inteligente"
  | "timido";

export type VisualStyleId =
  | "livro-3d"
  | "aquarela"
  | "conto-classico"
  | "cartoon";

export type ChildGender = "menina" | "menino";

export interface StorySession {
  childName: string;
  age?: number;
  gender?: ChildGender;
  /** Data URL (base64) da foto enviada pelos pais, já comprimida no cliente. */
  photoDataUrl?: string;
  theme?: ThemeId;
  personality: PersonalityTrait[];
  visualStyle?: VisualStyleId;
  currentStep: number;
}

export interface StoryPreview {
  title: string;
  intro: string;
  coverUrl: string;
  /** As 3 primeiras páginas da história, desbloqueadas no preview gratuito. */
  pages: string[];
}

/** Prévia parcial, construída incrementalmente durante o wizard. */
export interface LivePreview {
  title: string;
  coverUrl: string;
  snippet: string;
  ready: boolean;
}

export const EMPTY_STORY_SESSION: StorySession = {
  childName: "",
  personality: [],
  currentStep: 1,
};
