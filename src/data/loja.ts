/**
 * A LOJA FÍSICA. Abriu em outubro de 2026, depois de cinco anos vendendo
 * online (desde 2021, segundo o Vitor). Endereço e horário ainda não foram
 * passados (o Vitor respondeu "ainda não sei" em 09/10/2026): enquanto isso
 * a tela mostra "em breve" e nada inventado. Ver PENDENCIAS.md.
 */
export const LOJA = {
  cidade: "Tapejara",
  estado: "RS",
  desde: 2021,
  /** `null` = ainda não informado. A tela trata os dois casos. */
  endereco: null as string | null,
  horario: null as string | null,
  /** Cidades que aparecem nas hashtags deles (#tapejara #sananduva). */
  regiao: ["Tapejara", "Sananduva"],
} as const;

/**
 * O MARCIANO, dono da loja e colega antigo do Vitor (que autorizou colocar
 * ele como o rosto da loja em 09/10/2026). O que está aqui é o que é público:
 * a atleta que a loja patrocina escreveu que ele é conhecido "há anos" pelo
 * trabalho com impressoras e informática. Foto dele ainda não temos.
 */
export const DONO = {
  nome: "Marciano Prando Teixeira",
  primeiroNome: "Marciano",
  instagram: "https://www.instagram.com/marciano.prandoteixeira/",
  apresentacao:
    "Quem atende é o Marciano, conhecido há anos em Tapejara pelo trabalho com impressoras e informática. A Visão Sul é esse conhecimento virando loja.",
} as const;

export const enderecoOuEmBreve = () => LOJA.endereco ?? `${LOJA.cidade}/${LOJA.estado} · endereço em breve`;
export const horarioOuEmBreve = () => LOJA.horario ?? "Horário de atendimento em breve";
