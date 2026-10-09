/**
 * Trata as imagens do levantamento e gera o que o site usa.
 *
 *   node scripts/preparar-imagens.mjs
 *
 * PRODUTOS: lê `referencias/produtos/originais/<slug>.{png,webp,jpg,jpeg}`
 * (fotos oficiais dos fabricantes, buscadas em 09/10/2026 para o protótipo),
 * apara a borda vazia, centraliza num quadrado de 1200 px com folga igual
 * para todas e grava `src/fotos/produtos/<slug>.webp`. No fim reescreve
 * `src/data/fotos-de-produto.ts` com um import estático por foto, que é o que
 * dá ao `next/image` o tamanho e o borrão de carregamento.
 *
 * LOJA: recorta a foto que o Vitor tirou em 09/10/2026
 * (`referencias/loja/loja-interior-2026-10-09.jpg`, 1200 × 1600) em três
 * enquadramentos: paisagem (tela cheia do mergulho), retrato (cartão) e o
 * letreiro aceso. A mesa da frente ainda tinha caixas abertas ("ainda não
 * está tudo montado"), por isso os recortes param antes dela.
 *
 * É repetível: roda de novo quando chegar foto nova, e só o que mudou muda.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAIZ = path.resolve(import.meta.dirname, "..");
const ORIGINAIS = path.join(RAIZ, "referencias/produtos/originais");
const DESTINO_PRODUTOS = path.join(RAIZ, "src/fotos/produtos");
const DESTINO_LOJA = path.join(RAIZ, "src/fotos/loja");
const MAPA = path.join(RAIZ, "src/data/fotos-de-produto.ts");
const FOTO_DA_LOJA = path.join(RAIZ, "referencias/loja/loja-interior-2026-10-09.jpg");

const LADO = 1200;
const FOLGA = 0.1;

/*
 * FUNDO BRANCO VIRA TRANSPARENTE. No tema escuro o produto flutua sobre o
 * marinho; um quadrado branco atrás dele quebraria a vitrine. Do lado de fora
 * para dentro, todo pixel quase branco ligado à borda vira fundo (flood fill);
 * a borda ganha meio pixel de suavização e a cor é "descontaminada" do branco
 * (sem halo claro em volta do produto no fundo escuro).
 *
 * Exceção: produto que é branco por si (o Deco é uma torre branca). Ali o
 * preenchimento comeria o próprio produto; ele fica com o fundo e a tela
 * mostra a foto num cartão claro.
 */
const MANTER_FUNDO = new Set(["tp-link-deco-m4", "chromecast-google-tv", "epson-ecotank-l3250"]);
const QUASE_BRANCO = 238;

/*
 * SOMBRA DE ESTÚDIO: algumas fotos têm uma sombra ou reflexo cinza-claro
 * debaixo do produto. No fundo escuro ela vira uma mancha branca. Nestas, o
 * cinza neutro ligado ao fundo vira sombra preta translúcida (a mesma sombra,
 * agora certa nos dois temas). Só nas listadas: em produto prateado o cinza
 * claro é o próprio produto.
 */
const SOMBRA_SUAVE = new Set(["echo-dot-5", "echo-show-5", "dualsense-preto", "garmin-tt25"]);

