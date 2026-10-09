import path from "node:path";
import type { NextConfig } from "next";

const emDesenvolvimento = process.env.NODE_ENV === "development";

/**
 * CABEÇALHOS DE SEGURANÇA, no mesmo desenho dos sites da Amage.
 *
 * Nada carrega de fora: script, estilo, fonte (o `next/font` serve as fontes
 * do próprio domínio), imagem e o 3D saem daqui. O WebGL não precisa de
 * exceção; `worker-src blob:` fica para o caso de algum carregador do three
 * usar worker.
 *
 * `form-action` leva os dois endereços do WhatsApp porque os formulários do
 * site (pedido, teste grátis, chamado técnico, proposta, PC gamer) enviam
 * para `/whatsapp`, que REDIRECIONA para o `wa.me`, que redireciona para o
 * `api.whatsapp.com`. O Chrome aplica o `form-action` também aos
 * redirecionamentos depois do envio: sem os dois, o pedido para no meio.
 *
 * `'unsafe-inline'` fica porque o Next serializa o estado de hidratação em
 * `<script>` inline, o tema é aplicado por um script no `<head>` (sem ele a
 * página piscaria no tema errado) e as animações usam `style={{ "--x": … }}`.
 */
const politicaDeConteudo = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${emDesenvolvimento ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${emDesenvolvimento ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://wa.me https://api.whatsapp.com",
  "frame-ancestors 'none'",
  ...(emDesenvolvimento ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const cabecalhos = [
  { key: "Content-Security-Policy", value: politicaDeConteudo },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

/* HSTS só em produção: em dev ele prenderia o localhost em https no navegador
   por dois anos, e isso não sai limpando cache. */
if (!emDesenvolvimento) {
  cabecalhos.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" });
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  /* Testar no celular pela rede local: o Next 16 bloqueia os scripts do modo
     dev quando a página é aberta por outro endereço que não o `localhost`.
     Só vale no `next dev`. */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  images: {
    formats: ["image/avif", "image/webp"],
    /* 85 só na foto da loja, que aparece em tela cheia no mergulho da
       abertura; o resto fica no padrão 75. */
    qualities: [75, 85],
  },
  turbopack: {
    // Trava a raiz aqui: sem isso o Turbopack sobe a árvore atrás de outro lockfile.
    root: path.resolve(import.meta.dirname),
  },
  async headers() {
    return [{ source: "/:caminho*", headers: cabecalhos }];
  },
};

export default nextConfig;
