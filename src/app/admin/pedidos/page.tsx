import type { Metadata } from "next";
import { ListaDePedidos } from "./lista";

export const metadata: Metadata = { title: "Pedidos" };

export default function PaginaDePedidos() {
  return <ListaDePedidos />;
}
