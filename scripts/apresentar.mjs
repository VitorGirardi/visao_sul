/**
 * Sobe o site para a apresentação (13/10/2026): o build de produção servido
 * no notebook e aberto na rede Wi-Fi, para abrir no celular sem publicar
 * nada. Roteiro da reunião em `docs/apresentacao.md`.
 *
 *   npm run apresentar
 *
 * Mostra os endereços (no notebook e na rede) e para onde vão as mensagens
 * do WhatsApp: a loja, ou o número de teste do `.env.local`
 * (`WHATSAPP_DE_TESTE=55DDDNUMERO`). O `npm run apresentar` já faz o build
 * antes; não rode com o `npm run dev` no ar nesta pasta.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const PORTA = process.env.PORTA ?? "3110";

/** O mesmo número que a rota `/whatsapp` vai ler: ambiente primeiro, depois o `.env.local`. */
function numeroDeTeste() {
  if (process.env.WHATSAPP_DE_TESTE) return process.env.WHATSAPP_DE_TESTE;
  const arquivo = path.join(RAIZ, ".env.local");
  if (!fs.existsSync(arquivo)) return "";
  const linha = fs.readFileSync(arquivo, "utf8").split(/\r?\n/).find((l) => /^\s*WHATSAPP_DE_TESTE\s*=/.test(l));
  return linha ? linha.split("=")[1].trim().replace(/^["']|["']$/g, "") : "";
}

const teste = numeroDeTeste().replace(/\D/g, "");
const naRede = Object.values(os.networkInterfaces())
  .flat()
  .filter((i) => i && i.family === "IPv4" && !i.internal)
  .map((i) => `http://${i.address}:${PORTA}`);

console.log("\n  Visão Sul, modo apresentação\n");
console.log(`  No notebook:  http://localhost:${PORTA}`);
for (const endereco of naRede) console.log(`  No celular:   ${endereco}   (mesma rede Wi-Fi)`);
console.log(
  /^55\d{10,11}$/.test(teste)
    ? `\n  WhatsApp: TESTE, as mensagens vão para ${teste}.\n  Para a reunião, apague WHATSAPP_DE_TESTE do .env.local e rode de novo.\n`
    : `\n  WhatsApp: as mensagens vão para a LOJA, (54) 99983-5707.\n`,
);

const servidor = spawn(process.execPath, [path.join(RAIZ, "node_modules/next/dist/bin/next"), "start", "-p", PORTA, "-H", "0.0.0.0"], {
  cwd: RAIZ,
  stdio: "inherit",
});
servidor.on("exit", (codigo) => process.exit(codigo ?? 0));
