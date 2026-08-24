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
for (const m of prova.missoes) {
  if (!catalogo.find(t => t.tema_id === m.tema_id))
    erros.push(`tema_id fora do catálogo: ${m.tema_id}`);
  if (!m.ferramenta) erros.push(`missão sem ferramenta manipulável: ${m.missao_id}`);
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

fs.mkdirSync('docs', { recursive: true });
const dest = path.join('docs', provaId + '.html');
fs.writeFileSync(dest, out);

console.log(`OK  ${dest}`);
console.log(`    ${prova.missoes.length} missões · ${total} questões · gabarito A/B/C/D = ${dist.join('/')}`);
console.log(`    dificuldade média ${(prova.missoes.flatMap(m=>m.questoes).reduce((a,q)=>a+q.dificuldade,0)/total).toFixed(2)}`);
