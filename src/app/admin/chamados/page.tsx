import type { Metadata } from "next";
import { ListaDeChamados } from "./lista";

export const metadata: Metadata = { title: "Chamados técnicos" };

export default function PaginaDeChamados() {
  return <ListaDeChamados />;
}
