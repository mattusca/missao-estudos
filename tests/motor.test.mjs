import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const motor=fs.readFileSync('src/motor.html','utf8');
const build=fs.readFileSync('build.mjs','utf8');

function trecho(fonte,inicio,fim){
  const a=fonte.indexOf(inicio),b=fonte.indexOf(fim,a);
  assert.notEqual(a,-1,`não achei ${inicio}`);
  assert.notEqual(b,-1,`não achei o fim ${fim}`);
  return fonte.slice(a,b);
}

function logicaInvestigacao(){
  const codigo=trecho(motor,'function novoEstadoInvestigar','/* 0 · Investigar');
  const contexto={};
  vm.runInNewContext(`${codigo};globalThis.api={novoEstadoInvestigar,selecionarInvestigar,confirmarInvestigar};`,contexto);
  return contexto.api;
}

function logicaSessao(){
  const codigo=trecho(motor,'const PARADA_MAX','function sessaoId');
  const contexto={};
  vm.runInNewContext(`${codigo};globalThis.api={PARADA_MAX,novaSessaoId,atualizarSessao};`,contexto);
  return contexto.api;
}

function logicaPortao(){
  const codigo=trecho(motor,'const SEL_INTERATIVO',"el('lessonNext').onclick");
  const listeners=new Map();
  const box={
    querySelector:()=>null,querySelectorAll:()=>[],
    addEventListener:(tipo,fn)=>listeners.set(tipo,fn),
    removeEventListener:tipo=>listeners.delete(tipo),
    disparar:tipo=>listeners.get(tipo)?.()
  };
  const botoes={lessonNext:{dataset:{},textContent:'Continuar'},toQuizBtn:{dataset:{},textContent:'Ir aos desafios'}};
  const contexto={el:id=>id==='lessonBody'?{querySelector:()=>box}:botoes[id]};
  vm.runInNewContext(`${codigo};globalThis.api={armarPortao};`,contexto);
  return {box,botoes,armarPortao:contexto.api.armarPortao};
}

function logicaAlternativas(){
  const codigo=trecho(motor,'function baralhar','/* As questões desta tentativa');
  const contexto={Math:Object.assign(Object.create(Math),{random:()=>0})};
  vm.runInNewContext(`${codigo};globalThis.api={prepararAlternativas};`,contexto);
  return contexto.api;
}

test('investigar só conclui após confirmação e mantém a segunda tentativa sem gabarito',()=>{
  const {novoEstadoInvestigar,selecionarInvestigar,confirmarInvestigar}=logicaInvestigacao();
  const dados={exemplos:[{correta:0,alternativas:['pista certa','distrator','outro distrator']}]};
  let estado=novoEstadoInvestigar();

  estado=selecionarInvestigar(estado,1);
  assert.equal(estado.final,false,'escolher não pode liberar o portão');
  estado=confirmarInvestigar(estado,dados);
  assert.deepEqual({...estado,eliminadas:[...estado.eliminadas]},
    {exemplo:0,escolha:null,tentativas:1,eliminadas:[1],final:false,correta:false},
    'o primeiro erro elimina apenas a escolha e não finaliza');

  estado=selecionarInvestigar(estado,0);
  estado=confirmarInvestigar(estado,dados);
  assert.equal(estado.final,true);
  assert.equal(estado.correta,true);
  assert.equal(estado.mostrarGabarito,false);
});

test('investigar libera após a segunda decisão mesmo quando ela continua incorreta',()=>{
  const {novoEstadoInvestigar,selecionarInvestigar,confirmarInvestigar}=logicaInvestigacao();
  const dados={exemplos:[{correta:0,alternativas:['certa','primeiro erro','segundo erro']}]};
  let estado=novoEstadoInvestigar();
  estado=confirmarInvestigar(selecionarInvestigar(estado,1),dados);
  estado=confirmarInvestigar(selecionarInvestigar(estado,2),dados);
  assert.equal(estado.final,true);
  assert.equal(estado.correta,false);
  assert.equal(estado.mostrarGabarito,true);
});

test('portão da investigação ignora toques comuns e abre somente no evento final',()=>{
  const {box,botoes,armarPortao}=logicaPortao();
  armarPortao(true,true);
  assert.equal(botoes.lessonNext.disabled,true);
  box.disparar('click');
  assert.equal(botoes.lessonNext.disabled,true,'selecionar ou trocar exemplo não abre o portão');
  box.disparar('investigarfinal');
  assert.equal(botoes.lessonNext.disabled,false);
});

