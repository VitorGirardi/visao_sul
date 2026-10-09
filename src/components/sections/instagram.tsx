import Image, { type StaticImageData } from "next/image";
import { IconeInstagram } from "@/components/ui/icones";
import { INSTAGRAM } from "@/data/contato";
import entregaPs5 from "@/fotos/instagram/entrega-ps5.webp";
import hpVictus from "@/fotos/instagram/hp-victus.webp";
import jblBoombox from "@/fotos/instagram/jbl-boombox.webp";
import notebookEntregue from "@/fotos/instagram/notebook-entregue.webp";
import pastaTermica from "@/fotos/instagram/pasta-termica.webp";
import xiaomiS20 from "@/fotos/instagram/xiaomi-s20.webp";

/** Posts da própria loja (o feed de verdade entra quando houver a API do Instagram). */
const posts: [StaticImageData, string][] = [
  [entregaPs5, "Entrega de um PS5 à noite: cliente ansioso esperando o novo brinquedo"],
  [hpVictus, "Arte do HP Victus com a ficha técnica"],
  [pastaTermica, "Placa de notebook com pasta térmica aplicada errado"],
  [jblBoombox, "Arte da JBL Boombox 3"],
  [notebookEntregue, "Notebook HP entregue configurado com Windows 11"],
  [xiaomiS20, "Arte do robô aspirador Xiaomi S20+"],
];

export function Instagram() {
  return (
    <section className="py-24 md:py-28" aria-labelledby="titulo-instagram">
      <div className="recipiente">
        <div className="revelar flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="sobretitulo">No Instagram</p>
            <h2 id="titulo-instagram" className="titulo-2 mt-4">
              Acompanhe as <span className="acende">novidades</span>
            </h2>
          </div>
          <a href={INSTAGRAM.href} target="_blank" rel="noopener" className="btn btn-contorno">
            <IconeInstagram tamanho={18} />
            {INSTAGRAM.usuario}
          </a>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {posts.map(([foto, descricao]) => (
            <li key={foto.src} className="revelar-escala">
              <a
                href={INSTAGRAM.href}
                target="_blank"
                rel="noopener"
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-linha"
              >
                <Image src={foto} alt={descricao} fill sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 grid place-items-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <IconeInstagram tamanho={28} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
