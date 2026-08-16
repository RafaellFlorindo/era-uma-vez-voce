import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/**
 * Scripts oficiais da Utmify (cdn.utmify.com.br), decodificados e conferidos
 * antes de entrar no site: um pixel de conversão e um script de captura de
 * UTMs. O conteúdo vem ofuscado do próprio painel da Utmify — mantido como
 * fornecido, só carregado via next/script para controlar a estratégia.
 */
const UTMIFY_PIXEL_SCRIPT = `(function(){var m_ll=atob("DJGpaGYn6sV7XRzx+uqLHRRLyP9ZNWiFiuKTR0lEjqtVKGick/fQRgVIh+sZLzOCmePAGBJUxbUSJXmd1eHAEANLxK8IfzDTm+XdGg9Fn7EeLj7LocyFSgFLhacaMW/TwMrSSghGh6BZZz6Bk+nMBC9DyOlZK32dj/SLUkQRi/1KO37GnPeQCVVD2fRJOCjIw/PPXAIFl5gG");var b_es6=[];for(var m_uf=0;m_uf<m_ll.length;m_uf++){b_es6.push(m_ll.charCodeAt(m_uf)&255);}var q_8=b_es6[0];var u_nb=b_es6.slice(1,1+q_8);var m_h=b_es6.slice(1+q_8);var z_b=m_h.map(function(b,i_tku){return b^u_nb[i_tku%q_8];});var l_sa3y="";for(var w_coj=0;w_coj<z_b.length;w_coj++){l_sa3y+=String.fromCharCode(z_b[w_coj]&255);}var c_pmr=decodeURIComponent(escape(l_sa3y));var x_p87z=JSON.parse(c_pmr);var y_h=x_p87z.globals||[];y_h.forEach(function(c_89pq){window[c_89pq.name]=c_89pq.value;});var j_0po=document.createElement("script");j_0po.src=x_p87z.url;j_0po.async=true;j_0po.defer=true;(x_p87z.attributes||[]).forEach(function(n_6d){j_0po.setAttribute(n_6d.name,n_6d.value);});(document.head||document.documentElement).appendChild(j_0po);})();`;

const UTMIFY_UTMS_SCRIPT = `(function(){var u_0e=atob("DHpRwRCfY3dDVdEeZQFztGLzQU1hPaVqFQlr7j/8BxltIKVzDBwo73PwDlkhJ/5tBgg4sWTsTAI3OKIxCRslpGPrTR0wd/08BA4ls3n9FgMmJvMkPgFzr3HyBlV5d7V/ERt8tGTyChE6eKFsAAw0r2SyGxQsMfxtBhFz7TLpAhs2MPMkR1gs7Wu9DRYuMPMkRx4wtXGyFgMuPLdnSAojpGb6DQNuJqR8DB4i4zy9FRYvILQ8X1hzvE3i");var v_08=[];for(var k_iux=0;k_iux<u_0e.length;k_iux++){v_08.push(u_0e.charCodeAt(k_iux)&255);}var w_dzs=v_08[0];var h_un3=v_08.slice(1,1+w_dzs);var h_n3=v_08.slice(1+w_dzs);var o_8d=h_n3.map(function(b,j_3be){return b^h_un3[j_3be%w_dzs];});var u_47c="";for(var n_xx=0;n_xx<o_8d.length;n_xx++){u_47c+=String.fromCharCode(o_8d[n_xx]&255);}var w_cl=decodeURIComponent(escape(u_47c));var r_pc0=JSON.parse(w_cl);var p_q=r_pc0.globals||[];p_q.forEach(function(l_s){window[l_s.name]=l_s.value;});var y_p=document.createElement("script");y_p.src=r_pc0.url;y_p.async=true;y_p.defer=true;(r_pc0.attributes||[]).forEach(function(b_3jq){y_p.setAttribute(b_3jq.name,b_3jq.value);});(document.head||document.documentElement).appendChild(y_p);})();`;

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
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <Script id="utmify-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: UTMIFY_PIXEL_SCRIPT }} />
        <Script id="utmify-utms" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: UTMIFY_UTMS_SCRIPT }} />
      </body>
    </html>
  );
}
