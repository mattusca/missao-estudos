#!/usr/bin/env node
/**
 * Servidor estático de docs/, só para teste local. Node puro, zero dependências.
 *
 *   node scripts/servir.mjs            # http://localhost:4173
 *   node scripts/servir.mjs 8080
 *
 * Por que não abrir o HTML direto: em file:// o Chrome bloqueia o localStorage,
 * então a retomada não pode ser testada — e retomada é justamente o que mais
 * quebra. O envio à planilha também exige origem http(s).
 */
import http from 'http';
import fs from 'fs';
import path from 'path';

const RAIZ = path.resolve('docs');
const PORTA = Number(process.argv[2]) || 4173;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8' };

if (!fs.existsSync(RAIZ)) {
  console.error('docs/ não existe. Rode "node build.mjs <prova_id>" antes.');
  process.exit(1);
}

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const alvo = path.resolve(RAIZ, '.' + url);
  if (!alvo.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
  fs.readFile(alvo, (erro, dados) => {
    if (erro) {
      const provas = fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404</h1><ul>' + provas.map(p => `<li><a href="/${p}">${p}</a></li>`).join('') + '</ul>');
    }
    // sem cache: senão o build novo não aparece e você depura o arquivo velho
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(alvo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(dados);
  });
}).listen(PORTA, () => {
  const provas = fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'));
  console.log(`docs/ em http://localhost:${PORTA}`);
  provas.forEach(p => console.log(`  http://localhost:${PORTA}/${p}`));
  console.log('Ctrl+C para parar.');
});
