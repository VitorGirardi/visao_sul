/**
 * GERADO por `scripts/preparar-imagens.mjs`. Não edite à mão: rode o script.
 *
 * Um import estático por foto de produto (tamanho e borrão automáticos no
 * `next/image`). Produto sem foto aqui aparece com o desenho da categoria.
 */
import type { StaticImageData } from "next/image";
import foto_acer_aspire_5 from "@/fotos/produtos/acer-aspire-5.webp";
import foto_airpods_4 from "@/fotos/produtos/airpods-4.webp";
import foto_chromecast_google_tv from "@/fotos/produtos/chromecast-google-tv.webp";
import foto_dualsense_preto from "@/fotos/produtos/dualsense-preto.webp";
import foto_echo_dot_5 from "@/fotos/produtos/echo-dot-5.webp";
import foto_echo_show_5 from "@/fotos/produtos/echo-show-5.webp";
import foto_epson_ecotank_l3250 from "@/fotos/produtos/epson-ecotank-l3250.webp";
import foto_garmin_tt25 from "@/fotos/produtos/garmin-tt25.webp";
import foto_hp_15_touch from "@/fotos/produtos/hp-15-touch.webp";
import foto_hp_victus_15 from "@/fotos/produtos/hp-victus-15.webp";
import foto_hyperx_cloud_stinger_2 from "@/fotos/produtos/hyperx-cloud-stinger-2.webp";
import foto_iphone_16 from "@/fotos/produtos/iphone-16.webp";
import foto_iphone_17_pro from "@/fotos/produtos/iphone-17-pro.webp";
import foto_iphone_17 from "@/fotos/produtos/iphone-17.webp";
import foto_jbl_boombox_3 from "@/fotos/produtos/jbl-boombox-3.webp";
import foto_jbl_charge_5 from "@/fotos/produtos/jbl-charge-5.webp";
import foto_jbl_go_4 from "@/fotos/produtos/jbl-go-4.webp";
import foto_jbl_partybox_encore_essential from "@/fotos/produtos/jbl-partybox-encore-essential.webp";
import foto_logitech_driving_force_shifter from "@/fotos/produtos/logitech-driving-force-shifter.webp";
import foto_logitech_mk220 from "@/fotos/produtos/logitech-mk220.webp";
import foto_monitor_gamer_24 from "@/fotos/produtos/monitor-gamer-24.webp";
import foto_ps5_slim_digital from "@/fotos/produtos/ps5-slim-digital.webp";
import foto_toshiba_canvio_basics from "@/fotos/produtos/toshiba-canvio-basics.webp";
import foto_tp_link_deco_m4 from "@/fotos/produtos/tp-link-deco-m4.webp";
import foto_xiaomi_robot_vacuum_s20_plus from "@/fotos/produtos/xiaomi-robot-vacuum-s20-plus.webp";

export const fotosDeProduto: Record<string, StaticImageData> = {
  "acer-aspire-5": foto_acer_aspire_5,
  "airpods-4": foto_airpods_4,
  "chromecast-google-tv": foto_chromecast_google_tv,
  "dualsense-preto": foto_dualsense_preto,
  "echo-dot-5": foto_echo_dot_5,
  "echo-show-5": foto_echo_show_5,
  "epson-ecotank-l3250": foto_epson_ecotank_l3250,
  "garmin-tt25": foto_garmin_tt25,
  "hp-15-touch": foto_hp_15_touch,
  "hp-victus-15": foto_hp_victus_15,
  "hyperx-cloud-stinger-2": foto_hyperx_cloud_stinger_2,
  "iphone-16": foto_iphone_16,
  "iphone-17-pro": foto_iphone_17_pro,
  "iphone-17": foto_iphone_17,
  "jbl-boombox-3": foto_jbl_boombox_3,
  "jbl-charge-5": foto_jbl_charge_5,
  "jbl-go-4": foto_jbl_go_4,
  "jbl-partybox-encore-essential": foto_jbl_partybox_encore_essential,
  "logitech-driving-force-shifter": foto_logitech_driving_force_shifter,
  "logitech-mk220": foto_logitech_mk220,
  "monitor-gamer-24": foto_monitor_gamer_24,
  "ps5-slim-digital": foto_ps5_slim_digital,
  "toshiba-canvio-basics": foto_toshiba_canvio_basics,
  "tp-link-deco-m4": foto_tp_link_deco_m4,
  "xiaomi-robot-vacuum-s20-plus": foto_xiaomi_robot_vacuum_s20_plus,
};

/** Fotos com fundo transparente de origem (as outras vieram em fundo branco). */
export const fotosComFundoTransparente = new Set<string>(["acer-aspire-5", "airpods-4", "dualsense-preto", "echo-dot-5", "echo-show-5", "garmin-tt25", "hp-15-touch", "hp-victus-15", "hyperx-cloud-stinger-2", "iphone-16", "iphone-17-pro", "iphone-17", "jbl-boombox-3", "jbl-charge-5", "jbl-go-4", "jbl-partybox-encore-essential", "logitech-driving-force-shifter", "logitech-mk220", "monitor-gamer-24", "ps5-slim-digital", "toshiba-canvio-basics", "xiaomi-robot-vacuum-s20-plus"]);
