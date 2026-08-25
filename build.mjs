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
  /* Banco de questões: o sorteio declara a distribuição de dificuldade, e o
     banco precisa ter com que atendê-la. Sem esta checagem o motor cai no
     fallback e aplica uma questão fora do nível pedido — em silêncio, que é o
     pior jeito de a dificuldade declarada deixar de ser verdade. */
  if (m.sorteio != null) {
    const plano = m.sorteio.dificuldades;
    if (!Array.isArray(plano) || !plano.length)
      erros.push(`sorteio sem lista "dificuldades": ${m.missao_id}`);
    else if (plano.some(d => ![1,2,3].includes(d)))
      erros.push(`sorteio com dificuldade fora de 1-3: ${m.missao_id}`);
    else for (const d of new Set(plano)) {
      const pedidas = plano.filter(x => x === d).length;
      const temNoBanco = m.questoes.filter(q => q.dificuldade === d).length;
      if (temNoBanco < pedidas)
        erros.push(`banco insuficiente em ${m.missao_id}: o sorteio pede ${pedidas} de dificuldade ${d} e o banco tem ${temNoBanco}`);
    }
  }
  for (const q of m.questoes) {
    if (ids.has(q.questao_id)) erros.push(`questao_id duplicado: ${q.questao_id}`);
    ids.add(q.questao_id);
    if (q.correta == null || !q.alternativas[q.correta]) erros.push(`gabarito inválido: ${q.questao_id}`);
    if (!q.dica || !q.explicacao) erros.push(`sem dica ou explicação: ${q.questao_id}`);
    if (![1,2,3].includes(q.dificuldade)) erros.push(`dificuldade fora de 1-3: ${q.questao_id}`);
    if (q.passos != null && (!Array.isArray(q.passos) || !q.passos.length))
      erros.push(`passos vazios ou malformados: ${q.questao_id}`);
    if (q.alternativas_fixas != null && typeof q.alternativas_fixas !== 'boolean')
      erros.push(`alternativas_fixas precisa ser booleano: ${q.questao_id}`);
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
/* Gabarito decorável só é risco onde a ordem das alternativas é fixa: o motor
   embaralha as demais a cada abertura, então balancear aquelas à mão não
   significa nada. A checagem passou a olhar só as questões protegidas por
   `alternativas_fixas`, e só quando há amostra para a conta valer. */
const fixas = prova.missoes.flatMap(m => m.questoes.filter(q => q.alternativas_fixas));
if (fixas.length >= 5) {
  const dist = [0,0,0,0];
  fixas.forEach(q => dist[q.correta]++);
  if (Math.max(...dist) > fixas.length * 0.4)
    erros.push(`gabarito desbalanceado nas questões de ordem fixa: ${dist.join('/')} (A/B/C/D)`);
}

if (erros.length) { console.error('Build abortado:\n- ' + erros.join('\n- ')); process.exit(1); }

// --- injeção ---
/* `<` vira <: o JSON da prova contém HTML de propósito (regra, aula), e um
   `</script>` dentro de qualquer string fecharia a tag cedo e transformaria o
   resto do conteúdo em HTML executável. Só nós escrevemos provas, então não é
   porta de entrada externa — é armadilha para nós mesmos no dia em que uma
   questão precisar falar sobre a tag. O JSON.parse desfaz o escape sozinho. */
const dados = JSON.stringify(prova).replace(/</g, '\\u003c');
const payload = `<script id="prova-data" type="application/json">\n${dados}\n</script>`;
let out = motor.replace('</head>', payload + '\n</head>');
const tituloSeguro = prova.titulo.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
out = out.replace(/<title>.*?<\/title>/, `<title>${tituloSeguro}</title>`);

// A URL do Apps Script é segredo de deploy, não de repositório.
const sheetUrl = (process.env.SHEET_URL || '').trim();
if (sheetUrl && !/^https:\/\/script\.google\.com\/.*\/exec$/.test(sheetUrl)) {
  /* NUNCA imprimir o valor: este build roda no Actions de um repositório
     público, e log de Action de repo público é público. Ecoar a URL no erro
     imprimiria o segredo no exato cenário em que ele veio meio-quebrado
     (espaço no fim, colagem dupla) — ou seja, quando ele ainda é a URL real. */
  console.error(`SHEET_URL definida mas não é uma URL /exec do Apps Script (host script.google.com). Valor omitido do log de propósito — confira o secret. (${sheetUrl.length} caracteres)`);
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
const banco = prova.missoes.flatMap(m => m.questoes);
const aplicadas = prova.missoes.reduce((a, m) => a + (m.sorteio?.dificuldades?.length || m.questoes.length), 0);
console.log(`    ${prova.missoes.length} missões · ${aplicadas} questões por sessão, sorteadas de um banco de ${banco.length}`);
console.log(`    dificuldade média do banco ${(banco.reduce((a,q)=>a+q.dificuldade,0)/banco.length).toFixed(2)}`);
console.log(`    alternativas embaralhadas em ${banco.filter(q=>!q.alternativas_fixas).length} de ${banco.length} questões`);
console.log(sheetUrl
  ? '    envio para a planilha: ATIVO'
  : '    envio para a planilha: DESLIGADO (sem SHEET_URL) — fila local + botão "Copiar resultados"');
