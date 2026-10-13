/**
 * OS DIFERENCIAIS são frases que a própria loja repete nos posts (março de
 * 2024 a dezembro de 2025). Nada aqui é promessa nossa; confirmar com o
 * Marciano se continuam valendo (PENDENCIAS.md).
 *
 *   "Comprou o notebook e deu defeito de fabricação em 30 dias! Substituímos
 *    o notebook por outro na hora!"                         (01/03/2024)
 *   "Agende um teste gratuito!"                             (26/12/2025)
 *   "Entrega gratuita! Receba em casa!" / "Entrega imediata!" (2023)
 *   "Abre o chamado e vamos até vocês! Não importa a hora!"  (18/10/2024)
 *
 * Conferido post a post em 13/10/2026: o "não importa a hora" era uma
 * entrega no fim de semana (não chamado técnico a qualquer hora), o teste
 * grátis dos posts é de notebook e caixa JBL (não de console), e a entrega
 * grátis não diz área. O texto segue isso.
 *
 * `destaque` é a palavra grande da tela; não é número inventado.
 */
export const diferenciais = [
  {
    destaque: "30 dias",
    titulo: "Deu defeito? Troca na hora.",
    texto: "Notebook com defeito de fábrica nos primeiros 30 dias é substituído por outro na hora. Você não fica sem máquina.",
  },
  {
    destaque: "R$ 0",
    titulo: "Teste grátis antes de comprar.",
    texto: "Agende e venha testar o notebook ou ouvir a caixa de som na loja, antes de levar.",
  },
  {
    destaque: "Hoje",
    titulo: "Entrega imediata.",
    texto: "Produto em estoque sai na hora, e a entrega é grátis: receba em casa, já configurado.",
  },
  {
    destaque: "Até você",
    titulo: "Atendimento a domicílio.",
    texto: "Abriu o chamado, a gente vai até a sua casa ou empresa, até no fim de semana.",
  },
] as const;
