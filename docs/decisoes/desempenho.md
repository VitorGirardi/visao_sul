# Desempenho

Em 09/10/2026 o Vitor abriu o protótipo e achou "muito travado desde que
abri". A rodada de otimização foi de 09 a 12/10/2026. Todas as medições são
do notebook dele (Intel UHD, tela de 144 Hz), com Chrome headless usando a
GPU de verdade (ANGLE D3D11) e o build de produção.

## Antes e depois (12/10/2026)

Mesma ferramenta, mesma máquina, uma versão logo depois da outra. "Antes" é
o commit `4e82a94` (o protótipo como estava no GitHub); "depois" é o commit
desta rodada.

Fps é quantos quadros a página entrega. 144 numa tela de 144 Hz quer dizer
que a thread principal está livre em todo quadro (o 3D em si desenha a 60).
"Travados" são quadros acima de 33 ms.

### Computador (1440 × 900, média de duas rodadas)

| trecho | antes | depois |
| --- | --- | --- |
| carregamento (7 s) | 6 tarefas longas, 1,6 s no total, a maior de 0,64 s | 3 tarefas longas, 0,4 s, a maior de 0,18 s |
| abertura parada | 72 fps, p95 21 ms | 144 fps, p95 7 ms |
| mouse na abertura | 71 fps | 144 fps |
| mergulho | 68 fps, p95 28 ms | 97 fps, p95 14 a 21 ms |
| Raio-X | 64 fps, 2 tarefas longas de ~1 s | 122 fps, nenhuma |
| vitrine | 124 fps | 138 fps |

### Celular (390 × 844, CPU 4 vezes mais lenta)

| trecho | antes | depois |
| --- | --- | --- |
| carregamento (7 s) | 16 tarefas longas, 3,4 s, a maior de 0,83 s | 8 tarefas longas, 1,0 s, a maior de 0,23 s |
| abertura parada | 35 fps, 32% travados | 144 fps, 0% |
| mergulho | 31 fps, 38% travados | 53 fps, 7% |
| chegada ao Raio-X | 28 fps, 26% travados | 94 fps, 4% |
| Raio-X | 36 fps, 31% travados | 93 fps, 1% |
| vitrine | 45 fps, 10% travados | 112 fps, 1% |

### Peso e primeira pintura

| | antes | depois |
| --- | --- | --- |
| home: JS até o load | 246 KB | 165 KB |
| home: JS com o 3D, depois de 7 s | 535 KB | 404 KB |
| home: HTML | 62 KB | 47 KB |
| home: prefetch | 40 a 58 KB | 21 a 38 KB |
| home: LCP no celular | 2,5 s | 1,1 s |
| home: LCP no computador | 1,6 s | 0,5 s |
| /produtos: cartões no HTML | 0 | 26 |
| /produtos: JS até o load | 244 KB | 160 KB |

## O que foi feito, e por quê

### 3D

- **Materiais matcap** (`components/tres/matcap.ts`) no lugar de material
  físico, luzes e `<Environment>`. Cada shader levava centenas de ms para
  compilar na UHD, e cada quadro pesava. Sem tone mapping (`<Canvas flat>`):
  o ACES desbotava o ouro.
- **Shaders compilados antes do primeiro quadro**, com `compileAsync` e a
  cena escondida até lá. O notebook do Raio-X ainda sobe uma textura por
  quadro. Antes, a chegada ao Raio-X travava 5 s na UHD.
- **No máximo 60 quadros por segundo** (`lib/sessenta-quadros.ts`). Com
  `frameloop="always"`, o R3F desenhava 144 vezes por segundo na tela do
  Vitor. `dpr` no máximo 1,5.
- **Olho em three puro** (`components/tres/olho-3d.tsx`), sem o R3F: é a
  primeira cena, e o reconciliador do React pesava em quem acabou de chegar.
- **A etiqueta do Raio-X** virou elemento comum, posto no lugar a cada
  quadro. O `<Html>` do drei criava uma raiz React por etapa.

### Rolagem

