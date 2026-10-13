import type { Metadata } from "next";
import { pedidoQueChega, pedidosDeExemplo } from "@/data/amostra-do-painel";
import { PedidoPorDentro } from "./pedido";

/** Uma página por pedido de exemplo, pronta no build (mais o 0043, que chega na demonstração). */
export function generateStaticParams() {
  return [...pedidosDeExemplo, pedidoQueChega].map((p) => ({ numero: p.numero }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/admin/pedidos/[numero]">): Promise<Metadata> {
  const { numero } = await params;
  return { title: `Pedido ${numero}` };
}

export default async function PaginaDoPedido({ params }: PageProps<"/admin/pedidos/[numero]">) {
  const { numero } = await params;
  return <PedidoPorDentro numero={numero} />;
}
