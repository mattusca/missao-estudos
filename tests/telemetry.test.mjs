import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const motor=fs.readFileSync('src/motor.html','utf8');
const codigo=motor.slice(motor.indexOf('function lerFila'),motor.indexOf('function copiarResultados'));
const KEY='fila-teste';
const row=id=>({evento_id:id,aluna:'Pessoa (teste)',timestamp:'2026-09-08T20:40:00Z'});
const ok=()=>({ok:true,json:async()=>({ok:true})});
function fixture({dados=new Map(),fetch=async()=>ok(),storage,semLocal=false}={}){
  const eventos=new Map(),timers=new Map();let proximo=0;
  const contexto={PROVA:{filas_legadas:[]},FILA:KEY,TEM_URL:true,SHEET_URL:'https://example.invalid/telemetry',linhas:[],
    fetch,AbortController,window:{storage,addEventListener:(k,f)=>eventos.set(k,f)},
    document:{hidden:false,addEventListener:(k,f)=>eventos.set(k,f)},navigator:{onLine:true},
    setTimeout:(f,ms)=>{const id=++proximo;timers.set(id,{f,ms});return id;},clearTimeout:id=>timers.delete(id),
    localStorage:{getItem:k=>{if(semLocal)throw Error('indisponível');return dados.get(k)||null;},
      setItem:(k,v)=>{if(semLocal)throw Error('indisponível');dados.set(k,v);},removeItem:k=>dados.delete(k)}};
  vm.runInNewContext(`${codigo};globalThis.api={lerFila,salvarFila,persistirFila,restaurarFila,enviarLinha,esvaziarFila};`,contexto);
  return {...contexto.api,dados,eventos,timers,contexto};
}
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return{promise,resolve};}

test('resposta fica persistida antes de iniciar a rede e sobrevive a outra abertura',async()=>{
  const rede=deferred(),iniciou=deferred();
  const f=fixture({fetch:()=>{iniciou.resolve();return rede.promise;}});
  const envio=f.enviarLinha(row('A'));
  assert.equal(JSON.parse(f.dados.get(KEY))[0].evento_id,'A');
  await iniciou.promise;
  assert.equal(fixture({dados:f.dados}).lerFila()[0].evento_id,'A');
  rede.resolve(ok());await envio;
  assert.deepEqual(JSON.parse(f.dados.get(KEY)),[]);
});

test('drenagem não apaga o lote e chamadas simultâneas não duplicam a rede',async()=>{
  const rede=deferred(),iniciou=deferred(),enviadas=[];
  const f=fixture({fetch:async(url,opts)=>{const r=JSON.parse(opts.body);enviadas.push(r.evento_id);if(r.evento_id==='A'){iniciou.resolve();return rede.promise;}return ok();}});
  f.salvarFila([row('A'),row('B'),row('C')]);
  const envio=f.esvaziarFila();await iniciou.promise;
  assert.equal(f.esvaziarFila(),envio);
  assert.deepEqual(JSON.parse(f.dados.get(KEY)).map(r=>r.evento_id),['A','B','C']);
  const novo=f.enviarLinha(row('D'));
  rede.resolve(ok());await Promise.all([envio,novo]);
  assert.deepEqual(enviadas,['A','B','C','D']);
  assert.deepEqual(JSON.parse(f.dados.get(KEY)),[]);
});

test('erro de rede, HTTP, JSON ou recibo mantém o evento para nova tentativa',async()=>{
  for(const resposta of [()=>Promise.reject(Error('offline')),()=>({ok:false}),()=>({ok:true,json:async()=>{throw Error('HTML de erro');}}),()=>({ok:true,json:async()=>({ok:false})})]){
    const f=fixture({fetch:async()=>resposta()});
    await f.enviarLinha(row('A'));
    assert.equal(f.lerFila().length,1);
    assert.equal(JSON.parse(f.dados.get(KEY)).length,1);
    assert.ok([...f.timers.values()].some(t=>t.ms===30000));
  }
});

test('reconexão confirma duplicado sem trocar identidade, timestamp ou ID',async()=>{
  let offline=true;const requests=[];
  const f=fixture({fetch:async(url,opts)=>{requests.push(JSON.parse(opts.body));if(offline)throw Error('offline');return{ok:true,json:async()=>({ok:true,duplicado:true})};}});
  await f.enviarLinha(row('A'));offline=false;
  await f.eventos.get('online')();
  assert.deepEqual(requests,[row('A'),row('A')]);
  assert.equal(f.lerFila().length,0);
});

