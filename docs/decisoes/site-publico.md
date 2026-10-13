# Site público: decisões

Cada decisão com data e motivo. Data mais nova vence.

## O pedido (09/10/2026)

O Vitor viu a loja nova do Marciano (colega antigo) e notou que ela não tem
site. Quer apresentar um protótipo "diferente de todo e-commerce de
informática", com 3D, hover e animação de rolagem, no nível do protótipo que
virou a Prime Collection. Respostas dele às perguntas do levantamento:

1. vitrine com pedido pelo WhatsApp no protótipo; pagamento online e painel
   como fase 2 da proposta;
2. preço de exemplo, com aviso;
3. o Marciano pode aparecer como o rosto da loja;
4. endereço e horário ainda não sabia;
5. fazer os dois temas, escuro e claro, para ele comparar;
6. repositório `VitorGirardi/visao_sul` (público, conta pessoal);
7. também vendem Apple (iPhone) e Chromecast; o cliente é de todo tipo.

## Conceito: Visão

A marca é um olho. Três momentos de 3D contam a mesma ideia: a abertura
mergulha pelo furo do olho e sai dentro da loja (a foto que o Vitor tirou), o
Raio-X abre um notebook e mostra as peças com a ficha, e o montador gira um
gabinete com a luz na cor escolhida. No miúdo, o cartão de produto vira chapa
de raio-x no hover.

## A logo (09/10/2026)

Não existe vetor da marca. O símbolo foi reconstruído com geometria medida na
lâmina de 1080 px do Instagram (círculos e curvas, para o 3D sair liso); o
letreiro foi contornado da imagem ampliada 8x, com cantos detectados, hastes
retas e curvas ajustadas (`scripts/marca/`). Para rodar a receita de novo:
`npm i --no-save potrace d3-contour fit-curve`. No cabeçalho entra um arranjo
horizontal (olho ao lado do nome), porque empilhada numa barra de 64 px o
"INFORMÁTICA" ficaria ilegível.

## Fotos de produto (09/10/2026)

Fotos oficiais dos fabricantes (Apple, HP, Sony, JBL, Amazon, Google, Xiaomi,
TP-Link, Epson, Logitech, HyperX, Toshiba, Garmin, LG, Acer), uma por produto,
com a origem anotada em `referencias/produtos/fontes.json`. O script tira o
fundo branco (de fora para dentro, sem comer o produto) para o produto
flutuar no tema escuro; produto branco (Deco, Chromecast) e a impressora (o
papel é branco) ficam com fundo e ganham cartão claro. É prática de revenda,
mas o uso final deve ser confirmado com a loja.

Galeria na ficha (13/10/2026, pedido do Vitor): 18 produtos têm uma segunda
foto oficial, de outro ângulo (`<slug>-2` nos originais), tratada pelo mesmo
script. A foto grande da ficha virou um trilho com encaixe: arrasta com o dedo
no celular, troca pelas miniaturas embaixo, e o Raio-X mostra o ângulo que
está na tela. Sem biblioteca de carrossel: o arrasto é a rolagem do próprio
navegador. Produto com uma foto só fica como era.

## Fichas conferidas (13/10/2026)

Antes de mostrar a um dono de loja de informática, as fichas dos 26 produtos
foram conferidas item a item contra a página do fabricante (334 itens: 303
certos, 8 errados, 23 sem como confirmar). Corrigido com fonte oficial: o
PS5 Slim Digital de hoje tem 825 GB (não 1 TB), o iPhone 17 Pro não é o topo
da linha (é o Pro Max), o iPhone 17 é o "padrão" (o de entrada é o 17e), o
HyperX tem DTS Headphone:X, e a Epson rende 4.500 páginas em preto OU 7.500
coloridas. Também foram ajustados textos que prometiam mais que a fonte
(Chromecast só com HDMI, bateria do Garmin de até 68 h). As promessas da
loja foram conferidas post a post: o "não importa a hora" virou "até no fim
de semana", que é o que o post dizia. O que depende do Marciano está no
`PENDENCIAS.md`; o relatório completo ficou fora do repositório.

