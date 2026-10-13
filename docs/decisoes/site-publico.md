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

## Busca no topo (13/10/2026)

A busca só existia dentro da vitrine. Quem chegava pela home (quase todo
mundo, vindo do Instagram) precisava abrir o menu e ir em Produtos para
procurar um PS5. Agora há uma lupa no cabeçalho de toda página:

- abre um painel com o campo já em foco e, antes de digitar, os mais
  procurados ("Notebook", "iPhone", "PS5", "JBL", "Impressora",
  "Roteador");
- os resultados aparecem enquanto se digita (até seis, com foto, categoria
  e preço, e o aviso de valor ilustrativo), com a mesma busca da vitrine:
  sinônimos, plural e erro de digitação;
- Enter ou "Ver na vitrine" levam à vitrine filtrada; sem resultado, o
  "Perguntar no WhatsApp" já leva o termo;
- "/" e Ctrl+K (⌘K) abrem; Esc fecha.

Nada a mais no JS das páginas (a home segue com 167 KB até o load): no
cabeçalho fica só a lupa e a moldura do `<dialog>`. O miolo da busca e o
índice dos produtos (`/indice-de-busca`, 14 KB de JSON pronto no build)
só baixam quando o dedo ou o mouse chega perto da lupa, como a gaveta do
pedido.

No celular, a lupa ocupa o lugar do botão de tema na barra (o tema
continua no menu). Entre 1024 e 1279 px, os links do menu ficaram com menos
folga e o WhatsApp do topo mostra só o ícone: com a lupa, "Monte seu PC"
quebrava em duas linhas.

## Acompanhe seu conserto (13/10/2026)

