/* Gera todas as páginas publicáveis: cada JSON de data/provas E cada rota de
   data/publication-routes.json (nomes antigos que continuam servindo conteúdo
   atual). O workflow do Pages e o teste da sequência usam este mesmo script,
   para um endereço já compartilhado nunca virar 404 por esquecimento. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const provas = fs.readdirSync('data/provas').filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
const rotas = Object.keys(JSON.parse(fs.readFileSync('data/publication-routes.json', 'utf8')));
const nomes = [...new Set([...provas, ...rotas])].sort();
for (const nome of nomes) {
  execFileSync(process.execPath, ['build.mjs', nome], { stdio: 'inherit' });
}
console.log(`build-all: ${nomes.length} páginas (${provas.length} provas + ${rotas.filter(r => !provas.includes(r)).length} rotas)`);
