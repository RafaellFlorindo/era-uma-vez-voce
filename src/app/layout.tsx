import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

/**
 * Fraunces é uma serifada macia com eixo "wonk": tem a irregularidade
 * charmosa de tipografia de livro impresso, sem parecer infantilizada
 * demais para quem está comprando (o pai, não a criança).
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Um livro infantil criado do zero com o nome, o rosto e o jeito do seu filho. Ele vira o protagonista da aventura que mais ama.";

export const metadata: Metadata = {
  title: "Era Uma Vez Você | Seu filho, o herói da própria história",
  description: SITE_DESCRIPTION,
  // Sem OG tags o link compartilhado em anúncio e WhatsApp aparece cru,
  // o que derruba o clique antes mesmo da página abrir.
  openGraph: {
    title: "O dia em que seu filho descobre que o herói da história é ele",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: "Era Uma Vez Você",
  },
  twitter: {
    card: "summary_large_image",
    title: "O dia em que seu filho descobre que o herói da história é ele",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
