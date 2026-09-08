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

// Mantém endereços já compartilhados sem duplicar o conteúdo de uma prova.
// O arquivo original continua disponível como fonte histórica; a rota pública
// recebe o conteúdo atual, inclusive seu próprio prova_id e progresso.
const rotasPublicacao = JSON.parse(fs.readFileSync('data/publication-routes.json','utf8'));
if (!rotasPublicacao || typeof rotasPublicacao !== 'object' || Array.isArray(rotasPublicacao))
  throw new Error('publication-routes.json precisa ser um mapa de arquivos');
for (const [rota, fonte] of Object.entries(rotasPublicacao)) {
  if (![rota,fonte].every(v=>typeof v==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(v)) ||
      Object.hasOwn(rotasPublicacao,fonte) ||
      !fs.existsSync(path.join('data/provas',fonte+'.json')))
    throw new Error('Rota de publicação inválida: '+rota);
}
const fontePublicada = nome => Object.hasOwn(rotasPublicacao,nome) ? rotasPublicacao[nome] : nome;
const provaPath = path.join('data/provas', fontePublicada(provaId) + '.json');
if (!fs.existsSync(provaPath)) { console.error('Não encontrei ' + provaPath); process.exit(1); }

const prova   = JSON.parse(fs.readFileSync(provaPath, 'utf8'));
const catalogo = JSON.parse(fs.readFileSync('data/catalogo-temas.json', 'utf8'));
const motor   = fs.readFileSync('src/motor.html', 'utf8');
/* Arquivos que o build coletivo poderá gerar. A validação da trilha não depende
   de já haver HTML em docs, porque o Actions cria uma página por vez. */
const htmlDasProvas = new Set(fs.readdirSync('data/provas').filter(f => f.endsWith('.json'))
  .map(f => f.replace(/\.json$/,'.html')));

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
else if (!prova.alunas.some(a => /\(teste\)/i.test(a)))
  erros.push('`alunas` precisa incluir ao menos uma pessoa com "(teste)" para não misturar testes adultos ao progresso da aluna');
const CONTEXTOS = ['prova','revisao_espacada','treino_livre'];
if (prova.contexto && !CONTEXTOS.includes(prova.contexto))
  erros.push(`contexto inválido: ${prova.contexto}`);
if (prova.filas_legadas != null && (!Array.isArray(prova.filas_legadas) ||
    prova.filas_legadas.some(id=>typeof id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)||id===prova.prova_id)))
  erros.push('filas_legadas precisa conter IDs de provas anteriores, diferentes da atual');
if (prova.progresso_legado != null && (!Array.isArray(prova.progresso_legado) ||
    prova.progresso_legado.some(id=>typeof id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)||id===prova.prova_id)))
  erros.push('progresso_legado precisa conter IDs de provas anteriores, diferentes da atual');

/* ---------- trilha em capítulos ----------
   Capítulo é o mapa único (aprender → aplicar → misturar) do guia de
   student-progress-dashboard-plan.md §7. Com `capitulos`, toda missão precisa
   apontar para um deles, e o mapa é sequencial: as missões de um capítulo
   formam um bloco contíguo, na ordem em que os capítulos foram declarados —
   nunca intercaladas entre capítulos nem fora de ordem. Sem `capitulos`, o
   campo na missão não tem para onde apontar. */
