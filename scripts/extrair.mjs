import fs from 'fs';
const html = fs.readFileSync('/mnt/user-data/outputs/missao_matematica_alicia.html','utf8');
const i0 = html.indexOf('const modules = ');
const i1 = html.indexOf('\n];', i0);
const src = html.slice(i0 + 'const modules = '.length, i1) + '\n]';
const chartSVG = () => '{{GRAFICO_LIVROS}}';
const modules = eval(src);

// mapeamento tema -> taxonomia (BNCC a conferir com a escola)
const TAX = {
  valor:   {eixo:'Números', tema_id:'MAT.NUM.DEC',  subtema:'Valor posicional, leitura e comparação', bncc:'EF05MA02'},
  fracao:  {eixo:'Números', tema_id:'MAT.NUM.FRA',  subtema:'Conversão fração ↔ decimal',            bncc:'EF05MA03'},
  virgula: {eixo:'Números', tema_id:'MAT.NUM.MUL10',subtema:'Multiplicação por 10, 100 e 1000',       bncc:'EF05MA07'},
  contas:  {eixo:'Números', tema_id:'MAT.NUM.OPDEC',subtema:'Operações com decimais e problemas',     bncc:'EF05MA08'},
  prob:    {eixo:'Probabilidade e Estatística', tema_id:'MAT.PROB.SIMPLES', subtema:'Probabilidade simples', bncc:'EF05MA22'},
  area:    {eixo:'Grandezas e Medidas', tema_id:'MAT.GEO.AREAPER', subtema:'Área e perímetro',        bncc:'EF05MA19'},
  grafico: {eixo:'Probabilidade e Estatística', tema_id:'MAT.EST.GRAF', subtema:'Leitura e interpretação de gráficos', bncc:'EF05MA25'}
};
// dificuldade declarada e tipo de raciocínio, por questão (id do módulo + índice)
const META = {
 'valor-0':[1,'conceitual'],'valor-1':[2,'procedimental'],'valor-2':[3,'conceitual'],
 'fracao-0':[2,'procedimental'],'fracao-1':[2,'procedimental'],'fracao-2':[3,'conceitual'],
 'virgula-0':[1,'procedimental'],'virgula-1':[2,'conceitual'],'virgula-2':[3,'multi-etapa'],
 'contas-0':[2,'procedimental'],'contas-1':[1,'procedimental'],'contas-2':[3,'multi-etapa'],
 'prob-0':[1,'conceitual'],'prob-1':[2,'conceitual'],'prob-2':[2,'procedimental'],
 'area-0':[3,'multi-etapa'],'area-1':[2,'conceitual'],'area-2':[3,'multi-etapa'],
 'grafico-0':[1,'interpretacao'],'grafico-1':[2,'interpretacao'],'grafico-2':[3,'multi-etapa']
};

const ordem = [...modules].reverse();   // ordem atual do app
const prova = {
  prova_id:'2026-08-MAT-Y5',
  titulo:'Missão Matemática — revisão prova 24/08',
  materia:'Matemática',
  escola:'Pueri Domus',
  ano_aluna:'Y5',
  nivel_conteudo:'Y5',
  bimestre:'3',
  contexto:'prova',
  criado_em:'2026-08-24',
  origem:'Roteiro da professora (foto) + livro Unique/Conexia Year 5',
  missoes: ordem.map(m => {
    const t = TAX[m.id];
    return {
      missao_id:m.id, icone:m.icon, titulo:m.title, subtitulo:m.subtitle,
      eixo:t.eixo, tema_id:t.tema_id, subtema:t.subtema, habilidade_bncc:t.bncc,
      ferramenta:m.tool, regra:null,
      aula:{corpo:m.lesson, fechamento:m.after||null},
      questoes:m.qs.map((q,i)=>({
        questao_id:`${t.tema_id}.Q${i+1}`,
        enunciado:q.q, figura:q.figure||null,
        alternativas:q.opts, correta:q.a,
        dificuldade:META[`${m.id}-${i}`][0], tipo_raciocinio:META[`${m.id}-${i}`][1],
        dica:q.dica, explicacao:q.why
      }))
    };
  })
};
fs.writeFileSync('data/provas/2026-08-matematica-y5.json', JSON.stringify(prova,null,2));

const temas = Object.entries(TAX).map(([k,v])=>({
  tema_id:v.tema_id, materia:'Matemática', eixo:v.eixo, tema:modules.find(m=>m.id===k).title,
  subtema:v.subtema, habilidade_bncc:v.bncc, nivel_conteudo:'Y5', bncc_conferida:false
}));
fs.writeFileSync('data/catalogo-temas.json', JSON.stringify(temas,null,2));
console.log('missões:',prova.missoes.length,'| questões:',prova.missoes.reduce((a,m)=>a+m.questoes.length,0));
console.log('ordem:',prova.missoes.map(m=>m.tema_id).join(' → '));
