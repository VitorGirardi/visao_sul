# Apresentação para o Marciano

Roteiro da reunião em que o Vitor mostra o protótipo (preparado em
13/10/2026). O site roda no notebook, sem publicar nada.

## Antes do dia: testar no celular

1. Crie o arquivo `.env.local` na raiz do projeto (fica fora do git) com o
   seu número, só dígitos, com 55 e DDD:

   ```
   WHATSAPP_DE_TESTE=5554999999999
   ```

2. Rode `npm run apresentar`. Ele faz o build e mostra dois endereços: o do
   notebook e o "No celular" (ex.: `http://192.168.0.5:3110`).
3. Conecte o celular na MESMA rede Wi-Fi do notebook e abra o endereço "No
   celular". Use uma rede sua (o roteador do celular serve): na rede da loja,
   qualquer aparelho conectado consegue abrir o endereço.
4. Faça o roteiro abaixo no Android e no iPhone. Envie um pedido: a mensagem
   chega no SEU WhatsApp, começando com "Teste do site".
5. Anote o que travar ou parecer estranho no celular.

## Para a reunião

1. Apague a linha `WHATSAPP_DE_TESTE` do `.env.local` e rode
   `npm run apresentar` de novo. Confira que ele diz "as mensagens vão para a
   LOJA". Assim, o pedido feito na reunião chega no WhatsApp do Marciano.
2. Notebook na tomada, brilho alto, modo foco (sem notificações) e só o
   navegador aberto: o 3D usa a placa de vídeo.
3. Abra o site numa janela anônima (sacola vazia) e em tela cheia (F11). O
   tema escuro abre por padrão.
4. Internet: o site funciona sem ela; só o WhatsApp precisa. Leve o roteador
   do celular por garantia.

## O roteiro (uns 10 minutos)

| # | Onde | O que fazer | O que falar |
| --- | --- | --- | --- |
| 1 | Início | Esperar o olho 3D e rolar devagar | "Role para entrar na loja." O site abre pelo olho da marca e mergulha na foto da loja dele |
| 2 | A loja | Parar no cartão do Marciano | "Quem atende é você. Online desde 2021, agora de portas abertas" |
| 3 | Raio-X | Rolar pela cena do notebook | O diferencial: ver por dentro antes de levar. Cada peça acende com a ficha |
| 4 | Vitrine | Passar o mouse nos cartões. Em "Ver produtos", buscar "cadeira gamer" | O mesmo Raio-X em cada produto. E quem não acha o que procura não vai embora: a conversa sai com o que a pessoa buscou |
| 5 | Ficha do HP Victus | Trocar a foto pelas miniaturas, ligar "Ver no Raio-X", mostrar o teste grátis | "Teste grátis antes de comprar", a frase que mais aparece nos posts dele |
| 6 | Pedido | Adicionar 2 produtos, abrir a sacola, enviar | O pedido chega pronto no WhatsApp dele, com itens, total, nome e entrega. É o momento de mostrar o celular dele recebendo |
| 7 | Assistência | Abrir um chamado em 3 toques | Chamado em 30 segundos, mensagem pronta para a loja |
| 8 | Monte seu PC | Marcar 2 jogos, trocar o nível e a cor da luz | A loja indica a configuração e monta |
| 9 | Empresas | Locação de impressoras | A especialidade de anos dele |
| 10 | Celular | Abrir no celular dele, se ele quiser | Tudo cabe no celular de quem chega pelo Instagram |
| 11 | Fase 2 | Abrir a prévia do painel (abaixo) | O que hoje chega solto no WhatsApp vira pedido organizado, e o pagamento entra sozinho |

Os preços são de exemplo e aparecem com o selo "ilustrativo". Vale dizer
isso logo no começo: no ar, quem define o preço é ele.

## A prévia do painel (2 minutos)

Deixe aberta numa outra aba: `http://localhost:3110/admin` (o painel não tem
link no site). Tudo nela é de exemplo e fica só no navegador: recarregar a
página volta tudo ao começo, o que serve para ensaiar. Navegue pelo menu do
painel, sem recarregar, para os passos ficarem guardados.

| Tempo | Tela | O que fazer | O que falar |
| --- | --- | --- | --- |
| 0:00 | Visão geral | Clicar em "Simular pedido chegando": o sino acende e o pedido 0043 entra no topo | "Isto é o que hoje chega solto no seu WhatsApp" |
| 0:15 | Pedido 0043 | Mostrar "A mensagem que chegou" e clicar em "Confirmar e mandar link de pagamento" | A mensagem com o link sai pronta para o cliente |
| 0:30 | Pedido 0043 | Fechar a janela e esperar uns segundos: o Pix cai sozinho e o pedido vira "Pago" | "O dinheiro entra e o pedido anda sozinho. Essa é a fase 2" |
| 0:45 | Chamados | Abrir a OS 0108 (esperando aprovação), "Avisar no WhatsApp" com o orçamento, depois "Cliente aprovou" | Nenhum conserto esquecido no fundo da bancada |
| 1:10 | Testes grátis | Marcar "Virou venda" num teste da semana | O número de cima mostra quanto o teste grátis vende |
| 1:30 | Produtos | Mudar o preço do HP Victus 15 | O cartão do site, ao lado, muda na hora: "você mexe aqui, o site muda" |
| 1:50 | Celular | Abrir o painel no celular | Cabe no bolso, no balcão |

Os botões de WhatsApp do painel não abrem conversa: com telefones de
exemplo, eles mostram a mensagem pronta e copiam.

## Perguntas que fecham as pendências

Cada resposta vira conteúdo do site (detalhes em `PENDENCIAS.md`):

- Endereço e horário da loja (hoje aparecem como "em breve").
- Uma foto dele para o cartão "Quem atende é o Marciano", e se autoriza.
- As promessas continuam valendo? Troca na hora em 30 dias, entrega grátis
  em Tapejara, teste grátis e atendimento a domicílio ("não importa a hora").
- Na locação de impressoras: toner incluso? Manutenção sem custo extra?
- Que serviços a assistência faz e não faz.
- Ele encomenda o que não está na vitrine? A busca sem resultado já
  pergunta isso por quem procura, e a home promete "a gente encomenda".
- Preços reais, ou a tabela dele; usa algum sistema de estoque (Bling)?
- Logo em vetor (o arquivo do designer), fotos da loja pronta e um domínio.

## Se algo der errado

- O 3D não apareceu: o site mostra a imagem no lugar e segue funcionando.
  Recarregar a página costuma resolver.
- O notebook travou: abra no celular pelo endereço "No celular".
- O WhatsApp não abriu: confira a internet; o resto do site não depende dela.
