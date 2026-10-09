/**
 * O script que aplica o tema antes da primeira pintura (vai no <head> do
 * layout raiz). Fica separado de `lib/tema.ts` porque o layout é componente
 * de servidor e não pode importar módulo com hook do React.
 */
export const CHAVE_DO_TEMA = "visao-tema";

export const SCRIPT_DO_TEMA = `(function(){try{var t=localStorage.getItem("${CHAVE_DO_TEMA}");if(t!=="claro"&&t!=="escuro")t="escuro";var h=document.documentElement;h.dataset.tema=t;h.style.colorScheme=t==="claro"?"light":"dark";}catch(e){}})();`;
