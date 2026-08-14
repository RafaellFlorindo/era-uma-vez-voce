import { NextRequest, NextResponse } from "next/server";
import { generateNarrationAudio } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { text } = (await request.json()) as { text: string };
    if (!text?.trim()) {
      return NextResponse.json({ error: "Texto vazio." }, { status: 400 });
    }
    const audioDataUrl = await generateNarrationAudio(text);
    return NextResponse.json({ audioDataUrl });
  } catch (error) {
    console.error("[api/generate-audio]", error);
    const message = error instanceof Error ? error.message : "Erro ao gerar a narração.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