async function tirarFundoBranco(buffer, slug) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const fundo = new Uint8Array(w * h);
  const fila = new Int32Array(w * h);
  let ini = 0, fim = 0;
  const claro = (i) => data[i * 4] >= QUASE_BRANCO && data[i * 4 + 1] >= QUASE_BRANCO && data[i * 4 + 2] >= QUASE_BRANCO;
  const semear = (i) => {
    if (!fundo[i] && claro(i)) {
      fundo[i] = 1;
      fila[fim++] = i;
    }
  };
  for (let x = 0; x < w; x++) { semear(x); semear((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { semear(y * w); semear(y * w + w - 1); }
  const espalhar = (podeEntrar, marca) => {
    while (ini < fim) {
      const i = fila[ini++], x = i % w, y = (i - x) / w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (j >= 0 && !fundo[j] && podeEntrar(j)) {
          fundo[j] = marca;
          fila[fim++] = j;
        }
      }
    }
  };
  espalhar(claro, 1);

  // Branco fechado por dentro do produto (o miolo da coleira, o vão de uma alça):
  // mancha quase branca grande e sem saída para a borda também é fundo.
  const minimo = Math.round(w * h * 0.003);
  const visitado = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (fundo[i] || visitado[i] || !claro(i)) continue;
    const mancha = [i];
    visitado[i] = 1;
    for (let k = 0; k < mancha.length; k++) {
      const p = mancha[k], x = p % w, y = (p - x) / w;
      for (const j of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1]) {
        if (j >= 0 && !visitado[j] && claro(j)) {
          visitado[j] = 1;
          mancha.push(j);
        }
      }
    }
    if (mancha.length >= minimo) for (const p of mancha) fundo[p] = 1;
  }

  // Sombra cinza neutra ligada ao fundo (só nos produtos de SOMBRA_SUAVE).
  const sombra = new Float32Array(w * h);
  if (SOMBRA_SUAVE.has(slug)) {
    const luz = (j) => (data[j * 4] + data[j * 4 + 1] + data[j * 4 + 2]) / 3;
    const neutro = (j) => Math.max(data[j * 4], data[j * 4 + 1], data[j * 4 + 2]) - Math.min(data[j * 4], data[j * 4 + 1], data[j * 4 + 2]) < 14;
    ini = 0;
    fim = 0;
    for (let i = 0; i < w * h; i++) if (fundo[i] === 1) fila[fim++] = i;
    espalhar((j) => neutro(j) && luz(j) >= 175, 2);
    for (let i = 0; i < w * h; i++) if (fundo[i] === 2) sombra[i] = Math.min(0.55, ((255 - luz(i)) / 255) * 1.6);
  }

  // máscara suave: 1 = produto
  const mascara = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) mascara[i] = fundo[i] ? 0 : 255;
  // `extractChannel(0)`: sem ele o sharp devolve a máscara em 3 canais e a leitura sai listrada
  const suave = await sharp(mascara, { raw: { width: w, height: h, channels: 1 } }).blur(0.7).extractChannel(0).raw().toBuffer();
  for (let i = 0; i < w * h; i++) {
    if (fundo[i] === 2) {
      // sombra: preto translúcido
      data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 0;
      data[i * 4 + 3] = Math.round(sombra[i] * 255);
      continue;
    }
    const a = suave[i] / 255;
    if (a > 0 && a < 1) {
      // tira a parte do branco que vazou no pixel de borda
      for (let c = 0; c < 3; c++) data[i * 4 + c] = Math.max(0, Math.min(255, Math.round((data[i * 4 + c] - (1 - a) * 255) / a)));
    }
    data[i * 4 + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

fs.mkdirSync(DESTINO_PRODUTOS, { recursive: true });
fs.mkdirSync(DESTINO_LOJA, { recursive: true });

async function tratarProduto(arquivo) {
  const slug = path.basename(arquivo).replace(/\.(png|webp|jpe?g|avif)$/i, "");
  const original = await sharp(path.join(ORIGINAIS, arquivo), { limitInputPixels: false }).rotate().toBuffer();
  const meta = await sharp(original).metadata();
  let temAlfa = Boolean(meta.hasAlpha);
  let base = original;
  if (!temAlfa && !MANTER_FUNDO.has(slug)) {
    base = await tirarFundoBranco(original, slug);
    temAlfa = true;
  }
  const aparada = await sharp(base).trim({ threshold: temAlfa ? 1 : 12 }).toBuffer({ resolveWithObject: true });
  const util = Math.round(LADO * (1 - FOLGA * 2));
  const fundo = temAlfa ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 };
  const miolo = await sharp(aparada.data).resize(util, util, { fit: "inside", withoutEnlargement: false }).toBuffer();
  const { width = util, height = util } = await sharp(miolo).metadata();
  const saida = path.join(DESTINO_PRODUTOS, `${slug}.webp`);
  await sharp({ create: { width: LADO, height: LADO, channels: 4, background: fundo } })
    .composite([{ input: miolo, left: Math.round((LADO - width) / 2), top: Math.round((LADO - height) / 2) }])
    .webp({ quality: 86, alphaQuality: 90, effort: 5 })
    .toFile(saida);
  return { slug, temAlfa };
}

async function tratarLoja() {
  if (!fs.existsSync(FOTO_DA_LOJA)) return console.log("foto da loja ausente, pulando");
  const recortes = {
    // tela cheia do mergulho: prateleiras à esquerda, letreiro aceso à direita
    "loja-paisagem.jpg": { left: 0, top: 170, width: 1200, height: 760 },
    // cartão em pé: do teto até antes da mesa com caixas
    "loja-retrato.jpg": { left: 0, top: 0, width: 1200, height: 1240 },
    // o letreiro aceso com a frase da parede
    "loja-letreiro.jpg": { left: 640, top: 470, width: 480, height: 360 },
  };
  for (const [nome, area] of Object.entries(recortes)) {
    await sharp(FOTO_DA_LOJA).extract(area).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(DESTINO_LOJA, nome));
  }
  console.log("loja: 3 recortes");
}

