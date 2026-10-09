/**
 * Ícones e imagem de compartilhamento a partir da logo vetorizada.
 *
 *   node scripts/marca/gerar-icones.mjs
 *
 * Gera: src/app/icon.svg (favicon), src/app/apple-icon.png (180 px) e
 * src/app/opengraph-image.jpg (1200 × 630, a prévia do link no WhatsApp:
 * a foto da loja escurecida, o letreiro e o lema da parede).
 * O Node 24 lê o `.ts` da marca direto (tipos apagados na importação).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ANEL, INFORMATICA, LAMINA, NOME } from "../../src/data/marca.ts";

const RAIZ = path.resolve(import.meta.dirname, "../..");
const APP = path.join(RAIZ, "src/app");

// favicon: o olho amarelo num quadrado marinho de cantos redondos
const icone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="#010029"/>
  <g transform="translate(10.6 22) scale(0.92)">
    <path fill="#ECB500" d="${LAMINA}"/>
    <path fill="#ECB500" fill-rule="evenodd" d="${ANEL}"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(APP, "icon.svg"), icone);
await sharp(Buffer.from(icone)).resize(180, 180).png().toFile(path.join(APP, "apple-icon.png"));

// imagem de compartilhamento
const L = 1200;
const A = 630;
const foto = await sharp(path.join(RAIZ, "src/fotos/loja/loja-paisagem.jpg"))
  .resize(L, A, { fit: "cover", position: "right" })
  .modulate({ brightness: 0.62, saturation: 0.9 })
  .toBuffer();
const sobre = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#010029" stop-opacity="0.97"/>
      <stop offset="0.48" stop-color="#010029" stop-opacity="0.82"/>
      <stop offset="1" stop-color="#010029" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="${L}" height="${A}" fill="url(#g)"/>
  <g transform="translate(150 70) scale(1.25)">
    <path fill="#ECB500" d="${LAMINA}"/>
    <path fill="#ECB500" fill-rule="evenodd" d="${ANEL}"/>
    <path fill="#FFFFFF" fill-rule="evenodd" d="${NOME}"/>
    <path fill="#ECB500" fill-rule="evenodd" d="${INFORMATICA}"/>
  </g>
  <text x="76" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700" fill="#FFFFFF">Tecnologia com <tspan fill="#ECB500">compromisso.</tspan></text>
  <text x="78" y="530" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#C9C9E8">Notebooks, iPhone, games e assistência técnica · Tapejara/RS</text>
</svg>`;
await sharp(foto)
  .composite([{ input: Buffer.from(sobre) }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(APP, "opengraph-image.jpg"));
fs.writeFileSync(path.join(APP, "opengraph-image.alt.txt"), "Visão Sul Informática, Tapejara/RS: tecnologia com compromisso");
console.log("ícones e imagem de compartilhamento gerados");