O argumento mais forte da fase 2 é o que o cliente da loja ganha, e a
prévia do painel só mostrava o lado do Marciano. Agora há o outro lado:
`/conserto/<número>`, a página que o cliente abre pelo link que recebe no
WhatsApp quando o chamado é aberto. Ela mostra a OS (aparelho, defeito,
onde é atendido), o momento em destaque e a linha do tempo da bancada
(recebido, diagnóstico, orçamento, conserto, pronto, entregue; "aguardando
peça" aparece no lugar do conserto).

- Com orçamento para aprovar, a página mostra o que o técnico encontrou, o
  valor e "Aprovar pelo WhatsApp" a um toque. Pronto, "Combinar a
  retirada". As respostas passam pela rota `/whatsapp` (assunto `os`), que
  só aceita o número no formato de quatro dígitos e as três ações
  conhecidas: na fase 2, é ali que a aprovação anda o chamado sozinha.
- No painel, toda mensagem para o cliente leva o link, e o cartão da OS tem
  "Ver como o cliente vê".
- Os títulos falam do conserto, nunca do aparelho ("o seu impressora" e
  "pronto/pronta" não fecham). Os textos só dizem o que a assistência já
  promete: diagnóstico explicado, nada trocado sem aprovar, devolvido
  funcionando.
- É página de cliente: `noindex` sempre e fora do sitemap. Na prévia,
  mostra a etapa da amostra, não a que foi andada no painel (a memória do
  painel fica só na aba dele), e avisa que é exemplo.

O argumento para a reunião: o cliente para de perguntar "já está pronto?".

## Home compacta no celular (13/10/2026)

Aberta num celular de verdade, a home ficou "muito extensa". Medida: 23,5 telas
de 844 px, das quais 4,3 de rolagem presa (o mergulho e o Raio-X). Sem tirar
conteúdo e sem mexer no computador (prints da home, da assistência e de
empresas idênticos pixel a pixel), ela foi para 16,3 telas:

- **Rolagem presa mais curta:** o mergulho passa em uma tela de rolagem
  (era 1,7) e o Raio-X em 1,3 (era 2,6). Um gesto do dedo rola quase uma
  tela, e o alisamento segura o movimento; o Raio-X ainda passa pelas cinco
  peças.
- **Respiro de celular:** as seções tinham 96 px de folga em cima e embaixo;
  agora 56 (`py-14 md:py-32`). Só isso somava mais de uma tela.
- **Mesmo conteúdo, mais denso:** categorias em quadros mais baixos;
  diferenciais em grade 2 × 2; serviços da assistência com ícone e nome em
  duas colunas (a explicação de cada um fica na página da assistência);
  empresas num trilho de arrastar, com o próximo cartão aparecendo na
  borda; Instagram em três colunas; foto da loja e gabinete do PC menores.
- **Rodapé:** navegação e categorias lado a lado, em todas as páginas (de
  1,7 para 1,3 tela).

| seção | antes | depois |
| --- | --- | --- |
| abertura (com o mergulho) | 2,7 | 2,0 |
| a loja | 1,9 | 1,6 |
| categorias | 2,3 | 1,5 |
| Raio-X (com a rolagem presa) | 3,6 | 2,3 |
| diferenciais | 1,6 | 0,9 |
| assistência | 2,9 | 2,1 |
| Monte seu PC | 1,6 | 1,3 |
| empresas | 2,4 | 1,0 |
| Instagram | 1,1 | 0,7 |
| rodapé | 1,7 | 1,3 |
| **home inteira** | **23,5** | **16,3** |

O que sobrou é quase todo experiência (o mergulho e o Raio-X) e o
formulário de chamado, que é o ponto de conversa da assistência.

## Busca que vira encomenda (13/10/2026)

Quando a busca da vitrine não acha nada, o botão "Perguntar no WhatsApp"
abre a conversa já com o termo: "Procurei *xbox series s* no site e não
achei. Vocês conseguem encomendar?". Antes ele abria um "Quero falar com a
Visão Sul" genérico, e a pessoa tinha de digitar tudo de novo.

O termo é texto livre, então a rota o trata como trata o nome e a
observação dos formulários: uma linha só, no máximo 80 caracteres e sem os
sinais de formatação do WhatsApp (`*`, `_`, `~`), porque vai em negrito.

A mensagem pergunta, não promete: ninguém confirmou ainda que a loja faz
encomenda (está no `PENDENCIAS.md`). O texto da tela diz que a loja
"responde se tem ou se consegue trazer". Na fase 2, essas conversas viram a
lista "buscaram e não acharam" do painel, que a prévia já mostra.

O botão flutuante do WhatsApp passou a perceber também os caminhos que
aparecem depois de a página abrir, como este, e sai de cena quando ele
entra na tela.

## Busca que entende o cliente (13/10/2026)

"ps5", "wifi", "fone de ouvido" e "notbook" não achavam nada na vitrine,
e o post da entrega de PS5 está na home: se o Marciano digitasse "ps5" na
reunião, a vitrine ficava vazia. Duas causas: o índice não tinha o nome
curto ("PS5 Slim Digital") nem o nome da categoria ("Redes e Wi-Fi"), e a
busca era literal.

Agora (`lib/busca.ts`, sinônimos em `data/busca.ts`):

- o índice leva nome, nome curto, marca, destaques e categoria, e "Wi-Fi"
  vira "wifi";
- palavra com sinônimo vale pelo sinônimo: "ps5" e "play" acham o
  PlayStation, "fone" acha headset e AirPods (e não o "microfone" do
  controle), "laptop" acha notebook, "cachorro" acha a coleira;
- termo de até 3 letras só vale no começo de uma palavra ("ps 5" não acha
  a Epson nem o GPS);
- "de", "para", "com" e afins não contam ("fone de ouvido");
- plural e um erro de digitação nos termos de 5 letras ou mais
  ("roteadores", "notbook").

Os sinônimos só cobrem o que a vitrine tem. O que ela não tem (cadeira,
Xbox, carregador) continua caindo na busca vazia, que pergunta da
encomenda no WhatsApp.

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
