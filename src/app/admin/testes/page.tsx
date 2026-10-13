import type { Metadata } from "next";
import { AgendaDeTestes } from "./agenda";

export const metadata: Metadata = { title: "Testes grátis" };

export default function PaginaDeTestes() {
  return <AgendaDeTestes />;
}
