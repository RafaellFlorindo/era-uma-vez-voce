import { NextRequest, NextResponse } from "next/server";
import { generateCharacterImage } from "@/lib/gemini";
import { StorySession } from "@/types/story";

interface GenerateImageBody {
  session: StorySession;
  /** Data URL completa da foto (ex: "data:image/jpeg;base64,...") */
  photoDataUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const { session, photoDataUrl } = (await request.json()) as GenerateImageBody;

    const match = photoDataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Foto inválida." }, { status: 400 });
    }
    const [, mimeType, base64] = match;

    const imageDataUrl = await generateCharacterImage(session, base64, mimeType);
    return NextResponse.json({ imageDataUrl });
  } catch (error) {
    console.error("[api/generate-image]", error);
    const message = error instanceof Error ? error.message : "Erro ao gerar a imagem.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
