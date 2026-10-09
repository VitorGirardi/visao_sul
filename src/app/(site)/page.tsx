import { ALoja } from "@/components/sections/a-loja";
import { Abertura } from "@/components/sections/abertura";
import { AssistenciaChamada } from "@/components/sections/assistencia-chamada";
import { CategoriasEmDestaque } from "@/components/sections/categorias-em-destaque";
import { ChamadaFinal } from "@/components/sections/chamada-final";
import { Diferenciais } from "@/components/sections/diferenciais";
import { EmpresasChamada } from "@/components/sections/empresas-chamada";
import { FaixaDeMarcas } from "@/components/sections/faixa-de-marcas";
import { Instagram } from "@/components/sections/instagram";
import { MonteSeuPcChamada } from "@/components/sections/monte-seu-pc-chamada";
import { RaioX } from "@/components/sections/raio-x";
import { Vitrine } from "@/components/sections/vitrine";

/**
 * A PÁGINA INICIAL, na ordem da conversa com quem chega pelo Instagram:
 * a marca (o olho) → a loja que acabou de abrir → o que ela vende → o Raio-X
 * (enxergar por dentro) → os mais procurados → por que
 * comprar ali → assistência → montar um PC → empresas → falar no WhatsApp.
 */
export default function PaginaInicial() {
  return (
    <>
      <Abertura />
      <ALoja />
      <FaixaDeMarcas />
      <CategoriasEmDestaque />
      <RaioX />
      <Vitrine />
      <Diferenciais />
      <AssistenciaChamada />
      <MonteSeuPcChamada />
      <EmpresasChamada />
      <Instagram />
      <ChamadaFinal />
    </>
  );
}