// "<slug>-2.ext" é o segundo ângulo de um produto, e fica de fora; mas o slug pode
// terminar em "-2" por si (hyperx-cloud-stinger-2): só é segundo ângulo se existir o primeiro.
const todos = fs.existsSync(ORIGINAIS) ? fs.readdirSync(ORIGINAIS).filter((a) => /\.(png|webp|jpe?g|avif)$/i.test(a)) : [];
const radicais = new Set(todos.map((a) => a.replace(/\.\w+$/, "")));
const arquivos = todos.filter((a) => {
  const radical = a.replace(/\.\w+$/, "");
  return !(radical.endsWith("-2") && radicais.has(radical.slice(0, -2)));
});
const tratados = [];
for (const arquivo of arquivos.sort()) {
  try {
    tratados.push(await tratarProduto(arquivo));
  } catch (erro) {
    console.log("falhou", arquivo, String(erro).slice(0, 120));
  }
}

const nomeDoImport = (slug) => "foto_" + slug.replace(/[^a-z0-9]/gi, "_");
const mapa = `/**
 * GERADO por \`scripts/preparar-imagens.mjs\`. Não edite à mão: rode o script.
 *
 * Um import estático por foto de produto (tamanho e borrão automáticos no
 * \`next/image\`). Produto sem foto aqui aparece com o desenho da categoria.
 */
import type { StaticImageData } from "next/image";
${tratados.map(({ slug }) => `import ${nomeDoImport(slug)} from "@/fotos/produtos/${slug}.webp";`).join("\n")}

export const fotosDeProduto: Record<string, StaticImageData> = {
${tratados.map(({ slug }) => `  "${slug}": ${nomeDoImport(slug)},`).join("\n")}
};

/** Fotos com fundo transparente de origem (as outras vieram em fundo branco). */
export const fotosComFundoTransparente = new Set<string>([${tratados.filter((t) => t.temAlfa).map((t) => `"${t.slug}"`).join(", ")}]);
`;
fs.writeFileSync(MAPA, mapa);
await tratarLoja();

/*
 * INSTAGRAM: seis posts da própria loja para a faixa "acompanhe no Instagram"
 * (entrega do PS5, notebook entregue, a pasta térmica da manutenção e três
 * artes de produto). O post da atleta patrocinada fica de fora: é a foto de
 * uma criança, publicada por outra conta.
 */
const POSTS = { "post-07": "entrega-ps5", "post-09": "pasta-termica", "post-08": "notebook-entregue", "post-03": "hp-victus", "post-06": "jbl-boombox", "post-05": "xiaomi-s20" };
const origemInstagram = path.join(RAIZ, "referencias/instagram");
if (fs.existsSync(origemInstagram)) {
  const destino = path.join(RAIZ, "src/fotos/instagram");
  fs.mkdirSync(destino, { recursive: true });
  for (const [post, nome] of Object.entries(POSTS)) {
    const arquivo = path.join(origemInstagram, `${post}.jpg`);
    if (fs.existsSync(arquivo)) await sharp(arquivo).resize(640, 640, { fit: "cover" }).webp({ quality: 80 }).toFile(path.join(destino, `${nome}.webp`));
  }
  console.log(`instagram: ${Object.keys(POSTS).length} posts`);
}
console.log(`produtos: ${tratados.length} fotos (${tratados.filter((t) => t.temAlfa).length} com fundo transparente)`);
