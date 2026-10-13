import type { Metadata } from "next";
import { ListaDeProdutos } from "./lista";

export const metadata: Metadata = { title: "Produtos" };

export default function PaginaDeProdutos() {
  return <ListaDeProdutos />;
}
