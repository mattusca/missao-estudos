import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';

// A trilha de Hugo Cabret virou um único JSON, em capítulos: aprender (prova),
// aplicar (revisão espaçada) e misturar (revisão espaçada, intercalada). Os
// quatro endereços antigos (cabret + session-1/2/3) viram rota para o mesmo
// arquivo — ver data/publication-routes.json. Exercita o build real, porque é
// nele que vive a expansão do banco interno, a validação de capítulos e os links.
const NOME_TRILHA = '2026-09-hugo-trilha-y5';
const ROTAS = ['2026-09-hugo-cabret-y5', '2026-09-hugo-session-1-y5', '2026-09-hugo-session-2-y5', '2026-09-hugo-session-3-y5'];

function buildar(nome) {
  execFileSync(process.execPath, ['build.mjs', nome], {env: {...process.env, SHEET_URL: ''}});
  const html = fs.readFileSync(`docs/${nome}.html`, 'utf8');
  return JSON.parse(html.match(/<script id="prova-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/)[1]);
}

const trilha = buildar(NOME_TRILHA);
const porRota = new Map(ROTAS.map(nome => [nome, buildar(nome)]));

const motor = fs.readFileSync('src/motor.html', 'utf8');
const contexto = {};
vm.runInNewContext(motor.slice(motor.indexOf('function baralhar'), motor.indexOf('/* As questões desta tentativa')) +
  ';globalThis.sortear=sortearQuestoes;', contexto);

test('as quatro rotas antigas publicam byte a byte o mesmo HTML da trilha, com o prova_id único', () => {
  for (const nome of ROTAS)
    assert.equal(fs.readFileSync(`docs/${nome}.html`, 'utf8'), fs.readFileSync(`docs/${NOME_TRILHA}.html`, 'utf8'),
      `${nome} deveria publicar exatamente o conteúdo da trilha`);
  assert.equal(trilha.prova_id, '2026-09-HUGO-E1-Y5');
  for (const [nome, dados] of porRota) assert.equal(dados.prova_id, '2026-09-HUGO-E1-Y5', nome);
});

test('o índice não duplica Hugo: só a rota histórica aparece, não a trilha nem os encontros sem JSON próprio', () => {
  const indice = fs.readFileSync('docs/index.html', 'utf8');
  assert.ok(indice.includes('href="2026-09-hugo-cabret-y5.html"'), 'a rota histórica precisa aparecer no índice');
  assert.ok(!indice.includes(`href="${NOME_TRILHA}.html"`), 'a trilha não pode duplicar a entrada da rota histórica');
  for (const nome of ['2026-09-hugo-session-1-y5', '2026-09-hugo-session-2-y5', '2026-09-hugo-session-3-y5'])
    assert.ok(!indice.includes(`href="${nome}.html"`), `${nome} não tem JSON próprio e não deveria ganhar entrada`);
});

test('16 missões em 3 capítulos contíguos, na ordem declarada, com o contexto esperado', () => {
  assert.equal(trilha.missoes.length, 16);
  assert.deepEqual(trilha.capitulos.map(c => c.capitulo_id), ['cap-1', 'cap-2', 'cap-3']);
  assert.deepEqual(trilha.capitulos.map(c => c.contexto), ['prova', 'revisao_espacada', 'revisao_espacada']);
  const capituloPorId = new Map(trilha.capitulos.map(c => [c.capitulo_id, c]));
  const sequenciaDeCapitulos = [];
  for (const m of trilha.missoes) {
    assert.ok(capituloPorId.has(m.capitulo_id), `missão ${m.missao_id} com capitulo_id inválido`);
    if (sequenciaDeCapitulos.at(-1) !== m.capitulo_id) sequenciaDeCapitulos.push(m.capitulo_id);
  }
  assert.deepEqual(sequenciaDeCapitulos, ['cap-1', 'cap-2', 'cap-3'], 'as missões de cada capítulo precisam ficar em bloco contíguo, na ordem do mapa');
  for (const [id, esperado] of [['cap-1', 7], ['cap-2', 7], ['cap-3', 2]])
    assert.equal(trilha.missoes.filter(m => m.capitulo_id === id).length, esperado, `capítulo ${id}`);
});

test('o capítulo 3 empresta questões do capítulo 2 sem mudar identidade nem conteúdo, e a cola cobre cada tema', () => {
  const missaoPorId = new Map(trilha.missoes.map(m => [m.missao_id, m]));
  const cap3 = trilha.missoes.filter(m => m.capitulo_id === 'cap-3');
  assert.ok(cap3.length, 'esperava missões no capítulo 3');
  for (const m of cap3) {
    assert.equal(m.intercalada, true);
    assert.equal(m.aula, undefined, 'intercalada não tem aula');
    assert.equal(m.ferramenta, undefined, 'intercalada não tem ferramenta');
    assert.ok(Array.isArray(m.banco_de?.missoes) && m.banco_de.missoes.length, `${m.missao_id} precisa declarar banco_de.missoes`);
    const bancoOrigemPorId = new Map();
    for (const origemId of m.banco_de.missoes) {
      const origem = missaoPorId.get(origemId);
      assert.ok(origem, `origem "${origemId}" de ${m.missao_id} deveria existir na trilha`);
      assert.equal(origem.capitulo_id, 'cap-2', `${origemId} deveria ser uma missão do capítulo 2`);
      for (const q of origem.questoes) bancoOrigemPorId.set(q.questao_id, q);
    }
    const temasDoPool = new Set();
    for (const q of m.questoes) {
      const {tema_id, eixo, subtema, habilidade_bncc, ...conteudo} = q;
      const original = bancoOrigemPorId.get(q.questao_id);
      assert.ok(original, `${q.questao_id} em ${m.missao_id} deveria vir de uma das missões de origem`);
      assert.deepEqual(conteudo, original, 'o conteúdo copiado não pode divergir do original, só o carimbo de tema');
      temasDoPool.add(tema_id);
    }
    for (const tema of temasDoPool)
      assert.ok(m.regras.some(r => r.tema_id === tema), `a cola de ${m.missao_id} precisa cobrir o tema ${tema}`);
  }
});

test('sorteios reais (50 tentativas) respeitam o plano declarado e a passagem completa soma 46 questões', () => {
  for (let tentativa = 0; tentativa < 50; tentativa++) {
    let total = 0;
    for (const m of trilha.missoes) {
      const qs = contexto.sortear(m);
      total += qs.length;
      assert.equal(new Set(qs.map(q => q.questao_id)).size, qs.length, `${m.missao_id}: sem repetição dentro da tentativa`);
      if (m.intercalada) {
        qs.forEach((q, i) => { if (i) assert.notEqual(q.tema_id, qs[i - 1].tema_id, `${m.missao_id}: tema adjacente repetido`); });
        for (const tema of new Set(qs.map(q => q.tema_id)))
          assert.deepEqual(Array.from(qs.filter(q => q.tema_id === tema), q => q.dificuldade).sort(), [1, 2],
            `${m.missao_id}, tema ${tema}: esperava [1,2] por tema`);
      } else if (m.sorteio) {
        assert.deepEqual(Array.from(qs, q => q.dificuldade), m.sorteio.dificuldades, `${m.missao_id}: sorteio fora do plano`);
        for (const d of new Set(m.sorteio.dificuldades)) {
          const pedidas = m.sorteio.dificuldades.filter(x => x === d).length;
          assert.ok(m.questoes.filter(q => q.dificuldade === d).length >= 2 * pedidas, `${m.missao_id}: banco insuficiente para variar no nível ${d}`);
        }
      } else {
        // Missão sem sorteio aplica todas as questões, na ordem escrita — assim as provas antigas continuam funcionando.
        assert.equal(m.tema_id, 'POR.LEI.ESTR');
        assert.equal(m.questoes.length, 4);
        assert.deepEqual(qs.map(q => q.questao_id), m.questoes.map(q => q.questao_id));
      }
    }
    assert.equal(total, 46, 'uma passagem completa pelas 16 missões precisa somar 46 questões');
  }
});

test('o payload real de questão carrega capitulo_id e o contexto do capítulo da missão', () => {
  const script = fs.readFileSync('apps-script/enviar.gs', 'utf8');
  const servidor = vm.runInNewContext(script.match(/var CAMPOS = (\[[\s\S]*?\]);/)[1]);
  const cliente = vm.runInNewContext(motor.match(/const COLUNAS = (\[[\s\S]*?\]);/)[1]);
  // 29 = as 28 colunas históricas + capitulo_id (guides/student-progress-dashboard-plan.md §7).
  // Se o motor ainda não tiver sido atualizado com o 29º campo, esta asserção
  // é a que falha — o resto do arquivo continua válido.
  assert.equal(cliente.length, 29, 'COLUNAS do motor precisa ter 29 campos, com capitulo_id');
  assert.deepEqual([...cliente], [...servidor]);

  let linha;
  const capituloPorId = new Map(trilha.capitulos.map(c => [c.capitulo_id, c]));
  const c = {Date, S: {usedHint: false, posicao: 0}, relogio: {t0: Date.now() - 1000, primeiro: Date.now() - 700, saiu: false},
    PROVA: trilha, LIMITE_SEG: 180, stepsShown: 0,
    sessaoId: () => `${trilha.prova_id}:sessao-teste`, alunaAtual: () => 'Marco (teste)',
    enviarLinha: d => { linha = d; }, dispositivo: () => 'desktop'};
  c.missoes = trilha.missoes; // capituloDe(m) só precisa de PROVA.capitulos, mas missoesDoCapitulo lê `missoes`
  const inicio = motor.indexOf('function registrarQuestao');
  const fim = motor.indexOf('\n}\n', inicio) + 3;
  const inicioCap = motor.indexOf('function capitulosDe');
  const fimCap = motor.indexOf('function missoesDoCapitulo(cid){return missoes.filter(m=>m.capitulo_id===cid);}') +
    'function missoesDoCapitulo(cid){return missoes.filter(m=>m.capitulo_id===cid);}'.length;
  vm.runInNewContext(motor.slice(inicioCap, fimCap) + '\n' + motor.slice(inicio, fim) +
    ';globalThis.registrar=registrarQuestao;', c);

  const missaoCap2 = trilha.missoes.find(m => m.capitulo_id === 'cap-2' && !m.intercalada);
  c.registrar(missaoCap2, missaoCap2.questoes[0], 'acerto_1a');
  assert.deepEqual(Object.keys(linha).sort(), [...cliente].sort());
  assert.equal(linha.questao_id, missaoCap2.questoes[0].questao_id);
  assert.equal(linha.capitulo_id, 'cap-2', 'capitulo_id precisa vir da missão respondida');
  assert.equal(linha.contexto, capituloPorId.get('cap-2').contexto, 'contexto efetivo vem do capítulo, não só da prova');

  const missaoCap1 = trilha.missoes.find(m => m.capitulo_id === 'cap-1' && !m.intercalada);
  c.registrar(missaoCap1, missaoCap1.questoes[0], 'acerto_1a');
  assert.equal(linha.capitulo_id, 'cap-1');
  assert.equal(linha.contexto, 'prova');
});

test('uma prova antiga sem capítulos continua construindo normalmente', () => {
  const nome = '2026-08-language-arts-y5';
  execFileSync(process.execPath, ['build.mjs', nome], {env: {...process.env, SHEET_URL: ''}});
  const html = fs.readFileSync(`docs/${nome}.html`, 'utf8');
  const dados = JSON.parse(html.match(/<script id="prova-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/)[1]);
  assert.equal(dados.capitulos, undefined);
  for (const m of dados.missoes) assert.equal(m.capitulo_id, undefined);
});

test('o script de publicação gera as rotas antigas mesmo sem JSON próprio',()=>{
  for(const nome of ['2026-09-hugo-session-1-y5','2026-09-hugo-session-2-y5','2026-09-hugo-session-3-y5']){
    const alvo=`docs/${nome}.html`; if(fs.existsSync(alvo)) fs.unlinkSync(alvo);
  }
  execFileSync(process.execPath,['scripts/build-all.mjs'],{env:{...process.env,SHEET_URL:''}});
  const workflow=fs.readFileSync('.github/workflows/publicar.yml','utf8');
  assert.ok(workflow.includes('node scripts/build-all.mjs'),'o workflow precisa usar o mesmo script');
  for(const nome of ['2026-09-hugo-cabret-y5','2026-09-hugo-session-1-y5','2026-09-hugo-session-2-y5','2026-09-hugo-session-3-y5'])
    assert.ok(fs.existsSync(`docs/${nome}.html`),`${nome} precisa ser publicada`);
});
