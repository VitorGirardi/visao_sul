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

## 3D e rolagem (09/10/2026)

O prime-collection tirou three, motion e lenis do site em produção por peso
(127 KB gzip a mais para todo celular). Aqui eles voltam porque o pedido é o
nível do protótipo `museu`, mas com as travas aprendidas lá: o 3D entra só por
`next/dynamic` de componente, depois da página pronta, com SVG ou foto no
lugar, parando fora da tela, e nada disso no cabeçalho. GSAP e Lenis estão no
layout do site (≈40 KB). Gatilho para reabrir: medição no celular de verdade
mostrar travada na rolagem.

## Dois temas (09/10/2026)

Escuro por padrão (a parede grafite com o letreiro aceso é a cara da loja) e
claro (a lâmina oficial e o resto da loja). Mesmos tokens, valores por
`data-tema`. O amarelo não é cor de texto no claro (1,8:1): lá o "amarelo" de
texto é um ouro escuro (`--destaque-texto`, 5,6:1) e o destaque vira
marca-texto.

## Fora do Google enquanto for protótipo (09/10/2026)

`robots` bloqueia tudo e o layout manda `noindex`: o protótipo tem preço de
exemplo e não pode aparecer como a loja de verdade numa busca.
