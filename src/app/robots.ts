import type { MetadataRoute } from "next";
import { URL_DO_SITE } from "@/data/site";

/**
 * PROTÓTIPO: fora dos buscadores até virar o site de verdade (as páginas
 * também levam `noindex`). No dia da publicação, troque por `allow: "/"` e
 * tire o `robots` do layout raiz.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${URL_DO_SITE}/sitemap.xml`,
  };
}
