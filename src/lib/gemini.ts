import "server-only";
import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "@/config/ai";
import { StorySession } from "@/types/story";

const THEME_LABELS: Record<string, string> = {
  dinossauros: "dinossauros, num vale escondido cheio de dinossauros gigantes e amigáveis",
  espaco: "espaço, numa galáxia distante cheia de planetas coloridos",
  piratas: "piratas, num mar cheio de ilhas escondidas e tesouros",
  magia: "magia, numa floresta encantada",
  animais: "animais falantes, numa floresta cheia de bichos sábios",
  "fundo-do-mar": "fundo do mar, num reino submerso cheio de corais e criaturas encantadas",
};

const STYLE_LABELS: Record<string, string> = {
  "livro-3d": "ilustração 3D estilo livro infantil moderno, cores vibrantes",
  aquarela: "ilustração em aquarela, traços suaves e delicados",
  "conto-classico": "ilustração de conto clássico, estilo livro infantil vintage",
  cartoon: "ilustração cartoon, traços expressivos e contornos marcados",
};

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada no servidor.");
  return new GoogleGenAI({ apiKey });
}

function buildDnaPrompt(session: StorySession) {
  const name = session.childName?.trim() || "a criança";
  const age = session.age ?? 6;
  const gender = session.gender === "menina" ? "menina" : session.gender === "menino" ? "menino" : "criança";
  const personality = session.personality.length ? session.personality.join(", ") : "curiosa";
  const theme = THEME_LABELS[session.theme ?? "magia"];

  return `Protagonista: ${name}, ${age} anos, ${gender}, personalidade: ${personality}. Tema da aventura: ${theme}.`;
}

export interface GeneratedStory {
  title: string;
  intro: string;
  pages: string[];
}

export async function generateStoryText(session: StorySession): Promise<GeneratedStory> {
  const ai = getClient();
  const dna = buildDnaPrompt(session);

  const response = await ai.models.generateContent({
    model: aiConfig.textModel,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Você é um autor de histórias infantis encantadoras em português do Brasil. ${dna}

Escreva uma história curta em que essa criança é a protagonista e vive uma aventura mágica dentro do tema informado. A criança deve ser corajosa e a história deve ter um tom acolhedor, positivo e apropriado para a idade dela.

Responda em JSON com o formato exato:
{"title": "título curto e cativante da história", "intro": "uma frase de efeito sobre a aventura", "pages": ["texto da página 1 (2-3 frases)", "texto da página 2 (2-3 frases)", "texto da página 3 (2-3 frases)"]}`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          intro: { type: "string" },
          pages: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
        },
        required: ["title", "intro", "pages"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Resposta vazia da Gemini API ao gerar o texto da história.");
  return JSON.parse(text) as GeneratedStory;
}

export async function generateCharacterImage(
  session: StorySession,
  photoBase64: string,
  photoMimeType: string,
): Promise<string> {
  const ai = getClient();
  const dna = buildDnaPrompt(session);
  const style = STYLE_LABELS[session.visualStyle ?? "livro-3d"];

  const response = await ai.models.generateContent({
    model: aiConfig.imageModel,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: photoBase64, mimeType: photoMimeType } },
          {
            text: `Transforme a criança desta foto em um personagem de livro infantil, mantendo o rosto e a aparência reconhecíveis. ${dna} Estilo: ${style}. Gere uma ilustração de capa de livro, formato retrato, com a criança em destaque como protagonista dentro do universo do tema descrito.`,
          },
        ],
      },
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data);
  if (!imagePart?.inlineData?.data) {
    throw new Error("A Gemini API não retornou uma imagem.");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}

export async function generateNarrationAudio(text: string): Promise<string> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: aiConfig.ttsModel,
    contents: [{ role: "user", parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: aiConfig.ttsVoice } },
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const audioPart = parts.find((part) => part.inlineData?.data);
  if (!audioPart?.inlineData?.data) {
    throw new Error("A Gemini API não retornou áudio.");
  }

  const wavBase64 = pcmBase64ToWavBase64(audioPart.inlineData.data);
  return `data:audio/wav;base64,${wavBase64}`;
}

/** A TTS da Gemini retorna PCM 16-bit/24kHz cru — precisa envelopar em WAV pra tocar no <audio>. */
function pcmBase64ToWavBase64(pcmBase64: string, sampleRate = 24000, channels = 1, bitDepth = 16): string {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");
  const byteRate = (sampleRate * channels * bitDepth) / 8;
  const blockAlign = (channels * bitDepth) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]).toString("base64");
}
