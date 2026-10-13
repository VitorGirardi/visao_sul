# Pendências

Fila viva do projeto: o que ainda não foi feito e por quê.

## Esperando o Marciano

Nada disso é trabalho de front: está do lado dele e trava o conteúdo.

| O que | Desde | Trava |
| --- | --- | --- |
| Endereço e horário da loja | 09/10 | `data/loja.ts` mostra "em breve" (o Vitor ainda não sabia). Entra no rodapé, na seção da loja, no JSON-LD e no Google Meu Negócio |
| Preços reais (ou a tabela dele) | 09/10 | todos os preços são de EXEMPLO, com o selo "ilustrativo" |
| A frase inteira da parede | 09/10 | "Tecnologia com compromisso" está legível; a terceira linha estava escondida atrás de uma caixa na foto |
| Se as promessas continuam valendo | 09/10 | troca na hora em 30 dias (post de 03/2024), entrega grátis (2023), teste grátis e domicílio. Estão em `data/diferenciais.ts`, conferidas post a post em 13/10. Sem post nenhum: entregar "configurado" (está na ficha, na seção da loja e em empresas) |
| Quais produtos têm teste grátis | 13/10 | os posts falam de notebook e caixa JBL; o catálogo marca `testeGratis` em 16 produtos (inclui console e headset) |
| Qual PS5 ele vende | 13/10 | a ficha diz 825 GB, a Edição Digital vendida hoje (CFI-2100). Se for estoque antigo (CFI-2000), volta para 1 TB |
| Configuração do Acer e do HP touch | 13/10 | o post só garante processador, vídeo e SSD. Memória, tamanho do SSD, tela e sistema dependem da máquina dele. No Acer, com um pente só de memória o vídeo é "Intel UHD", não "Iris Xe" |
| Lista de serviços da assistência | 09/10 | `data/servicos.ts` detalha o que uma assistência faz; confirmar o que ele faz e o que não faz |
| Planos da locação de impressoras | 09/10 | hoje tudo vira "pedir proposta" |
| Foto dele (e autorização) | 09/10 | o cartão "Quem atende é o Marciano" usa o símbolo no lugar do rosto |
| Fotos da loja pronta | 09/10 | a foto de 09/10 tem a mesa da frente com caixas ("ainda não está tudo montado"). Com a loja pronta: fachada, balcão, bancada técnica, em alta |
| Logo em vetor original | 09/10 | a nossa foi vetorizada da lâmina de 1080 px; se houver o arquivo do designer, trocar `data/marca.ts` |
| Catálogo de verdade | 09/10 | os 26 produtos são os que aparecem no Instagram e na foto da loja, com foto oficial de fabricante (fontes em `referencias/produtos/fontes.json`). Confirmar o uso das imagens ou trocar por fotos próprias |
| Domínio | 09/10 | sem domínio, as URLs absolutas saem da Vercel. Com ele: `NEXT_PUBLIC_URL_DO_SITE` |

## Fase 2 (a proposta)

| O que | Observação |
| --- | --- |
| Painel `/admin` | produtos, preços e estoque; pedidos, chamados e agendamentos que chegam pela rota `/whatsapp` (a rota já é o ponto de gravação). Convex sobre Synapse, como no vivenna-imoveis. A PRÉVIA, com dados de exemplo e sem backend, já está em `/admin` (13/10/2026); falta o Convex, o login e trocar a amostra pelos dados reais |
| WhatsApp do cliente nos formulários | os formulários pedem o nome, não o telefone, e a rota `/whatsapp` não sabe quem escreveu. Para o painel avisar o cliente, a fase 2 precisa pedir o WhatsApp ou fazer a mensagem levar o número do pedido |
| Pagamento online | Pix e cartão (Mercado Pago, como no luccerna-ecom), frete e retirada na loja |
| Integração com o estoque dele | se ele usa ERP (Bling, por exemplo), o catálogo vem de lá |
| Feed do Instagram ao vivo | hoje são seis posts fixos |
| Tirar o `noindex` | robots e metadata, no dia de ir ao ar |

## Próximos passos nossos

| O que | Observação |
| --- | --- |
| Medir no celular de verdade | medido no notebook do Vitor (GPU real) e com a CPU 4 vezes mais lenta imitando um celular (`docs/decisoes/desempenho.md`). Falta um Android médio e um iPhone de verdade antes da reunião: `npm run apresentar` com o `WHATSAPP_DE_TESTE`, como em `docs/apresentacao.md`. Conferir também o arrasto da galeria da ficha |
