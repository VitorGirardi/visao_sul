/**
 * GERADO por `scripts/preparar-imagens.mjs`. Não edite à mão: rode o script.
 *
 * O segundo ângulo dos produtos que têm, para a galeria da ficha. Fica fora
 * de `fotos-de-produto.ts` de propósito: aquele mapa vai no JS da gaveta do
 * pedido (que carrega em toda página), e este só o servidor lê. Juntos, a
 * gaveta crescia 5 KB gz (13/10/2026).
 */
import type { StaticImageData } from "next/image";
import foto_acer_aspire_5_2 from "@/fotos/produtos/acer-aspire-5-2.webp";
import foto_chromecast_google_tv_2 from "@/fotos/produtos/chromecast-google-tv-2.webp";
import foto_dualsense_preto_2 from "@/fotos/produtos/dualsense-preto-2.webp";
import foto_echo_dot_5_2 from "@/fotos/produtos/echo-dot-5-2.webp";
import foto_epson_ecotank_l3250_2 from "@/fotos/produtos/epson-ecotank-l3250-2.webp";
import foto_garmin_tt25_2 from "@/fotos/produtos/garmin-tt25-2.webp";
import foto_hp_15_touch_2 from "@/fotos/produtos/hp-15-touch-2.webp";
import foto_hp_victus_15_2 from "@/fotos/produtos/hp-victus-15-2.webp";
import foto_hyperx_cloud_stinger_2_2 from "@/fotos/produtos/hyperx-cloud-stinger-2-2.webp";
import foto_jbl_boombox_3_2 from "@/fotos/produtos/jbl-boombox-3-2.webp";
import foto_jbl_go_4_2 from "@/fotos/produtos/jbl-go-4-2.webp";
import foto_jbl_partybox_encore_essential_2 from "@/fotos/produtos/jbl-partybox-encore-essential-2.webp";
import foto_logitech_driving_force_shifter_2 from "@/fotos/produtos/logitech-driving-force-shifter-2.webp";
import foto_logitech_mk220_2 from "@/fotos/produtos/logitech-mk220-2.webp";
import foto_monitor_gamer_24_2 from "@/fotos/produtos/monitor-gamer-24-2.webp";
import foto_toshiba_canvio_basics_2 from "@/fotos/produtos/toshiba-canvio-basics-2.webp";
import foto_tp_link_deco_m4_2 from "@/fotos/produtos/tp-link-deco-m4-2.webp";
import foto_xiaomi_robot_vacuum_s20_plus_2 from "@/fotos/produtos/xiaomi-robot-vacuum-s20-plus-2.webp";

/** `comFundo`: a foto manteve o branco (produto branco) e aparece num cartão claro. */
export type SegundaFoto = { foto: StaticImageData; comFundo: boolean };

export const segundasFotos: Record<string, SegundaFoto> = {
  "acer-aspire-5": { foto: foto_acer_aspire_5_2, comFundo: false },
  "chromecast-google-tv": { foto: foto_chromecast_google_tv_2, comFundo: true },
  "dualsense-preto": { foto: foto_dualsense_preto_2, comFundo: false },
  "echo-dot-5": { foto: foto_echo_dot_5_2, comFundo: false },
  "epson-ecotank-l3250": { foto: foto_epson_ecotank_l3250_2, comFundo: true },
  "garmin-tt25": { foto: foto_garmin_tt25_2, comFundo: false },
  "hp-15-touch": { foto: foto_hp_15_touch_2, comFundo: false },
  "hp-victus-15": { foto: foto_hp_victus_15_2, comFundo: false },
  "hyperx-cloud-stinger-2": { foto: foto_hyperx_cloud_stinger_2_2, comFundo: false },
  "jbl-boombox-3": { foto: foto_jbl_boombox_3_2, comFundo: false },
  "jbl-go-4": { foto: foto_jbl_go_4_2, comFundo: false },
  "jbl-partybox-encore-essential": { foto: foto_jbl_partybox_encore_essential_2, comFundo: false },
  "logitech-driving-force-shifter": { foto: foto_logitech_driving_force_shifter_2, comFundo: false },
  "logitech-mk220": { foto: foto_logitech_mk220_2, comFundo: false },
  "monitor-gamer-24": { foto: foto_monitor_gamer_24_2, comFundo: false },
  "toshiba-canvio-basics": { foto: foto_toshiba_canvio_basics_2, comFundo: false },
  "tp-link-deco-m4": { foto: foto_tp_link_deco_m4_2, comFundo: true },
  "xiaomi-robot-vacuum-s20-plus": { foto: foto_xiaomi_robot_vacuum_s20_plus_2, comFundo: false },
};
