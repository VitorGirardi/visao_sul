# Pendências

Fila viva do projeto: o que ainda não foi feito e por quê.

## Esperando o Marciano

Nada disso é trabalho de front: está do lado dele e trava o conteúdo.

| O que | Desde | Trava |
| --- | --- | --- |
| Endereço e horário da loja | 09/10 | `data/loja.ts` mostra "em breve" (o Vitor ainda não sabia). Entra no rodapé, na seção da loja, no JSON-LD e no Google Meu Negócio |
| Preços reais (ou a tabela dele) | 09/10 | todos os preços são de EXEMPLO, com o selo "ilustrativo" |
| A frase inteira da parede | 09/10 | "Tecnologia com compromisso" está legível; a terceira linha estava escondida atrás de uma caixa na foto |
| Se as promessas continuam valendo | 09/10 | troca na hora em 30 dias (post de 03/2024), entrega grátis (2023), teste grátis e domicílio. Estão em `data/diferenciais.ts` |
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
| Painel `/admin` | produtos, preços e estoque; pedidos, chamados e agendamentos que chegam pela rota `/whatsapp` (a rota já é o ponto de gravação). Convex sobre Synapse, como no vivenna-imoveis |
| Pagamento online | Pix e cartão (Mercado Pago, como no luccerna-ecom), frete e retirada na loja |
| Integração com o estoque dele | se ele usa ERP (Bling, por exemplo), o catálogo vem de lá |
| Feed do Instagram ao vivo | hoje são seis posts fixos |
| Tirar o `noindex` | robots e metadata, no dia de ir ao ar |

## Próximos passos nossos

| O que | Observação |
| --- | --- |
| Medir no celular de verdade | o 3D foi conferido em Chrome headless (renderização por software). Medir num Android médio e num iPhone antes da reunião |
| Fotos de produto em segundo ângulo | 18 produtos têm `-2` em `referencias/produtos/originais`; a ficha pode ganhar galeria |