- **Sem Lenis**: rolagem por JS trava junto com a página.
- **Sem GSAP**: as cenas presas (abertura, Raio-X, vitrine) são
  `position: sticky` dentro de um percurso mais alto, e
  `lib/rolagem-presa.ts` lê o progresso, alisado. O `pin` refazia o layout
  da página inteira na entrada e na saída de cada cena, e quebrava o React
  ao trocar de página ("removeChild"). Também saíram 44 KB gz.
- **O portal da abertura** só é escrito no CSS quando muda meio pixel. Os
  valores padrão batem com o furo do SVG, então a foto da loja aparece sem
  esperar o 3D.
- **O céu do Raio-X** é estático, com o brilho numa camada que só muda
  `opacity`. Ele repintava a tela inteira a cada quadro.

### CSS

- **Sem `backdrop-filter`, `mix-blend-mode` e `filter: drop-shadow`** em
  elemento grande ou repetido.
- **Raio-X do cartão em `opacity` e `translate`.** A chapa aparece pela janela
  que desce e pelo filme que sobe na mesma medida. Antes era uma variável
  registrada animada: o cartão inteiro era recalculado, e a linha refazia o
  layout, a cada quadro do hover.
- **A sombra do hover** é uma camada que só acende.
- **Inclinação dos cartões**: uma escrita por quadro, com o tamanho medido só
  quando o mouse entra.
- **Nada de hover enquanto a página rola**
  (`layout/marcador-de-rolagem.tsx`). Na vitrine presa, os cartões passavam
  debaixo do mouse parado e disparavam o Raio-X.
- **Animação infinita só na tela** (`ui/so-na-tela.tsx`): faixa de marcas,
  ponto da loja nova, dica da abertura e gabinete ilustrado. O gabinete do
  cartão é parado.
- **`content-visibility: auto`** nas seções do fim da home.

### JS e rede

- **`/produtos` no servidor**: os 26 cartões saem no HTML, e o catálogo só
  filtra e ordena, lendo a URL sem `useSearchParams`. A página continua
  estática.
- **Foto do produto com `getImageProps` e `<img>`**: o `<Image>` é componente
  de cliente, e a home hidratava 33 deles.
- **O catálogo fora do JS de toda página.**
  - A sacola confere só o formato do código.
  - O conteúdo da gaveta carrega quando ela abre (ou com o navegador
    ocioso).
  - A foto de reserva do Raio-X e as fotos da ficha chegam prontas do
    servidor.
- **`cn` só com `clsx`**: o tailwind-merge eram 9,6 KB gz.
- **Sem prefetch nos cartões, nas categorias e nos links para a própria
  home.** Antes eram 41 fetches em `/produtos`, e a home baixava a si mesma.
- **Imagem prioritária sem `loading="eager"`**: o React põe dica de
  pré-carga em todo `<img>` do servidor que não é lazy, e a dica viaja no
  prefetch.
- **Letreiro e ícone do WhatsApp por `<use>`** (`public/marca/`), com cache
  imutável. O olho da faixa é um `<symbol>` só.
- **`sizes` medidos** nos cartões e nas categorias.
- **A foto que voa para a sacola** usa a imagem que já está na tela.
- **O teste de WebGL** solta o contexto na hora.

## Galeria da ficha (13/10/2026)

O segundo ângulo de 18 produtos entrou na ficha. Medido contra o commit
`beea7d5`, em produção, na ficha do HP Victus 15:

| | antes | depois |
| --- | --- | --- |
| LCP no celular, 4G lento e CPU 4x (mediana de 7) | 2.156 ms | 2.144 ms |
| LCP no celular, rede local (mediana de 7) | 280 ms | 236 ms |
| LCP no computador, rede local (mediana de 18) | 280 ms | 276 ms |
| HTML (gz) | 16,0 KB | 17,1 KB |
| JS até o load | 159 KB | 160 KB |
| fotos no celular até o load | 21 KB | 26 KB (as duas miniaturas) |
| fotos no celular depois | 21 KB | 52 KB (mais a segunda foto) |

Home e `/produtos` não mudaram (HTML igual, JS da gaveta +64 bytes gz).

Dois tropeços no caminho, que viraram regra:

