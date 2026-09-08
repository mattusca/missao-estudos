import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';

const fontes=[1,2,3].map(n=>`2026-09-hugo-session-${n}-y5`);
// Exercita o build real: especialmente a expansão de banco_de e os links.
const encontros=fontes.map(nome=>{
  execFileSync(process.execPath,['build.mjs',nome],{env:{...process.env,SHEET_URL:''}});
  const html=fs.readFileSync(`docs/${nome}.html`,'utf8');
  return JSON.parse(html.match(/<script id="prova-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/)[1]);
});
const motor=fs.readFileSync('src/motor.html','utf8');
const contexto={};
vm.runInNewContext(motor.slice(motor.indexOf('function baralhar'),motor.indexOf('/* As questões desta tentativa'))+
  ';globalThis.sortear=sortearQuestoes;',contexto);

test('os encontros preservam banco alternativo por nível e o terceiro reutiliza itens sem mudar identidade',()=>{
  const [primeiro,segundo,terceiro]=encontros;
  assert.equal(new Set(encontros.map(p=>p.prova_id)).size,3,'progresso precisa pertencer ao encontro');
  for(const p of [primeiro,segundo]) for(const m of p.missoes){
    if(!m.sorteio){ // missão sem sorteio aplica todas as questões: os quatro marcos precisam ser praticados
      assert.equal(m.tema_id,'POR.LEI.ESTR');assert.equal(m.questoes.length,4);continue;
    }
    for(const d of new Set(m.sorteio.dificuldades)){
      const pedidos=m.sorteio.dificuldades.filter(x=>x===d).length;
      assert.ok(m.questoes.filter(q=>q.dificuldade===d).length>=2*pedidos,`${m.missao_id}: banco insuficiente para variar`);
    }
  }
  const ids1=new Set(primeiro.missoes.flatMap(m=>m.questoes.map(q=>q.questao_id)));
  const banco2=new Map(segundo.missoes.flatMap(m=>m.questoes.map(q=>[q.questao_id,q])));
  for(const id of banco2.keys()) assert.ok(!ids1.has(id),'situação nova precisa de ID próprio');
  assert.equal(terceiro.contexto,'revisao_espacada');
  for(const m of terceiro.missoes){
    assert.equal(m.intercalada,true);
    assert.equal(m.aula,undefined);
    assert.equal(m.ferramenta,undefined);
    for(const q of m.questoes){
      const {tema_id,eixo,subtema,habilidade_bncc,...conteudo}=q;
      assert.deepEqual(conteudo,banco2.get(q.questao_id),'banco emprestado não pode mudar a demanda do item');
      assert.ok(m.regras.some(r=>r.tema_id===tema_id),'cada tema precisa de apoio no cartão');
    }
  }
});

test('o endereço antigo publica o primeiro encontro sem redirecionar nem reutilizar o progresso antigo',()=>{
  const nomeAntigo='2026-09-hugo-cabret-y5';
  const original=JSON.parse(fs.readFileSync(`data/provas/${nomeAntigo}.json`,'utf8'));
  execFileSync(process.execPath,['build.mjs',nomeAntigo],{env:{...process.env,SHEET_URL:''}});
  const publicada=fs.readFileSync(`docs/${nomeAntigo}.html`,'utf8');
  assert.equal(publicada,fs.readFileSync(`docs/${fontes[0]}.html`,'utf8'));
  assert.notEqual(original.prova_id,encontros[0].prova_id,'o mapa anterior não pode concluir o novo encontro');
  const indice=fs.readFileSync('docs/index.html','utf8');
  assert.ok(indice.includes(`href="${nomeAntigo}.html"`));
  assert.ok(!indice.includes(`href="${fontes[0]}.html"`),'índice não deve duplicar o encontro');
  assert.equal(encontros[1].trilha.anterior,`${nomeAntigo}.html`);
});

test('sorteios reais mantêm 16, 16 e 14 questões, níveis declarados e mistura sem repetição de tema adjacente',()=>{
  const esperado={'2026-09-HUGO-E1-Y5':16,'2026-09-HUGO-E2-Y5':16,'2026-09-HUGO-E3-Y5':14};
  for(let tentativa=0;tentativa<50;tentativa++) for(const p of encontros){
    let total=0;
    for(const m of p.missoes){
      const qs=contexto.sortear(m);total+=qs.length;
      assert.equal(new Set(qs.map(q=>q.questao_id)).size,qs.length);
      if(m.intercalada){
        qs.forEach((q,i)=>{if(i)assert.notEqual(q.tema_id,qs[i-1].tema_id);});
        for(const tema of new Set(qs.map(q=>q.tema_id)))
          assert.deepEqual(Array.from(qs.filter(q=>q.tema_id===tema),q=>q.dificuldade).sort(),[1,2]);
      }else if(m.sorteio) assert.deepEqual(Array.from(qs,q=>q.dificuldade),m.sorteio.dificuldades);
      else assert.deepEqual(qs.map(q=>q.questao_id),m.questoes.map(q=>q.questao_id));
    }
    assert.equal(total,esperado[p.prova_id]);
  }
});

test('o payload real de questão mantém exatamente o contrato de 28 colunas do servidor',()=>{
  const script=fs.readFileSync('apps-script/enviar.gs','utf8');
  const servidor=vm.runInNewContext(script.match(/var CAMPOS = (\[[\s\S]*?\]);/)[1]);
  const cliente=vm.runInNewContext(motor.match(/const COLUNAS = (\[[\s\S]*?\]);/)[1]);
  assert.equal(cliente.length,28);
  assert.deepEqual([...cliente],[...servidor]);
  let linha;
  const c={Date, S:{usedHint:false,posicao:0}, relogio:{t0:Date.now()-1000,primeiro:Date.now()-700,saiu:false},
    PROVA:encontros[2],LIMITE_SEG:180,stepsShown:0,
    sessaoId:()=>`${encontros[2].prova_id}:sessao-teste`,alunaAtual:()=> 'Marco (teste)',
    enviarLinha:d=>{linha=d;},dispositivo:()=> 'desktop'};
  // Delimita pelo fim da função, antes do próximo bloco de estado/storage.
  const inicio=motor.indexOf('function registrarQuestao');
  const fim=motor.indexOf('\n}\n',inicio)+3;
  vm.runInNewContext(motor.slice(inicio,fim)+';globalThis.registrar=registrarQuestao;',c);
  const missao=encontros[2].missoes[0],questao=missao.questoes[0];
  c.registrar(missao,questao,'acerto_1a');
  assert.deepEqual(Object.keys(linha).sort(),[...cliente].sort());
  assert.equal(linha.questao_id,questao.questao_id);
  assert.equal(linha.tema_id,questao.tema_id);
  assert.ok(linha.sessao_id.startsWith(encontros[2].prova_id));
});
