import { NextRequest, NextResponse } from "next/server";
import { generateStoryText } from "@/lib/gemini";
import { StorySession } from "@/types/story";

export async function POST(request: NextRequest) {
  try {
    const session = (await request.json()) as StorySession;
    const story = await generateStoryText(session);
    return NextResponse.json(story);
  } catch (error) {
    console.error("[api/generate-story]", error);
    const message = error instanceof Error ? error.message : "Erro ao gerar a história.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