let capitulosPorId = null;
if (prova.capitulos != null) {
  if (!Array.isArray(prova.capitulos) || !prova.capitulos.length) {
    erros.push('`capitulos` precisa ser uma lista não vazia');
  } else {
    capitulosPorId = new Map();
    for (const c of prova.capitulos) {
      if (!c || typeof c !== 'object') { erros.push('capítulo inválido: precisa ser objeto'); continue; }
      const rotulo = typeof c.capitulo_id === 'string' ? c.capitulo_id : '(sem capitulo_id)';
      if (typeof c.capitulo_id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(c.capitulo_id))
        erros.push(`capitulo_id inválido: ${rotulo}`);
      else if (capitulosPorId.has(c.capitulo_id))
        erros.push(`capitulo_id duplicado: ${c.capitulo_id}`);
      else capitulosPorId.set(c.capitulo_id, c);
      if (typeof c.titulo !== 'string' || !c.titulo.trim())
        erros.push(`capítulo ${rotulo}: "titulo" precisa ser texto não vazio`);
      if (typeof c.funcao !== 'string' || !c.funcao.trim())
        erros.push(`capítulo ${rotulo}: "funcao" precisa ser texto não vazio`);
      if (!CONTEXTOS.includes(c.contexto))
        erros.push(`capítulo ${rotulo}: "contexto" precisa ser um de ${CONTEXTOS.join('|')}`);
      if (!c.recuperacao || typeof c.recuperacao !== 'object' ||
          typeof c.recuperacao.pergunta !== 'string' || !c.recuperacao.pergunta.trim() ||
          typeof c.recuperacao.referencia !== 'string' || !c.recuperacao.referencia.trim())
        erros.push(`capítulo ${rotulo}: "recuperacao" precisa de "pergunta" e "referencia" não vazias`);
    }
  }
}
if (capitulosPorId) {
  const idsDeclarados = prova.capitulos.filter(c => c && typeof c.capitulo_id === 'string').map(c => c.capitulo_id);
  let ultimoIdx = -1;
  for (const m of prova.missoes || []) {
    if (m.capitulo_id == null) { erros.push(`missão sem capitulo_id: ${m.missao_id} — a prova declara capítulos e toda missão precisa apontar para um`); continue; }
    const idx = idsDeclarados.indexOf(m.capitulo_id);
    if (idx === -1) { erros.push(`capitulo_id inexistente em ${m.missao_id}: ${m.capitulo_id}`); continue; }
    if (idx < ultimoIdx)
      erros.push(`missão ${m.missao_id} quebra a ordem/contiguidade dos capítulos: o capítulo ${m.capitulo_id} já havia sido encerrado antes dela`);
    ultimoIdx = idx;
  }
} else {
  for (const m of prova.missoes || [])
    if (m.capitulo_id != null)
      erros.push(`missão com capitulo_id mas a prova não declara "capitulos": ${m.missao_id}`);
}
// contexto por missão é independente de capítulo: mesma validade de valor, aceito com ou sem trilha em capítulos
for (const m of prova.missoes || [])
  if (m.contexto != null && !CONTEXTOS.includes(m.contexto))
    erros.push(`contexto inválido em ${m.missao_id}: ${m.contexto}`);

/* A trilha só orienta encontros diferentes; não libera nada no motor. Os
   nomes de arquivo são fechados aqui para que os links gerados continuem
   relativos e não recebam URL, caminho ou HTML de dados da prova. */
if (prova.trilha != null) {
  const t = prova.trilha;
  if (!t || typeof t !== 'object') erros.push('`trilha` precisa ser um objeto');
  else {
    if (!Number.isInteger(t.etapa) || ![1,2,3].includes(t.etapa))
      erros.push('`trilha.etapa` precisa ser 1, 2 ou 3');
    if (typeof t.orientacao !== 'string' || !t.orientacao.trim())
      erros.push('`trilha.orientacao` precisa ser um texto não vazio');
    for (const campo of ['anterior','proxima']) if (t[campo] != null &&
      (typeof t[campo] !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.html$/.test(t[campo])))
      erros.push(`trilha.${campo} precisa ser um nome de arquivo .html relativo e seguro`);
    else if (t[campo] != null && !htmlDasProvas.has(t[campo]))
      erros.push(`trilha.${campo} aponta para uma prova JSON inexistente: ${t[campo]}`);
  }
}

