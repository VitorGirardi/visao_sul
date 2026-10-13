import { DONO, LOJA } from "@/data/loja";

/**
 * COMO COMPRAR (13/10/2026): o caminho da sacola até o produto na mão, para
 * quem nunca comprou pelo WhatsApp entender antes de tocar no botão. Só o
 * que a loja já faz hoje: o pedido chega pronto, o preço do dia é confirmado
 * na conversa (o mesmo do `AVISO_DE_PRECO`), e o produto é retirado ou
 * entregue (as duas opções da sacola). "Já configurado" fica de fora até o
 * Marciano confirmar (PENDENCIAS.md).
 */
export const COMO_COMPRAR = [
  {
    titulo: "Você manda o pedido",
    texto: "Escolha os produtos e envie a sacola: o pedido chega pronto no WhatsApp da loja.",
    curto: "Você manda o pedido",
  },
  {
    titulo: "A loja confirma",
    texto: `O ${DONO.primeiroNome} confirma o preço do dia e a disponibilidade, e combina o pagamento com você.`,
    curto: "A loja confirma preço e pagamento",
  },
  {
    titulo: "Retire ou receba",
    texto: `Na loja em ${LOJA.cidade} ou em casa: você escolhe na hora de mandar o pedido.`,
    curto: "Você retira ou recebe",
  },
] as const;
