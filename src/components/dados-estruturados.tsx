/**
 * JSON-LD para o buscador. Escapa `<` para o conteúdo nunca fechar a tag
 * `<script>` antes da hora (um nome com "</script>" quebraria a página).
 */
export function DadosEstruturados({ dados }: { dados: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }} />
  );
}
