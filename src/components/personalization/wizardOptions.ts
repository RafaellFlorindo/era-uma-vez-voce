import { ChildGender, PersonalityTrait, ThemeId, VisualStyleId } from "@/types/story";

export const genderOptions: { id: ChildGender; label: string }[] = [
  { id: "menina", label: "Menina" },
  { id: "menino", label: "Menino" },
];

export const themeOptions: { id: ThemeId; label: string; emoji: string }[] = [
  { id: "dinossauros", label: "Dinossauros", emoji: "🦕" },
  { id: "espaco", label: "Espaço", emoji: "🚀" },
  { id: "piratas", label: "Piratas", emoji: "🏴‍☠️" },
  { id: "magia", label: "Magia", emoji: "🪄" },
  { id: "animais", label: "Animais", emoji: "🦊" },
  { id: "fundo-do-mar", label: "Fundo do Mar", emoji: "🐠" },
];

export const personalityOptions: { id: PersonalityTrait; label: string; emoji: string }[] = [
  { id: "curioso", label: "Curioso", emoji: "🔍" },
  { id: "corajoso", label: "Corajoso", emoji: "🦁" },
  { id: "engracado", label: "Engraçado", emoji: "😄" },
  { id: "carinhoso", label: "Carinhoso", emoji: "💛" },
  { id: "aventureiro", label: "Aventureiro", emoji: "🧭" },
  { id: "criativo", label: "Criativo", emoji: "🎨" },
  { id: "inteligente", label: "Inteligente", emoji: "🧠" },
  { id: "timido", label: "Tímido", emoji: "🌱" },
];

export const visualStyleOptions: { id: VisualStyleId; label: string; emoji: string }[] = [
  { id: "livro-3d", label: "Livro infantil 3D", emoji: "📘" },
  { id: "aquarela", label: "Aquarela", emoji: "🎨" },
  { id: "conto-classico", label: "Conto clássico", emoji: "📖" },
  { id: "cartoon", label: "Cartoon", emoji: "✏️" },
];

export const ageOptions = [3, 4, 5, 6, 7, 8, 9, 10];