function validarInvestigacao(dados,missaoId){
  const onde=`dados de investigar em ${missaoId}`;
  if (!dados || typeof dados !== 'object') { erros.push(`${onde} ausentes`); return; }
  if (typeof dados.instrucao !== 'string' || !dados.instrucao.trim())
    erros.push(`${onde}: "instrucao" precisa ser texto não vazio`);
  if (!Array.isArray(dados.exemplos) || !dados.exemplos.length) {
    erros.push(`${onde}: "exemplos" precisa ser uma lista não vazia`); return;
  }
  dados.exemplos.forEach((ex,i)=>{
    const item=`${onde}, exemplo ${i+1}`;
    if (!ex || typeof ex !== 'object') { erros.push(`${item} precisa ser objeto`); return; }
    for (const campo of ['contexto','pergunta','explicacao'])
      if (typeof ex[campo] !== 'string' || !ex[campo].trim()) erros.push(`${item}: "${campo}" precisa ser texto não vazio`);
    if (!Array.isArray(ex.alternativas) || ![2,3].includes(ex.alternativas.length) || ex.alternativas.some(a=>typeof a!=='string'||!a.trim()))
      erros.push(`${item}: "alternativas" precisa ter 2 ou 3 textos`);
    if (!Number.isInteger(ex.correta) || !Array.isArray(ex.alternativas) || ex.correta<0 || ex.correta>=ex.alternativas.length)
      erros.push(`${item}: "correta" precisa apontar para uma alternativa`);
    if (ex.figura != null && (typeof ex.figura !== 'object' || ex.figura.tipo!=='svg' ||
      typeof ex.figura.conteudo!=='string' || !ex.figura.conteudo.trim()))
      erros.push(`${item}: "figura" opcional precisa ser SVG com conteúdo`);
  });
}
/* ---------- banco emprestado de outra prova ----------
   `banco_de` faz a revisão APONTAR para o banco da prova original em vez de
   copiar as questões para dentro do JSON dela. Duas cópias divergem, e a que
   estiver errada é sempre a que a aluna vê; assim, melhorar uma questão no
   banco original propaga para a revisão no próximo build.

   O carimbo de tema/eixo/subtema/BNCC vem da MISSÃO DE ORIGEM e viaja com a
   questão: fora do bloco dela, é o único jeito de a linha da planilha continuar
   dizendo a verdade sobre o que foi praticado. */
const bancoOrigem = new Map();   // bastidor do resumo, fora do JSON injetado
/* Cópias legítimas de banco_de INTERNO: o mesmo questao_id existe de propósito
   na missão de origem e na missão intercalada que a empresta. Guardado como
   `missao_id::questao_id` — nunca vira campo da questão, então não entra no
   JSON injetado nem no que a aluna recebe. */
