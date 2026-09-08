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

function paginaDaTrilha({arquivo='primeiro.html',id='E1',passagens=new Map(),nomes=new Map(),alunas=['Marco (teste)','Fernanda (teste)']}={}){
  const armazenamento=dados=>({getItem:k=>dados.get(k)||null,setItem:(k,v)=>dados.set(k,v),removeItem:k=>dados.delete(k)});
  const c={URL,Date,PROVA:{prova_id:id,alunas,trilha:{anterior:'primeiro.html',proxima:'segundo.html'}},
    location:{href:`https://exemplo.test/estudos/${arquivo}`,pathname:`/estudos/${arquivo}`},
    sessionStorage:armazenamento(passagens),localStorage:armazenamento(nomes)};
  const identidade=trecho(motor,'const ALUNAS','/* Fila por prova');
  const trilha=trecho(motor,'function linkTrilhaSeguro','function desenharTrilha');
  const chave=motor.match(/const KEY=\(\)=>[^;]+;/)[0];
  vm.runInNewContext(`${identidade}\n${trilha}\n${chave};globalThis.api={gravarAluna,alunaAtual,prepararTrocaDeEtapa,consumirTrocaDeEtapa,KEY};`,c);
  return {api:c.api,c,passagens,nomes};
}

test('ida e volta entre etapas mantêm a pessoa, mas carregam chaves de progresso distintas',()=>{
  const primeiro=paginaDaTrilha();
  primeiro.api.gravarAluna('Marco (teste)');
  assert.equal(primeiro.api.prepararTrocaDeEtapa('segundo.html'),true);
  const segundo=paginaDaTrilha({...primeiro,arquivo:'segundo.html',id:'E2'});
  segundo.api.gravarAluna(segundo.api.consumirTrocaDeEtapa());
  assert.equal(segundo.api.alunaAtual(),'Marco (teste)');
  assert.notEqual(primeiro.api.KEY(),segundo.api.KEY());
  assert.equal(segundo.api.consumirTrocaDeEtapa(),'','o passe não pode ser usado numa recarga');
  segundo.api.gravarAluna('Fernanda (teste)');
  assert.equal(segundo.api.prepararTrocaDeEtapa('primeiro.html'),true);
  const volta=paginaDaTrilha(segundo);
  volta.api.gravarAluna(volta.api.consumirTrocaDeEtapa());
  assert.equal(volta.api.alunaAtual(),'Fernanda (teste)');
  assert.equal(volta.api.KEY(),'missao_progresso_E1_Fernanda (teste)_v2');
});

test('último nome do aparelho não pula a escolha numa abertura independente nem cria passagem',()=>{
  const {api,passagens}=paginaDaTrilha({nomes:new Map([['missao_aluna_v1','Marco (teste)']])});
  assert.equal(api.consumirTrocaDeEtapa(),'');
  assert.equal(api.prepararTrocaDeEtapa('segundo.html'),false);
  api.gravarAluna('Marco (teste)');
  assert.equal(api.prepararTrocaDeEtapa('fora-da-trilha.html'),false);
  assert.equal(api.prepararTrocaDeEtapa('https://outro.test/segundo.html'),false);
  assert.equal(passagens.size,0);
});

test('passagem inválida, antiga ou de outra pessoa/destino volta à escolha e é descartada',()=>{
  const valido={aluna:'Marco (teste)',destino:'/estudos/segundo.html',criada:Date.now()};
  for(const raw of [
    JSON.stringify({...valido,aluna:'Pessoa ausente'}),
    JSON.stringify({...valido,destino:'/outra-pasta/segundo.html'}),
    JSON.stringify({...valido,criada:Date.now()-61000}),
    JSON.stringify({...valido,criada:Date.now()+60000}),
    JSON.stringify({...valido,criada:undefined}), 'null', '{corrompido'
  ]){
    const {api,passagens}=paginaDaTrilha({arquivo:'segundo.html',passagens:new Map([['missao_troca_etapa_v1',raw]])});
    assert.equal(api.consumirTrocaDeEtapa(),'');
    assert.equal(passagens.size,0);
  }
});

test('armazenamento indisponível permite voltar à escolha sem interromper a navegação',()=>{
  const {api,c}=paginaDaTrilha();
  c.sessionStorage={getItem:()=>{throw new Error('bloqueado');},setItem:()=>{throw new Error('bloqueado');}};
  api.gravarAluna('Marco (teste)');
  assert.equal(api.prepararTrocaDeEtapa('segundo.html'),false);
  assert.equal(api.consumirTrocaDeEtapa(),'');
});

test('escolha feita em outra aba não muda a identidade ativa nem o progresso desta página',()=>{
  const pagina=paginaDaTrilha();
  pagina.api.gravarAluna('Marco (teste)');
  const outra=paginaDaTrilha({nomes:pagina.nomes});
  outra.api.gravarAluna('Fernanda (teste)');
  assert.equal(pagina.api.alunaAtual(),'Marco (teste)');
  assert.equal(pagina.api.KEY(),'missao_progresso_E1_Marco (teste)_v2');
  pagina.api.prepararTrocaDeEtapa('segundo.html');
  const destino=paginaDaTrilha({...pagina,arquivo:'segundo.html',id:'E2'});
  assert.equal(destino.api.consumirTrocaDeEtapa(),'Marco (teste)');
});
