import type { MetadataRoute } from "next";
import { produtos } from "@/data/produtos";
import { urlAbsoluta } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ["/", "/produtos", "/assistencia", "/monte-seu-pc", "/empresas"];
  return [
    ...paginas.map((caminho) => ({ url: urlAbsoluta(caminho), changeFrequency: "weekly" as const, priority: caminho === "/" ? 1 : 0.8 })),
    ...produtos.map((p) => ({ url: urlAbsoluta(`/produtos/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