test('investigar embaralha alternativas e remapeia a decisão correta antes da confirmação',()=>{
  const {prepararAlternativas}=logicaAlternativas();
  const original={alternativas:['correta','distrator 1','distrator 2'],correta:0};
  const preparada=prepararAlternativas(original);
  assert.notDeepEqual([...preparada.alternativas],[...original.alternativas]);
  assert.equal(preparada.alternativas[preparada.correta],'correta');

  const {novoEstadoInvestigar,selecionarInvestigar,confirmarInvestigar}=logicaInvestigacao();
  let estado=novoEstadoInvestigar();
  estado=confirmarInvestigar(selecionarInvestigar(estado,preparada.correta),{exemplos:[preparada]});
  assert.equal(estado.final,true);
  assert.equal(estado.correta,true);
});

test('sessão preserva ID legado em retomada e prefixa somente uma sessão nova da prova',()=>{
  const {PARADA_MAX,atualizarSessao}=logicaSessao();
  const agora=Date.UTC(2026,8,7,15,0,0);
  const legado={sessao:'2026-09-07-antiga',ultimoEvento:agora-60*60*1000,posicao:4,retomou:true};
  const continua=atualizarSessao(legado,'2026-09-HUGO-1',agora,()=> 'novo');
  assert.equal(continua.sessao,legado.sessao);
  assert.equal(continua.posicao,4);

  const nova=atualizarSessao({},'2026-09-HUGO-1',agora,()=> 'abc123');
  assert.equal(nova.sessao,'2026-09-HUGO-1:2026-09-07-abc123');

  const expirada=atualizarSessao({...legado,ultimoEvento:agora-PARADA_MAX-1},'2026-09-HUGO-1',agora,()=> 'renovada');
  assert.equal(expirada.sessao,'2026-09-HUGO-1:2026-09-07-renovada');
  assert.equal(expirada.posicao,0);
  assert.equal(expirada.retomou,false);
});

test('validação da investigação exige exemplos completos, mas não aplica o formato novo às ferramentas legadas',()=>{
  const codigo=trecho(build,'function validarInvestigacao','/* ---------- banco emprestado');
  const contexto={};
  vm.runInNewContext(`const erros=[];${codigo};globalThis.api={erros,validarInvestigacao};`,contexto);
  const valido={instrucao:'Observe a pista',exemplos:[{
    contexto:'Uma cena',pergunta:'Qual pista importa?',alternativas:['A','B'],correta:0,
    explicacao:'A pista A mostra a relação.',figura:{tipo:'svg',conteudo:'<svg></svg>'}
  }]};
  contexto.api.validarInvestigacao(valido,'m1');
  assert.deepEqual([...contexto.api.erros],[]);

  contexto.api.validarInvestigacao({instrucao:'',exemplos:[{contexto:'',pergunta:'',alternativas:['só uma'],correta:2,explicacao:'',figura:{tipo:'barras'}}]},'m2');
  assert.ok(contexto.api.erros.length>=5,'dados incompletos precisam impedir o build da nova ferramenta');
});

test('substituição de página resgata eventos legados sem alterar identidade ou progresso',()=>{
  const antiga={evento_id:'evento-antigo',sessao_id:'sessao-antiga',timestamp:'2026-09-07T12:00:00Z',aluna:'Marco (teste)'};
  const nova={evento_id:'evento-novo',aluna:'Fernanda (teste)'};
  const dados=new Map([
    ['missao_fila_ANTIGA_v2',JSON.stringify([antiga])],
    ['missao_fila_NOVA_v2',JSON.stringify([antiga,nova])],
    ['missao_progresso_ANTIGA_Marco (teste)_v2','{"xp":700}']
  ]);
  const contexto={PROVA:{filas_legadas:['ANTIGA']},FILA:'missao_fila_NOVA_v2',localStorage:{
    getItem:k=>dados.get(k)||null,setItem:(k,v)=>dados.set(k,v),removeItem:k=>dados.delete(k)
  }};
  const codigo=trecho(motor,'function lerFila','async function enviarLinha');
  vm.runInNewContext(codigo+';migrarFilasLegadas();migrarFilasLegadas();',contexto);
  assert.deepEqual(JSON.parse(dados.get('missao_fila_NOVA_v2')),[antiga,nova]);
  assert.equal(dados.has('missao_fila_ANTIGA_v2'),false);
  assert.equal(dados.get('missao_progresso_ANTIGA_Marco (teste)_v2'),'{"xp":700}');
});

test('falha ao persistir a migração mantém a fila antiga disponível para outra abertura',()=>{
  const original='[{"evento_id":"antigo"}]';
  const dados=new Map([['missao_fila_ANTIGA_v2',original]]);
  const contexto={PROVA:{filas_legadas:['ANTIGA']},FILA:'missao_fila_NOVA_v2',localStorage:{
    getItem:k=>dados.get(k)||null,setItem:()=>{throw new Error('QuotaExceeded');},removeItem:k=>dados.delete(k)
  }};
  vm.runInNewContext(trecho(motor,'function lerFila','async function enviarLinha')+';migrarFilasLegadas();',contexto);
  assert.equal(dados.get('missao_fila_ANTIGA_v2'),original);
  assert.equal(dados.has('missao_fila_NOVA_v2'),false);
});
