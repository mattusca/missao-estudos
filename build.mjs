#!/usr/bin/env node
/**
 * Injeta o JSON de uma prova no motor e escreve o HTML final em docs/.
 * Uso: node build.mjs <prova_id>
 */
import fs from 'fs';
import path from 'path';

const provaId = process.argv[2];
if (!provaId) {
  const disp = fs.readdirSync('data/provas').map(f => f.replace('.json',''));
  console.error('Uso: node build.mjs <prova_id>\nDisponíveis:\n  ' + disp.join('\n  '));
  process.exit(1);
}

const provaPath = path.join('data/provas', provaId + '.json');
if (!fs.existsSync(provaPath)) { console.error('Não encontrei ' + provaPath); process.exit(1); }

const prova   = JSON.parse(fs.readFileSync(provaPath, 'utf8'));
const catalogo = JSON.parse(fs.readFileSync('data/catalogo-temas.json', 'utf8'));
const motor   = fs.readFileSync('src/motor.html', 'utf8');

// --- validações que evitam publicar uma prova quebrada ---
const erros = [];
const ids = new Set();
// ferramentas que este motor sabe desenhar, lidas do próprio motor
const ferramentas = new Set([...motor.matchAll(/^tools\.(\w+)\s*=\s*\(/gm)].map(m => m[1]));

/* Vocabulário morto do protótipo monolítico. Um nome desses sobrevivendo a uma
   renomeação não dá erro: vira `undefined` silencioso. Foi assim que
   `missoes[i-1].id` manteve as 7 missões trancadas depois da primeira.
   Só olhamos acessos nas variáveis que carregam missão/questão — `.tool` e
   `.lesson` também são nomes de classe CSS, e `.after()` é método do DOM. */
const MORTOS = 'id|qs|opts|icon|subtitle|tool|lesson|after|why|dica_|a';
const ALVOS = new RegExp(String.raw`(?:\b[mqx]|missoes\[[^\]]*\]|questoes\[[^\]]*\])\.(${MORTOS})\b`, 'g');
for (const [n, linha] of motor.split('\n').entries()) {
  if (/^\s*(\/\*|\*|\/\/)/.test(linha)) continue;                 // comentário não é código
  for (const achado of linha.matchAll(ALVOS))
    erros.push(`motor.html:${n + 1} usa campo extinto "${achado[0]}" (o vocabulário é o do JSON): ${linha.trim().slice(0, 60)}`);
}

// metadados que viram coluna na planilha: se faltar um, a linha nasce torta
for (const campo of ['prova_id','titulo','materia','escola','ano_aluna','nivel_conteudo','bimestre','contexto'])
  if (!prova[campo]) erros.push(`metadado obrigatório ausente: ${campo}`);
// quem pode estar usando este artefato — vira a coluna `aluna` de cada linha
if (!Array.isArray(prova.alunas) || !prova.alunas.length)
  erros.push('`alunas` precisa ser uma lista com ao menos um nome');
else if (new Set(prova.alunas).size !== prova.alunas.length)
  erros.push('`alunas` tem nome repetido — viraria duas pessoas diferentes no log');
if (prova.contexto && !['prova','revisao_espacada','treino_livre'].includes(prova.contexto))
  erros.push(`contexto inválido: ${prova.contexto}`);
for (const m of prova.missoes) {
  if (!catalogo.find(t => t.tema_id === m.tema_id))
    erros.push(`tema_id fora do catálogo: ${m.tema_id}`);
  if (!m.ferramenta) erros.push(`missão sem ferramenta manipulável: ${m.missao_id}`);
  else if (!ferramentas.has(m.ferramenta))
    erros.push(`ferramenta "${m.ferramenta}" não existe no motor (tem: ${[...ferramentas].join(', ')})`);
  // o cartão de regra é acomodação, não enfeite: sem texto ele some da tela
  if (!m.regra || !String(m.regra).trim())
    erros.push(`missão sem regra para o cartão fixo: ${m.missao_id}`);
  for (const q of m.questoes) {
    if (ids.has(q.questao_id)) erros.push(`questao_id duplicado: ${q.questao_id}`);
    ids.add(q.questao_id);
    if (q.correta == null || !q.alternativas[q.correta]) erros.push(`gabarito inválido: ${q.questao_id}`);
    if (!q.dica || !q.explicacao) erros.push(`sem dica ou explicação: ${q.questao_id}`);
    if (![1,2,3].includes(q.dificuldade)) erros.push(`dificuldade fora de 1-3: ${q.questao_id}`);
    if (q.passos != null && (!Array.isArray(q.passos) || !q.passos.length))
      erros.push(`passos vazios ou malformados: ${q.questao_id}`);
    if (q.figura != null) {
      const f = q.figura;
      if (typeof f !== 'object') erros.push(`figura deve ser objeto tipado: ${q.questao_id}`);
      else if (f.tipo === 'barras' && f.fonte === 'missao' && !m.dados?.serie?.length)
        erros.push(`figura barras sem missao.dados.serie: ${q.questao_id}`);
      else if (f.tipo === 'svg' && !f.conteudo)
        erros.push(`figura svg sem conteúdo: ${q.questao_id}`);
      else if (!['barras','svg'].includes(f.tipo))
        erros.push(`tipo de figura desconhecido "${f.tipo}": ${q.questao_id}`);
    }
  }
}
// gabarito não pode ter padrão decorável
const dist = [0,0,0,0];
prova.missoes.forEach(m => m.questoes.forEach(q => dist[q.correta]++));
const total = dist.reduce((a,b) => a+b, 0);
if (Math.max(...dist) > total * 0.4)
  erros.push(`gabarito desbalanceado: ${dist.join('/')} (A/B/C/D)`);

if (erros.length) { console.error('Build abortado:\n- ' + erros.join('\n- ')); process.exit(1); }

// --- injeção ---
const payload = `<script id="prova-data" type="application/json">\n${JSON.stringify(prova)}\n</script>`;
let out = motor.replace('</head>', payload + '\n</head>');
out = out.replace(/<title>.*?<\/title>/, `<title>${prova.titulo}</title>`);

// A URL do Apps Script é segredo de deploy, não de repositório.
const sheetUrl = (process.env.SHEET_URL || '').trim();
if (sheetUrl && !/^https:\/\/script\.google\.com\/.*\/exec$/.test(sheetUrl)) {
  console.error(`SHEET_URL não parece uma URL /exec do Apps Script: ${sheetUrl}`);
  process.exit(1);
}
if (!out.includes("'__SHEET_URL__'")) {
  console.error('Não encontrei o marcador __SHEET_URL__ no motor.'); process.exit(1);
}
out = out.replace("'__SHEET_URL__'", JSON.stringify(sheetUrl));

fs.mkdirSync('docs', { recursive: true });
const dest = path.join('docs', provaId + '.html');
fs.writeFileSync(dest, out);

/* O Pages serve isto abertamente e a página fala o nome de uma criança.
   Quem tem o link acessa; buscador não indexa. Gerado aqui e não mantido à mão
   porque docs/ é saída de build, não pasta de trabalho. */
fs.writeFileSync(path.join('docs', 'robots.txt'), 'User-agent: *\nDisallow: /\n');

/* Índice das provas geradas, para a raiz do Pages não ser um 404. */
const publicadas = fs.readdirSync('docs').filter(f => f.endsWith('.html') && f !== 'index.html').sort();
fs.writeFileSync(path.join('docs', 'index.html'),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Missão Estudos</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:60px auto;padding:0 20px;color:#17324a;line-height:1.6}
a{color:#2fae94}li{margin:6px 0}</style></head><body>
<h1>Missão Estudos</h1><p>Revisões publicadas:</p><ul>
${publicadas.map(f => `<li><a href="${f}">${f.replace('.html', '')}</a></li>`).join('\n')}
</ul></body></html>\n`);

console.log(`OK  ${dest}`);
console.log(`    ${prova.missoes.length} missões · ${total} questões · gabarito A/B/C/D = ${dist.join('/')}`);
console.log(`    dificuldade média ${(prova.missoes.flatMap(m=>m.questoes).reduce((a,q)=>a+q.dificuldade,0)/total).toFixed(2)}`);
console.log(sheetUrl
  ? '    envio para a planilha: ATIVO'
  : '    envio para a planilha: DESLIGADO (sem SHEET_URL) — fila local + botão "Copiar resultados"');
