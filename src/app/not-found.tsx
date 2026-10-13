import Link from "next/link";
import { Marca } from "@/components/layout/marca";

/** 404: o olho procurou e não achou. */
export default function NaoEncontrada() {
  return (
    // o id é o destino do "pular para o conteúdo" do layout raiz
    <main id="conteudo" className="relative grid min-h-svh place-items-center overflow-hidden px-6 text-center">
      <div className="grade-de-fundo absolute inset-0 opacity-60" aria-hidden />
      <div className="relative">
        <Marca arranjo="simbolo" titulo="" className="mx-auto w-28 drop-shadow-[0_0_30px_rgb(236_181_0/0.5)]" />
        <p className="sobretitulo mt-10 justify-center">Erro 404</p>
        <h1 className="titulo-1 mt-4">
          Nem o nosso olho <span className="acende">achou.</span>
        </h1>
        <p className="texto-grande mx-auto mt-5 max-w-md">Essa página não existe (ou mudou de lugar). Volta para a loja que a gente te ajuda.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primario">
            Página inicial
          </Link>
          <Link href="/produtos" className="btn btn-contorno">
            Ver produtos
          </Link>
        </div>
      </div>
    </main>
  );
}
