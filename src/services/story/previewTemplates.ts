import { ThemeId } from "@/types/story";

/**
 * Imagens genéricas pré-geradas (uma vez, sem custo por visitante), usadas
 * na prévia gratuita antes da compra. Sempre as mesmas para um dado tema —
 * evita gastar API paga em leads que ainda não converteram. A ilustração
 * personalizada de verdade (com o rosto da criança) só é gerada depois da
 * compra confirmada, usando a foto real via API paga.
 */
export function getTemplateCoverUrl(theme: ThemeId = "magia"): string {
  return `/preview-templates/${theme}/cover.jpg`;
}

export function getTemplatePageUrl(theme: ThemeId = "magia", pageIndex: number): string {
  const page = (pageIndex % 3) + 1;
  return `/preview-templates/${theme}/page-${page}.jpg`;
}
