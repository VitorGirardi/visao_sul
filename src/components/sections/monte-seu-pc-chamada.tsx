import Link from "next/link";
import { GabineteIlustrado } from "@/components/ui/gabinete-ilustrado";
import { IconeSeta } from "@/components/ui/icones";
import { jogos, niveis, totalDoNivel } from "@/data/pc-gamer";
import { formatarPrecoCurto } from "@/lib/utils";

/** A chamada do montador de PC: escolha o jogo, a loja monta. */
export function MonteSeuPcChamada() {
  return (
    <section className="longe-da-tela relative overflow-hidden bg-marinho py-14 text-white md:py-32" aria-labelledby="titulo-monte-seu-pc">
      <div className="grade-de-fundo absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute -left-40 top-1/3 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(236_181_0/0.18),transparent_65%)]" aria-hidden />
      <div className="recipiente relative grid items-center gap-10 md:gap-14 lg:grid-cols-[1fr_0.9fr]">
        <div className="revelar">
          <p className="sobretitulo !text-amarelo">Monte seu PC</p>
          <h2 id="titulo-monte-seu-pc" className="titulo-2 mt-4">
            Diga o que você joga. <span className="text-amarelo [text-shadow:0_0_40px_rgb(236_181_0/0.5)]">A gente monta.</span>
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-white/70">
            Escolha os jogos, a loja indica a configuração certa, monta, testa na bancada e entrega pronta para jogar.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {jogos.slice(0, 9).map((jogo) => (
              <li key={jogo.nome}>
                <Link
                  href={`/monte-seu-pc?jogos=${encodeURIComponent(jogo.nome)}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 text-sm font-semibold text-white/80 transition-colors hover:border-amarelo hover:bg-amarelo/10 hover:text-white"
                >
                  {jogo.nome}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 md:mt-10">
            {niveis.map((n) => (
              <div key={n.id} className="rounded-2xl border border-white/12 bg-white/[0.04] p-3">
                <span className="block h-1 w-8 rounded-full" style={{ background: n.cor, boxShadow: `0 0 12px ${n.cor}` }} />
                <p className="mt-3 font-display font-semibold">{n.nome}</p>
                <p className="text-xs text-white/55">a partir de {formatarPrecoCurto(totalDoNivel(n))}</p>
              </div>
            ))}
          </div>
          <Link href="/monte-seu-pc" className="btn btn-primario mt-8 md:mt-10">
            Montar o meu
            <IconeSeta tamanho={18} />
          </Link>
        </div>
        <div className="revelar-escala flex justify-center">
          {/* menor no celular: com 78% da largura, o gabinete sozinho ocupava meia tela */}
          <GabineteIlustrado className="w-[min(48vw,26rem)] md:w-[min(56vw,26rem)]" />
        </div>
      </div>
    </section>
  );
}
