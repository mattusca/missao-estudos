#!/usr/bin/env node
/**
 * Preview local do dashboard dos pais com DADOS SINTÉTICOS.
 *
 *   node scripts/preview-dash.mjs [pasta-saida]           # só gera os arquivos
 *   node scripts/preview-dash.mjs [pasta-saida] --servir  # gera e serve em :4174
 *
 * Por que existe: o dashboard de verdade é servido pelo Apps Script, que injeta
 * as linhas da planilha no <script id="dash-data">. Este script injeta um
 * cenário inventado no MESMO placeholder, para dar para ver e mexer no visual
 * sem implantar nada. Os dados cobrem os quatro estados do card (firme,
 * atenção, frágil e "ainda não sei") e incluem linhas "Marco (teste)" que o
 * dash DEVE ignorar — se aparecer um Marco na tela, o filtro quebrou.
 *
 * A saída NUNCA vai para docs/: o preview usa nomes das meninas e docs/ é
 * público no Pages.
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import http from 'http';

const RAIZ = path.resolve(process.argv[2] && !process.argv[2].startsWith('--')
  ? process.argv[2]
  : path.join(os.tmpdir(), 'missao-dash-preview'));
const SERVIR = process.argv.includes('--servir');

// ---------- cenário sintético ----------
let semente = 20260824;
const rnd = () => { // determinístico: mesmo preview a cada rodada
  semente = (semente * 1103515245 + 12345) % 2147483648;
  return semente / 2147483648;
};

const eventos = [];
let nEvento = 0;

/** Gera as questões de um tema para uma aluna, sessão a sessão. */
function tema(aluna, materia, tema_id, subtema, sessoes, taxaSemApoio, dificuldades) {
  for (let s = 0; s < sessoes.length; s++) {
    const [dia, nQuestoes] = sessoes[s];
    const sessao_id = `prev_${aluna.slice(0, 3)}_${dia}`;
    for (let q = 0; q < nQuestoes; q++) {
      const limpo = rnd() < taxaSemApoio;
      const comDica = !limpo && rnd() < 0.5;
      eventos.push({
        aluna, materia, tema_id, subtema, sessao_id,
        timestamp: new Date(Date.UTC(2026, 7, dia, 14, q * 3)).toISOString(),
        resultado: limpo ? 'acerto_1a' : (rnd() < 0.6 ? 'acerto_2a' : (rnd() < 0.5 ? 'acerto_1a' : 'erro')),
        usou_dica: comDica ? 'sim' : 'nao',
        usou_andaime: !limpo && !comDica && rnd() < 0.6 ? 'sim' : 'nao',
        dificuldade: dificuldades[Math.floor(rnd() * dificuldades.length)],
        contexto: s === sessoes.length - 1 ? 'prova' : 'revisao_espacada',
      });
      nEvento++;
    }
  }
}

// Alícia — os quatro estados
tema('Alicia', 'Matemática', 'MAT.NUM.FRA', 'Frações equivalentes',
  [[3, 3], [8, 3], [15, 3], [22, 3]], 0.92, [1, 2, 2, 3]);          // firme
tema('Alicia', 'Matemática', 'MAT.NUM.DEC', 'Números decimais',
  [[5, 4], [12, 4], [20, 3]], 0.72, [1, 2, 2]);                     // atenção
tema('Alicia', 'Matemática', 'MAT.GEO.AREAPER', 'Área e perímetro',
  [[5, 3], [12, 4], [20, 3]], 0.42, [1, 1, 2]);                     // frágil
tema('Alicia', 'Matemática', 'MAT.EST.GRAF', 'Gráficos de barras',
  [[15, 3], [22, 3]], 0.8, [1, 2]);                                 // ainda não sei

// Manuela — começando agora: tudo "ainda não sei"
tema('Manuela', 'Português', 'POR.LEI.INTERP', 'Interpretação de texto',
  [[22, 3]], 0.66, [1, 1, 2]);

// Marco (teste) — NÃO pode aparecer na tela
tema('Marco (teste)', 'Matemática', 'MAT.NUM.FRA', 'Frações equivalentes',
  [[1, 5]], 1.0, [1, 2, 3]);

// ---------- injeção no mesmo placeholder do Apps Script ----------
const motor = fs.readFileSync(path.resolve('apps-script/dashboard.html'), 'utf8');
const MARCADOR = '<?!= dadosJson ?>';
if (!motor.includes(MARCADOR)) {
  console.error('Não encontrei o marcador do template no dashboard.html.');
  process.exit(1);
}
const injetar = dados => motor.replace(MARCADOR, JSON.stringify(dados).replace(/</g, '\\u003c'));

fs.mkdirSync(RAIZ, { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'dash-preview.html'), injetar(eventos));
fs.writeFileSync(path.join(RAIZ, 'dash-preview-vazio.html'), injetar([]));
console.log(`OK  ${nEvento} eventos sintéticos (Alicia, Manuela e um teste a filtrar)`);
console.log(`    ${path.join(RAIZ, 'dash-preview.html')}`);
console.log(`    ${path.join(RAIZ, 'dash-preview-vazio.html')}`);

// ---------- servidor opcional ----------
if (SERVIR) {
  const PORTA = 4174;
  http.createServer((req, res) => {
    const alvo = path.resolve(RAIZ, '.' + decodeURIComponent(req.url.split('?')[0]));
    // separador no fim: startsWith cru aceitaria um diretório irmão de mesmo prefixo
    if (alvo !== RAIZ && !alvo.startsWith(RAIZ + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(alvo.endsWith(path.sep) || alvo === RAIZ ? path.join(RAIZ, 'dash-preview.html') : alvo, (erro, dados) => {
      if (erro) { res.writeHead(404); return res.end('404'); }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(dados);
    });
  // só loopback: preview é ferramenta de mesa, não serviço de rede
  }).listen(PORTA, '127.0.0.1', () => {
    console.log(`    http://localhost:${PORTA}/dash-preview.html`);
    console.log(`    http://localhost:${PORTA}/dash-preview-vazio.html`);
    console.log('Ctrl+C para parar.');
  });
}