const copiasPermitidas = new Set();
const indiceMissao = new Map((prova.missoes || []).map((m, i) => [m.missao_id, i]));
const porProvaId = f => {
  const caminho = 'data/provas/' + f + '.json';
  if (fs.existsSync(caminho)) return caminho;
  for (const arq of fs.readdirSync('data/provas')) {
    try { if (JSON.parse(fs.readFileSync('data/provas/' + arq, 'utf8')).prova_id === f) return 'data/provas/' + arq; }
    catch (e) { /* prova quebrada é problema do build dela */ }
  }
  return null;
};
for (let i = 0; i < (prova.missoes || []).length; i++) {
  const m = prova.missoes[i];
  if (m.banco_de == null) continue;
  const ref = m.banco_de;
  const formaAntiga = ref.prova != null || ref.temas != null;
  const formaNova = ref.missoes != null;
  if (formaAntiga && formaNova) {
    erros.push(`banco_de em ${m.missao_id}: use a forma antiga ("prova"+"temas") ou a nova ("missoes"), nunca as duas juntas`);
    continue;
  }
  if (formaNova) {
    /* Banco interno: empresta de outra missão DA MESMA PROVA, já escrita antes
       dela no mapa. É o mesmo carimbo tema/eixo/subtema/BNCC do empréstimo
       entre provas — a diferença é só de onde a questão vem. */
    if (!m.intercalada) {
      erros.push(`banco_de.missoes em ${m.missao_id}: só uma missão intercalada pode emprestar questões de outra missão da mesma prova`);
      continue;
    }
    if (!Array.isArray(ref.missoes) || !ref.missoes.length) {
      erros.push(`banco_de.missoes malformado em ${m.missao_id}: precisa de uma lista não vazia de missao_id`);
      continue;
    }
    const emprestadas = [];
    for (const origemId of ref.missoes) {
      const idxOrigem = indiceMissao.get(origemId);
      if (idxOrigem == null) {
        erros.push(`banco_de.missoes em ${m.missao_id}: não achei a missão "${origemId}" nesta prova`);
        continue;
      }
      if (idxOrigem >= i) {
        erros.push(`banco_de.missoes em ${m.missao_id}: a missão "${origemId}" precisa vir ANTES dela no mapa`);
        continue;
      }
      const mo = prova.missoes[idxOrigem];
      if (mo.banco_de != null) {
        erros.push(`banco_de.missoes em ${m.missao_id}: a missão "${origemId}" já é ela própria emprestada de outra — sem cadeias de empréstimo`);
        continue;
      }
      if (!mo.questoes?.length) {
        erros.push(`banco_de.missoes em ${m.missao_id}: a missão "${origemId}" está sem questões próprias`);
        continue;
      }
      if (mo.tema_id == null) {
        erros.push(`banco_de.missoes em ${m.missao_id}: a missão "${origemId}" não tem tema_id para carimbar as cópias`);
        continue;
      }
      for (const q of mo.questoes) {
        emprestadas.push({ ...q, tema_id: mo.tema_id, eixo: mo.eixo, subtema: mo.subtema,
                           habilidade_bncc: mo.habilidade_bncc ?? null });
        copiasPermitidas.add(`${m.missao_id}::${q.questao_id}`);
      }
    }
    m.questoes = [...(m.questoes || []), ...emprestadas];
    bancoOrigem.set(m.missao_id, { prova: prova.prova_id, questoes: emprestadas.length });
    continue;
  }
  // forma antiga: empresta de outra prova, por tema
  if (!ref.prova || !Array.isArray(ref.temas) || !ref.temas.length) {
    erros.push(`banco_de malformado em ${m.missao_id}: precisa de "prova" e de uma lista "temas" (ou, na forma interna, de "missoes")`);
    continue;
  }
  const caminho = porProvaId(ref.prova);
  if (!caminho) {
    erros.push(`banco_de em ${m.missao_id}: não achei a prova "${ref.prova}" (nem como arquivo nem como prova_id em data/provas)`);
    continue;
  }
  const origem = JSON.parse(fs.readFileSync(caminho, 'utf8'));
  const emprestadas = [];
  for (const tema of ref.temas) {
    const mo = (origem.missoes || []).find(x => x.tema_id === tema);
    if (!mo) {
      erros.push(`banco_de em ${m.missao_id}: a prova "${ref.prova}" não tem missão do tema ${tema}`);
      continue;
    }
    if (!mo.questoes?.length) {
      erros.push(`banco_de em ${m.missao_id}: a missão ${mo.missao_id} de "${ref.prova}" está sem questões`);
      continue;
    }
    for (const q of mo.questoes)
      emprestadas.push({ ...q, tema_id: mo.tema_id, eixo: mo.eixo, subtema: mo.subtema,
                         habilidade_bncc: mo.habilidade_bncc ?? null });
  }
  m.questoes = [...(m.questoes || []), ...emprestadas];
  bancoOrigem.set(m.missao_id, { prova: origem.prova_id || ref.prova, questoes: emprestadas.length });
}

