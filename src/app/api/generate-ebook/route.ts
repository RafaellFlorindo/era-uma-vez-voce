import { NextRequest, NextResponse } from "next/server";
import { generateEbookPdf } from "@/lib/ebookPdf";
import { buildCoverImageUrl, buildPageImageUrl } from "@/services/story/pollinationsImage";
import { StorySession } from "@/types/story";

interface GenerateEbookBody {
  session: StorySession;
  story: {
    title: string;
    intro: string;
    pages: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const { session, story } = (await request.json()) as GenerateEbookBody;

    const pdfBytes = await generateEbookPdf({
      title: story.title,
      intro: story.intro,
      childName: session.childName,
      coverImageUrl: buildCoverImageUrl(session),
      pages: story.pages.map((text, index) => ({
        text,
        imageUrl: buildPageImageUrl(session, index),
      })),
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(session.childName || "historia").toLowerCase()}-era-uma-vez-voce.pdf"`,
      },
    });
  } catch (error) {
    console.error("[api/generate-ebook]", error);
    const message = error instanceof Error ? error.message : "Erro ao gerar o e-book.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
