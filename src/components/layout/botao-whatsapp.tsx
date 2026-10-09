import { IconeWhatsApp } from "@/components/ui/icones";
import { linkDaConversa, WHATSAPP_EXIBICAO } from "@/data/contato";

/**
 * O botão flutuante do WhatsApp, só no celular (na tela larga o cabeçalho já
 * tem o botão). Fica acima da barra de gestos do iPhone.
 */
export function BotaoWhatsApp() {
  return (
    <a
      href={linkDaConversa()}
      target="_blank"
      rel="noopener"
      aria-label={`Chamar a Visão Sul no WhatsApp, ${WHATSAPP_EXIBICAO}`}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgb(37_211_102/0.7)] transition-transform active:scale-95 md:hidden"
    >
      <IconeWhatsApp tamanho={28} />
    </a>
  );
}