for (const m of prova.missoes) {
  if (!Array.isArray(m.questoes) || !m.questoes.length) {
    erros.push(`missão sem questões: ${m.missao_id}`);
    continue;
  }
  /* Missão intercalada é dispensada de ferramenta, aula e `regra` no singular.
     Ela não tem aula de propósito — revisão é prática de recuperação, e
     reensinar antes de recuperar anula o efeito —, e o cartão fixo dela é a
     cola em `regras`, com o texto de todos os temas do pool. Missão normal
     continua exigindo as três. */
  const inter = !!m.intercalada;
  const temasDoPool = [...new Set(m.questoes.map(q => q.tema_id))];

  /* Só a ferramenta nova tem contrato de dados próprio. As demais preservam
     seus formatos legados enquanto são parametrizadas aos poucos. */
  if (m.ferramenta === 'investigar') validarInvestigacao(m.dados,m.missao_id);

  if (m.tema_id != null && !catalogo.find(t => t.tema_id === m.tema_id))
    erros.push(`tema_id fora do catálogo: ${m.tema_id}`);

  if (!inter) {
    if (m.tema_id == null) erros.push(`missão sem tema_id: ${m.missao_id}`);
    if (!m.ferramenta) erros.push(`missão sem ferramenta manipulável: ${m.missao_id}`);
    else if (!ferramentas.has(m.ferramenta))
      erros.push(`ferramenta "${m.ferramenta}" não existe no motor (tem: ${[...ferramentas].join(', ')})`);
    if (!m.aula?.corpo || !String(m.aula.corpo).trim())
      erros.push(`missão sem aula.corpo — é dele que sai a aula fatiada: ${m.missao_id}`);
    // o cartão de regra é acomodação, não enfeite: sem texto ele some da tela
    if (!m.regra || !String(m.regra).trim())
      erros.push(`missão sem regra para o cartão fixo: ${m.missao_id}`);
  } else {
    /* Sem a regra de um dos temas do pool, ela cai numa questão daquele tema
       sem ter onde consultar: a carga volta para a memória de trabalho, que é
       exatamente o que o cartão fixo existe para aliviar. */
    if (temasDoPool.some(t => t == null))
      erros.push(`missão intercalada com questão sem tema_id: ${m.missao_id} — a linha da planilha não saberia o que foi praticado`);
    for (const t of temasDoPool.filter(Boolean))
      if (!catalogo.find(c => c.tema_id === t))
        erros.push(`tema_id fora do catálogo em ${m.missao_id}: ${t}`);
    if (!Array.isArray(m.regras) || !m.regras.length)
      erros.push(`missão intercalada sem "regras": ${m.missao_id} — a cola é o que fica no lugar da aula`);
    else {
      for (const r of m.regras)
        if (!r.rotulo || !String(r.texto || '').trim())
          erros.push(`regra da cola sem rótulo ou texto em ${m.missao_id}: ${r.tema_id || '(sem tema_id)'}`);
      const cobertos = new Set(m.regras.map(r => r.tema_id));
      for (const t of temasDoPool.filter(Boolean))
        if (!cobertos.has(t))
          erros.push(`a cola de ${m.missao_id} não cobre o tema ${t}`);
    }
  }
  /* Banco de questões: o sorteio declara a distribuição de dificuldade, e o
     banco precisa ter com que atendê-la. Sem esta checagem o motor cai no
     fallback e aplica uma questão fora do nível pedido — em silêncio, que é o
     pior jeito de a dificuldade declarada deixar de ser verdade. */
  if (m.sorteio != null) {
    if (m.sorteio.por_tema != null && m.sorteio.dificuldades != null)
      erros.push(`sorteio com "por_tema" e "dificuldades" juntos em ${m.missao_id}: o motor obedece só ao primeiro — escolha um`);
    if (m.sorteio.por_tema != null) {
      /* Aqui a conta é POR TEMA: o motor roda a lista inteira dentro de cada
         tema. Um tema sem questão do nível pedido cai no fallback e aplica
         outra dificuldade — em silêncio, que é o pior jeito de a dificuldade
         declarada deixar de ser verdade. */
      const plano = m.sorteio.por_tema;
      if (!Array.isArray(plano) || !plano.length)
        erros.push(`sorteio "por_tema" vazio: ${m.missao_id}`);
      else if (plano.some(d => ![1,2,3].includes(d)))
        erros.push(`sorteio "por_tema" com dificuldade fora de 1-3: ${m.missao_id}`);
      else {
        const temas = temasDoPool.filter(Boolean);
        if (!temas.length)
          erros.push(`sorteio "por_tema" num banco em que nenhuma questão tem tema_id: ${m.missao_id}`);
        for (const t of temas) for (const d of new Set(plano)) {
          const pedidas = plano.filter(x => x === d).length;
          const temNoBanco = m.questoes.filter(q => q.tema_id === t && q.dificuldade === d).length;
          if (temNoBanco < pedidas)
            erros.push(`banco insuficiente em ${m.missao_id}: o tema ${t} precisa de ${pedidas} questão(ões) de dificuldade ${d} e tem ${temNoBanco}`);
        }
      }
    } else {
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
  }
  for (const q of m.questoes) {
    const copiaLegitima = copiasPermitidas.has(`${m.missao_id}::${q.questao_id}`);
    if (ids.has(q.questao_id) && !copiaLegitima) erros.push(`questao_id duplicado: ${q.questao_id}`);
    if (!copiaLegitima) ids.add(q.questao_id);
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
// (m.questoes || []): uma missão cujo banco_de não resolveu chega aqui vazia, e um
// TypeError no lugar da lista de erros esconde justamente o erro que a explica.
const fixas = prova.missoes.flatMap(m => (m.questoes || []).filter(q => q.alternativas_fixas));
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

/* Índice das provas geradas, para a raiz do Pages não ser um 404. Ele nasce
   dos metadados, não da ordem alfabética dos arquivos: encontros de uma trilha
   ficam na etapa 1 → 2 → 3 mesmo quando o nome do arquivo mudar. */
const escaparHTML = s => String(s).replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const publicadas = fs.readdirSync('data/provas').filter(f => f.endsWith('.json')).flatMap(f => {
  try {
    const arquivo=f.replace(/\.json$/,'');
    // O índice privilegia o endereço que já foi compartilhado, sem duas entradas
    // para o mesmo encontro. A página com o nome da fonte também continua válida.
    if (Object.entries(rotasPublicacao).some(([rota,fonte])=>fonte===arquivo&&fs.existsSync(path.join('docs',rota+'.html')))) return [];
    const dadosIndice=JSON.parse(fs.readFileSync(path.join('data/provas',fontePublicada(arquivo)+'.json'),'utf8'));
    return [{arquivo,titulo:dadosIndice.titulo||arquivo,trilha:dadosIndice.trilha}];
  } catch (e) { return []; }
}).sort((a,b) => {
  const ea=Number.isInteger(a.trilha?.etapa)?a.trilha.etapa:99;
  const eb=Number.isInteger(b.trilha?.etapa)?b.trilha.etapa:99;
  return ea-eb || a.titulo.localeCompare(b.titulo,'pt-BR');
}).filter(p => fs.existsSync(path.join('docs',p.arquivo+'.html')));
fs.writeFileSync(path.join('docs', 'index.html'),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Missão Estudos</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:60px auto;padding:0 20px;color:#17324a;line-height:1.6}
a{color:#2fae94}li{margin:6px 0}</style></head><body>
<h1>Missão Estudos</h1><p>Revisões publicadas:</p><ul>
${publicadas.map(p => `<li>${p.trilha?`<small>Etapa ${p.trilha.etapa} de 3 · </small>`:''}<a href="${p.arquivo}.html">${escaparHTML(p.titulo)}</a></li>`).join('\n')}
</ul></body></html>\n`);

console.log(`OK  ${dest}`);
const banco = prova.missoes.flatMap(m => m.questoes);
/* Mesma conta do motor (`tamanhoMissao`): na intercalada o plano vale por tema,
   então são temas × tamanho da lista. Somar só a lista contaria 2 onde a
   sessão aplica 12 — e um resumo que mente é pior que resumo nenhum. */
const porSessao = m => m.sorteio?.por_tema?.length
  ? new Set(m.questoes.map(q => q.tema_id).filter(t => t != null)).size * m.sorteio.por_tema.length
  : (m.sorteio?.dificuldades?.length || m.questoes.length);
const aplicadas = prova.missoes.reduce((a, m) => a + porSessao(m), 0);
console.log(`    ${prova.missoes.length} ${prova.missoes.length===1?"missão":"missões"} · ${aplicadas} questões por sessão, sorteadas de um banco de ${banco.length}`);
for (const m of prova.missoes) {
  if (!m.intercalada) continue;
  const o = bancoOrigem.get(m.missao_id);
  const temas = [...new Set(m.questoes.map(q => q.tema_id).filter(Boolean))];
  console.log(`    intercalada "${m.missao_id}": sem aula, ${porSessao(m)} questões de ${temas.length} temas embaralhados` +
    `, cola com ${(m.regras || []).length} regras` + (o ? ` · banco emprestado de ${o.prova} (${o.questoes} questões)` : ''));
}
console.log(`    dificuldade média do banco ${(banco.reduce((a,q)=>a+q.dificuldade,0)/banco.length).toFixed(2)}`);
console.log(`    alternativas embaralhadas em ${banco.filter(q=>!q.alternativas_fixas).length} de ${banco.length} questões`);
console.log(sheetUrl
  ? '    envio para a planilha: ATIVO'
  : '    envio para a planilha: DESLIGADO (sem SHEET_URL) — fila local + botão "Copiar resultados"');