- **O segundo ângulo fora do JS da gaveta.** No mesmo arquivo das capas, os
  18 imports novos (endereço e borrão de cada foto) iam para o JS da gaveta,
  que carrega em toda página: de 22,4 para 27,8 KB gz. O mapa novo,
  `segundas-fotos.ts`, só é lido no servidor, e a `FotoDoProduto` recebe o
  segundo ângulo por propriedade.
- **A segunda foto depois da página pronta** (`ui/quadro-adiado.tsx`). O
  `loading="lazy"` não segurou: a foto fica a uma foto de distância, dentro
  da margem do Chrome, e baixava junto com a capa. No 4G lento ela dividia a
  banda com a capa, e o LCP mediano foi de 2.260 para 2.468 ms (5 rodadas).
  Agora ela entra no `load`, com o navegador ocioso, ou na hora em que a
  pessoa rola o trilho.

## 3D mais leve (13/10/2026)

O `<Canvas>` do R3F registra o three inteiro (`extend(THREE)`) para aceitar
qualquer elemento. As cenas do Raio-X e do Monte seu PC passaram a montar
no `Palco` (`tres/palco.tsx`): uma raiz própria (`createRoot`) com `extend`
só das nove peças que elas desenham, e sem o sistema de eventos do R3F
(nenhuma cena usa clique em objeto; o OrbitControls ouve a própria tela).

| | antes | depois |
| --- | --- | --- |
| chunk das cenas do R3F | 184 KB gz (739 KB) | 146 KB gz (585 KB) |
| chunk do núcleo do three | 61 KB gz | 53 KB gz |
| JS da home com o 3D (celular / computador) | 395 / 421 KB | 358 / 383 KB |
| JS do Monte seu PC com o 3D (celular / computador) | 443 / 465 KB | 397 / 419 KB |
| Raio-X, computador (média de 4) | 116 fps | 115 fps |
| vitrine, computador (média de 4) | 134 fps | 134 fps |
| tarefas longas da home parada (média de 9) | 429 ms | 413 ms |

Medido contra o commit `89ed7e7`, as duas versões em produção, alternadas.
Uma rodada só engana: o mergulho (a cena do olho, que não mudou) variou de
66 a 95 fps entre rodadas da mesma versão.

## Para depois

- Medir num celular de verdade (Android médio e iPhone) antes da reunião.

## Como medir

Ferramentas em `%TEMP%` (fora do repositório; refazer se sumirem):

- `visaosul-pesquisa/desempenho.mjs <url> --gpu [--celular] [--cpu=4]`:
  fps, p95, quadros travados e tarefas longas, no carregamento, parado, com
  o mouse e rolando com a roda.
- `visaosul-pesquisa/medir.mjs <url>`: bytes por tipo e LCP, no celular e no
  computador.
- `visaosul-pesquisa/navegacao.mjs <url>`: navega como uma pessoa e lista
  erros de página.
- `visaosul-pesquisa/catalogo.mjs <base>`: filtros, busca, ordem e
  hidratação de `/produtos`.
- `visaosul-pesquisa/prints.mjs`: prints num Chrome próprio. O Playwright
  MCP é compartilhado com outras sessões e não deve ser usado.
- `visaosul-pesquisa/lcp.mjs <url-a> <url-b> <rodadas> [--lento] [--computador]`:
  LCP alternando duas versões, com a mediana. `--lento` é 4G lento com CPU
  4x. Uma rodada só engana: o LCP local oscila uns 40 ms para os dois lados.
- `visaosul-pesquisa/prioridades.mjs <url> [celular]`: as fotos que a página
  baixa, com a hora, a prioridade e o peso.
- `visaosul-pesquisa/galeria.mjs`, `arrasto.mjs`, `galeria-extra.mjs`,
  `cedo.mjs` e `voo-cartao.mjs`: o uso da galeria (miniatura, arrasto com o
  dedo, Raio-X, foto que voa, teclado, troca de produto, toque antes do
  load). O arrasto vale pelo `arrasto.mjs`, com toque cru: o gesto
  sintético do `galeria.mjs` não move o trilho.

Para o "antes", monte o commit antigo numa pasta separada:
`git worktree add --detach <pasta> <commit>`, depois `npm ci`,
`next build` e `next start` numa porta livre.
