import type { Metadata } from "next";
import { Suspense } from "react";
import { MontadorDePc } from "@/components/ui/montador-de-pc";

export const metadata: Metadata = {
  title: "Monte seu PC gamer",
  description: "Escolha os jogos, a Visão Sul indica a configuração, monta, testa na bancada e entrega pronto para jogar. Tapejara/RS.",
  alternates: { canonical: "/monte-seu-pc" },
};

export default function PaginaMonteSeuPc() {
  return (
    <div className="recipiente pb-28 pt-28 md:pt-36">
      <div className="max-w-3xl">
        <p className="sobretitulo">Monte seu PC</p>
        <h1 className="titulo-1 mt-4">
          Diga o que você joga. <span className="acende">A gente monta.</span>
        </h1>
        <p className="texto-grande mt-6 max-w-[48ch]">
          Marque os jogos, veja a configuração indicada e escolha a cor da luz. A loja monta, testa na bancada e entrega pronto.
        </p>
      </div>
      <div className="mt-12">
        <Suspense fallback={<div className="aspect-[2/1] animate-pulse rounded-squircle bg-fundo-2" />}>
          <MontadorDePc />
        </Suspense>
      </div>
    </div>
  );
}
