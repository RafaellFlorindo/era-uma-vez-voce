import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import {
  ChildGender,
  EMPTY_STORY_SESSION,
  PersonalityTrait,
  StorySession,
  ThemeId,
  VisualStyleId,
} from "@/types/story";

const PERSIST_DEBOUNCE_MS = 400;

/**
 * A sessão inclui a foto em base64 (pode ter centenas de KB). Escrever isso
 * inteiro no localStorage a cada tecla digitada trava a digitação — então
 * atrasamos a escrita real e só mantemos a última versão pendente.
 */
function createDebouncedStorage(): StateStorage {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return {
    getItem: (name) => localStorage.getItem(name),
    removeItem: (name) => {
      if (timeoutId) clearTimeout(timeoutId);
      localStorage.removeItem(name);
    },
    setItem: (name, value) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => localStorage.setItem(name, value), PERSIST_DEBOUNCE_MS);
    },
  };
}

interface StorySessionState {
  session: StorySession;
  setChildName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: ChildGender) => void;
  setPhoto: (dataUrl: string | undefined) => void;
  setTheme: (theme: ThemeId) => void;
  togglePersonality: (trait: PersonalityTrait) => void;
  setVisualStyle: (style: VisualStyleId) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const MAX_PERSONALITY_TRAITS = 3;

// Abstração simples sobre localStorage — trocar por persistência remota (Supabase)
// futuramente exigirá apenas substituir o `storage` do persist middleware abaixo.
export const useStorySessionStore = create<StorySessionState>()(
  persist(
    (set) => ({
      session: EMPTY_STORY_SESSION,
      setChildName: (name) =>
        set((state) => ({ session: { ...state.session, childName: name } })),
      setAge: (age) => set((state) => ({ session: { ...state.session, age } })),
      setGender: (gender) => set((state) => ({ session: { ...state.session, gender } })),
      setPhoto: (photoDataUrl) =>
        set((state) => ({ session: { ...state.session, photoDataUrl } })),
      setTheme: (theme) => set((state) => ({ session: { ...state.session, theme } })),
      togglePersonality: (trait) =>
        set((state) => {
          const current = state.session.personality;
          const exists = current.includes(trait);
          const next = exists
            ? current.filter((t) => t !== trait)
            : current.length < MAX_PERSONALITY_TRAITS
              ? [...current, trait]
              : current;
          return { session: { ...state.session, personality: next } };
        }),
      setVisualStyle: (style) =>
        set((state) => ({ session: { ...state.session, visualStyle: style } })),
      setStep: (step) => set((state) => ({ session: { ...state.session, currentStep: step } })),
      reset: () => set({ session: EMPTY_STORY_SESSION }),
    }),
    {
      name: "euv_story_session",
      storage: createJSONStorage(() => createDebouncedStorage()),
    },
  ),
);