test('window.storage preserva a fila quando localStorage não está disponível',async()=>{
  const guardado=new Map();const storage={set:async(k,v)=>guardado.set(k,v),get:async k=>({value:guardado.get(k)})};
  const f=fixture({semLocal:true,storage,fetch:async()=>{throw Error('offline');}});
  await f.enviarLinha(row('A'));
  const nova=fixture({semLocal:true,storage});await nova.restaurarFila();
  assert.equal(nova.lerFila()[0].evento_id,'A');
  await nova.esvaziarFila();
  assert.deepEqual(JSON.parse(guardado.get(KEY)),[]);
});

test('falha de escrita ao remover recibo não causa loop de reenvio na mesma aba',async()=>{
  const dados=new Map([[KEY,JSON.stringify([row('A')])]]);let n=0;
  const f=fixture({dados,fetch:async()=>{n++;return ok();}});
  f.contexto.localStorage.setItem=()=>{throw Error('quota');};
  await f.esvaziarFila();
  assert.equal(n,1);assert.equal(f.lerFila().length,0);
  assert.equal(JSON.parse(dados.get(KEY)).length,1,'a cópia antiga continua recuperável e será deduplicada na próxima abertura');
});

test('duas abas retomadas na mesma posição produzem IDs diferentes',()=>{
  const registrar=motor.slice(motor.indexOf('function registrarQuestao'),motor.indexOf('/* ============================ ESTADO'));
  let sequencia=0;const enviadas=[];
  for(let aba=0;aba<2;aba++){
    const c={Date,S:{posicao:3},PROVA:{},relogio:null,stepsShown:0,LIMITE_SEG:180,
      sessaoId:()=>'sessao-compartilhada',novoId:()=>`sufixo-${++sequencia}`,
      capituloDe:()=>null,alunaAtual:()=>'Pessoa (teste)',dispositivo:()=>'computador',enviarLinha:r=>enviadas.push(r)};
    vm.runInNewContext(`${registrar};registrarQuestao({}, {questao_id:'Q${aba}'}, 'erro');`,c);
  }
  assert.equal(enviadas[0].posicao_na_sessao,4);
  assert.equal(enviadas[1].posicao_na_sessao,4);
  assert.notEqual(enviadas[0].evento_id,enviadas[1].evento_id);
});

test('timeout preserva o evento para reenvio',async()=>{
  const iniciou=deferred();
  const f=fixture({fetch:(url,opts)=>new Promise((resolve,reject)=>{
    opts.signal.addEventListener('abort',()=>reject(Error('timeout')));iniciou.resolve();
  })});
  const envio=f.enviarLinha(row('A'));await iniciou.promise;
  [...f.timers.values()].find(t=>t.ms===15000).f();await envio;
  assert.equal(f.lerFila().length,1);
  assert.equal(JSON.parse(f.dados.get(KEY))[0].evento_id,'A');
});

test('online antes da escolha restaura os dois armazenamentos sem apagar eventos exclusivos',async()=>{
  const dados=new Map([[KEY,JSON.stringify([row('A')])]]);
  const remoto=new Map([[KEY,JSON.stringify([row('A'),row('B')])]]);
  const enviadas=[];
  const f=fixture({dados,storage:{get:async k=>({value:remoto.get(k)}),set:async(k,v)=>remoto.set(k,v)},
    fetch:async(url,opts)=>{enviadas.push(JSON.parse(opts.body).evento_id);return ok();}});
  await f.eventos.get('online')();
  assert.deepEqual(enviadas,['A','B']);
  assert.deepEqual(JSON.parse(remoto.get(KEY)),[]);
});

test('falha ao ler a cascata não sobrescreve nem envia antes de recuperar a origem',async()=>{
  let escritas=0,envios=0;
  const f=fixture({storage:{get:async()=>{throw Error('leitura indisponível');},set:async()=>{escritas++;}},
    fetch:async()=>{envios++;return ok();}});
  await f.enviarLinha(row('A'));
  assert.equal(escritas,0);assert.equal(envios,0);
  assert.equal(JSON.parse(f.dados.get(KEY))[0].evento_id,'A');
});

test('retry recupera fila exclusiva da cascata após falha temporária de leitura',async()=>{
  let falha=true;const remoto=new Map([[KEY,JSON.stringify([row('A')])]]),enviadas=[];
  const f=fixture({storage:{get:async k=>{if(falha)throw Error('temporário');return{value:remoto.get(k)};},set:async(k,v)=>remoto.set(k,v)},
    fetch:async(url,opts)=>{enviadas.push(JSON.parse(opts.body).evento_id);return ok();}});
  await f.esvaziarFila();
  assert.equal(f.lerFila().length,0);
  const retry=[...f.timers.values()].find(t=>t.ms===30000);
  assert.ok(retry,'hidratação pendente também precisa de retry');
  falha=false;retry.f();await f.esvaziarFila();
  assert.deepEqual(enviadas,['A']);
  assert.deepEqual(JSON.parse(remoto.get(KEY)),[]);
});
