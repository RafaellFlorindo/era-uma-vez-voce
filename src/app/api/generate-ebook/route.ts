import { NextRequest, NextResponse } from "next/server";
import { EbookImage, generateEbookPdf } from "@/lib/ebookPdf";
import { getImageProvider } from "@/services/image";
import { StorySession } from "@/types/story";

interface GenerateEbookBody {
  session: StorySession;
  story: {
    title: string;
    intro: string;
    pages: string[];
  };
}

/**
 * Falhar uma ilustração não pode derrubar o livro inteiro: a página sai só
 * com o texto e o restante do PDF continua sendo entregue.
 */
async function safely(work: Promise<EbookImage>): Promise<EbookImage | null> {
  try {
    return await work;
  } catch (error) {
    console.warn("[api/generate-ebook] imagem falhou:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, story } = (await request.json()) as GenerateEbookBody;
    const provider = getImageProvider();

    // Gera capa e páginas em paralelo: é a etapa lenta e cara do processo.
    const [coverImage, ...pageImages] = await Promise.all([
      safely(provider.generateCover(session)),
      ...story.pages.map((_, index) => safely(provider.generatePage(session, index))),
    ]);

    const pdfBytes = await generateEbookPdf({
      title: story.title,
      intro: story.intro,
      childName: session.childName,
      coverImage,
      pages: story.pages.map((text, index) => ({ text, image: pageImages[index] ?? null })),
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
