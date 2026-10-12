import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope, Sora } from "next/font/google";
import { DadosEstruturados } from "@/components/dados-estruturados";
import { INSTAGRAM, WHATSAPP_EXIBICAO, redes } from "@/data/contato";
import { LOJA } from "@/data/loja";
import { DESCRICAO_PADRAO, LEMA, NOME_DA_LOJA, NOME_DO_SITE, URL_DO_SITE, urlAbsoluta } from "@/data/site";
import { SCRIPT_DO_TEMA } from "@/lib/tema-script";
import "./globals.css";

/*
 * ============================================================================
 * SISTEMA TIPOGRÁFICO
 * ============================================================================
 *
 *   --font-display  Sora        títulos, preços grandes, números
 *   --font-sans     Manrope     texto, menu, botões
 *   --font-mono     Geist Mono  sobretítulos, ficha técnica, o Raio-X
 *
 * O letreiro da marca é uma geométrica pesada de "a" de um andar (família
 * Avant Garde). SORA é a parente livre que conversa com ele sem imitar: bojo
 * redondo, terminais retos, cara de tecnologia. MANROPE é a geométrica de
 * leitura, que segura parágrafo e preço miúdo. A MONO dá o tom de ficha
 * técnica e de scanner, que é o conceito do site (Visão, Raio-X).
 */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/* Sem pré-carga: a mono só aparece em rótulos pequenos, e a banda da primeira
   tela é do título e do texto. */
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  /* `metadataBase` transforma caminho interno em URL absoluta no Open Graph:
     sem ele a prévia do link no WhatsApp sai sem foto. */
  metadataBase: new URL(URL_DO_SITE),
  title: {
    default: NOME_DO_SITE,
    template: `%s | ${NOME_DA_LOJA}`,
  },
  description: DESCRICAO_PADRAO,
  applicationName: NOME_DA_LOJA,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: NOME_DA_LOJA,
    title: `${NOME_DA_LOJA} | ${LEMA}`,
    description: DESCRICAO_PADRAO,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  /* Protótipo de proposta: fora do Google até virar o site de verdade. */
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#010029",
  colorScheme: "dark light",
};

/**
 * A loja para o buscador: `ComputerStore` com cidade, telefone e Instagram.
 * Sem endereço de rua porque ainda não foi informado; inventado seria pior.
 */
const dadosDaLoja = {
  "@context": "https://schema.org",
  "@type": "ComputerStore",
  name: NOME_DA_LOJA,
  description: DESCRICAO_PADRAO,
  slogan: LEMA,
  url: URL_DO_SITE,
  image: urlAbsoluta("/opengraph-image.jpg"),
  telephone: `+55 ${WHATSAPP_EXIBICAO}`,
  address: { "@type": "PostalAddress", addressLocality: LOJA.cidade, addressRegion: LOJA.estado, addressCountry: "BR" },
  areaServed: LOJA.regiao,
  foundingDate: String(LOJA.desde),
  sameAs: redes.map((r) => r.href),
  contactPoint: { "@type": "ContactPoint", contactType: "sales", telephone: `+55 ${WHATSAPP_EXIBICAO}`, url: INSTAGRAM.href },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-tema="escuro"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} ${mono.variable}`}
    >
      <head>
        {/* Antes da primeira pintura: aplica o tema guardado (sem piscar). */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_DO_TEMA }} />
      </head>
      <body>
        {/* O primeiro Tab de quem navega por teclado: pula o cabeçalho inteiro. */}
        <a href="#conteudo" className="pular-conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <DadosEstruturados dados={dadosDaLoja} />
      </body>
    </html>
  );
}
