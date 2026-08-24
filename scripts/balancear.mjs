import fs from 'fs';
const P='data/provas/2026-08-matematica-y5.json';
const prova=JSON.parse(fs.readFileSync(P,'utf8'));

// distribui as respostas certas entre A/B/C/D trocando de lugar (nenhum distrator é perdido)
const uso=[0,0,0,0];
for(const m of prova.missoes) for(const q of m.questoes){
  const alvo=uso.indexOf(Math.min(...uso));
  const o=q.alternativas, c=q.correta;
  [o[alvo],o[c]]=[o[c],o[alvo]];
  q.correta=alvo; uso[alvo]++;
}
fs.writeFileSync(P,JSON.stringify(prova,null,2));
console.log('novo gabarito A/B/C/D:',uso.join('/'));

// aplica a mesma permutação no HTML que a Alícia usa hoje
const F='/mnt/user-data/outputs/missao_matematica_alicia.html';
let html=fs.readFileSync(F,'utf8');
const i0=html.indexOf('const modules = '), i1=html.indexOf('\n];',i0);
const chartSVG=()=>'{{GRAFICO_LIVROS}}';
const modules=eval(html.slice(i0+'const modules = '.length,i1)+'\n]');

const porId={}; prova.missoes.forEach(m=>porId[m.missao_id]=m);
for(const mod of modules){
  const alvo=porId[mod.id];
  mod.qs.forEach((q,i)=>{q.opts=[...alvo.questoes[i].alternativas];q.a=alvo.questoes[i].correta;});
}
let bloco=JSON.stringify(modules,null,1).replace(/"\{\{GRAFICO_LIVROS\}\}"/g,'chartSVG(false)');
html=html.slice(0,i0)+'const modules = '+bloco+html.slice(i1+3);
fs.writeFileSync(F,html);
console.log('HTML atualizado.');
