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
| 4 | Vitrine | Passar o mouse nos cartões | O mesmo Raio-X em cada produto |
| 5 | Ficha do HP Victus | Trocar a foto pelas miniaturas, ligar "Ver no Raio-X", mostrar o teste grátis | "Teste grátis antes de comprar", a frase que mais aparece nos posts dele |
| 6 | Pedido | Adicionar 2 produtos, abrir a sacola, enviar | O pedido chega pronto no WhatsApp dele, com itens, total, nome e entrega. É o momento de mostrar o celular dele recebendo |
| 7 | Assistência | Abrir um chamado em 3 toques | Chamado em 30 segundos, mensagem pronta para a loja |
| 8 | Monte seu PC | Marcar 2 jogos, trocar o nível e a cor da luz | A loja indica a configuração e monta |
| 9 | Empresas | Locação de impressoras | A especialidade de anos dele |
| 10 | Celular | Abrir no celular dele, se ele quiser | Tudo cabe no celular de quem chega pelo Instagram |
| 11 | Fase 2 | Contar o que vem depois | Painel para ele mudar preço e estoque e receber pedidos e chamados, e pagamento online (Pix e cartão) |

Os preços são de exemplo e aparecem com o selo "ilustrativo". Vale dizer
isso logo no começo: no ar, quem define o preço é ele.

## Perguntas que fecham as pendências

Cada resposta vira conteúdo do site (detalhes em `PENDENCIAS.md`):

- Endereço e horário da loja (hoje aparecem como "em breve").
- Uma foto dele para o cartão "Quem atende é o Marciano", e se autoriza.
- As promessas continuam valendo? Troca na hora em 30 dias, entrega grátis
  em Tapejara, teste grátis e atendimento a domicílio ("não importa a hora").
- Na locação de impressoras: toner incluso? Manutenção sem custo extra?
- Que serviços a assistência faz e não faz.
- Preços reais, ou a tabela dele; usa algum sistema de estoque (Bling)?
- Logo em vetor (o arquivo do designer), fotos da loja pronta e um domínio.

## Se algo der errado

- O 3D não apareceu: o site mostra a imagem no lugar e segue funcionando.
  Recarregar a página costuma resolver.
- O notebook travou: abra no celular pelo endereço "No celular".
- O WhatsApp não abriu: confira a internet; o resto do site não depende dela.