## Acabamento antes da reunião (13/10/2026)

O Vitor pediu o protótipo "perfeito" antes de mostrar ao Marciano. Uma
auditoria tela a tela (computador e celular) achou e corrigiu:

- **Catálogo no celular em duas colunas** (`CartaoProduto densa`): com uma
  coluna, os 26 produtos ocupavam 22 telas. O cartão denso perde as fichas e
  o selo de teste, e o botão de adicionar vai para o canto da foto. O selo
  "ilustrativo" fica.
- **"Combina com este" por afinidade** (`combinaCom` em `data/categorias.ts`):
  o HP Victus sugeria iPhone; agora sugere headset, teclado, monitor e HD.
- **Quadros de categoria no celular**: sem seta nem chamada, com a contagem
  embaixo do nome. "iPhone e Apple" quebrava em três linhas.
- **Texto da vitrine pelo tipo de tela**: "passe o mouse" só onde existe
  mouse; no toque, "toque em Ver no Raio-X".
- **Botão flutuante do WhatsApp** some enquanto outro caminho para o WhatsApp
  está na tela: cobria o botão do chamado técnico.
- **Acessibilidade**: o texto terciário (`--texto-3`) passou de 4,5:1 nos dois
  temas, o símbolo decorativo saiu do leitor de tela, a galeria ganhou foco e
  nome, e a página 404 ganhou o destino do "pular para o conteúdo". Sobram
  só os alertas da animação de entrada (texto ainda aparecendo).

## Prévia do painel (13/10/2026)

Para vender a fase 2 na reunião, o painel ganhou uma prévia em `/admin`, onde
o painel de verdade vai morar, com dados de exemplo e sem backend (tudo vive
no navegador; recarregar volta ao começo). O desenho segue o painel mais novo
da Amage, o da Prime Collection, refeito em 09/2026 depois de o cliente
achar o anterior "amador": painel sempre claro, 13 px, estado com forma (um
quadradinho de cor com a palavra), o amarelo da marca só no gesto da pessoa
e nada de toast ou rodinha. O "aviso" é laranja para não se confundir com o
amarelo.

O roteiro da demonstração está em `apresentacao.md`: o pedido que chega na
hora, o link de pagamento com o Pix caindo sozinho, a bancada de chamados, o
teste grátis que vira venda e o preço mudado aparecendo no cartão do site.
A "mensagem que chegou" no pedido é a mesma que a rota `/whatsapp` monta
hoje, e os botões de WhatsApp do painel só mostram e copiam a mensagem:
com telefones de exemplo, abrir conversa poderia cair em alguém de verdade.

## 3D e rolagem (09/10/2026)

O prime-collection tirou three, motion e lenis do site em produção por peso
(127 KB gzip a mais para todo celular). Aqui eles voltam porque o pedido é o
nível do protótipo `museu`, mas com as travas aprendidas lá: o 3D entra só por
`next/dynamic` de componente, depois da página pronta, com SVG ou foto no
lugar, parando fora da tela, e nada disso no cabeçalho. GSAP e Lenis estão no
layout do site (≈40 KB). Gatilho para reabrir: medição no celular de verdade
mostrar travada na rolagem.

Reaberto pelo próprio Vitor, que achou o site travado: o Lenis saiu em 09/10
e o GSAP em 12/10/2026. A rolagem é nativa, e as cenas presas usam
`position: sticky` (`lib/rolagem-presa.ts`). Medições e motivos em
`desempenho.md`.

## Dois temas (09/10/2026)

Escuro por padrão (a parede grafite com o letreiro aceso é a cara da loja) e
claro (a lâmina oficial e o resto da loja). Mesmos tokens, valores por
`data-tema`. O amarelo não é cor de texto no claro (1,8:1): lá o "amarelo" de
texto é um ouro escuro (`--destaque-texto`, 5,6:1) e o destaque vira
marca-texto.

## Fora do Google enquanto for protótipo (09/10/2026)

`robots` bloqueia tudo e o layout manda `noindex`: o protótipo tem preço de
exemplo e não pode aparecer como a loja de verdade numa busca.
