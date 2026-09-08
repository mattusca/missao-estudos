# Missão Estudos

Gerador de revisões interativas para provas escolares. Um motor (HTML/JS) + conteúdo em JSON.
Cada prova nova é **um arquivo de dados**, nunca uma reescrita do motor.

Responsável: Marco. Contexto da aluna e dos dados: `CONTEXTO-PRIVADO.md` (não versionado).

Este arquivo é a referência comum de **Claude e Codex** para pedagogia, arquitetura
e dados. O [AGENTS.md](AGENTS.md) orienta a entrada do Codex e exige esta leitura.
Ao criar ou revisar conteúdo, ler também o [guia narrativo](guides/narrative-guide.md).

## 0. Colaboração entre agentes

- **Marco** define prioridades, fornece o contexto e decide mudanças pedagógicas.
- **Claude e Codex** podem assumir roteiro, redação, edição didática e implementação.
  A autoria é definida por entrega, sem exclusividade de conteúdo por agente.
- **Codex** tem como frente preferencial a engenharia e a verificação de integração,
  persistência, telemetria e preservação das acomodações. Também pode liderar a
  construção narrativa completa de um artefato.
- Em um artefato novo ou uma reescrita ampla, definir uma missão de referência,
  com os elementos previstos para seu tipo: aula e ferramenta nas missões de prova;
  cola e recuperação direta nas intercaladas; questões e feedbacks em ambas.
  Um agente escreve e outro revisa antes da expansão; os papéis podem se inverter.
  Ajustes pequenos recebem revisão proporcional, sem exigir uma segunda rodada de agentes.
- Registrar escopo, responsável e verificação em `tasks/todo.md`; fechar a entrega
  em `tasks/changelog.md`. Ao passar trabalho, indicar arquivos alterados, decisões,
  testes executados e pendências. Consultar o código ao encontrar status divergentes.
- Em trabalho simultâneo, separar arquivos ou usar checkouts isolados. Preservar
  alterações do outro agente e revisar o diff antes de integrar. Publicação segue
  a autorização da tarefa e as condições registradas para a prova.
- Manter as regras comuns aqui e as regras editoriais no guia, evitando cópias
  independentes. Instruções explícitas de Marco para a tarefa orientam o escopo;
  conflitos que afetem acomodações ou conteúdo factual devem ser apontados.

---

## 1. Contexto pedagógico — leia antes de qualquer alteração

### As acomodações não são negociáveis
As decisões de interface abaixo **não são preferências estéticas: são acomodações de
atenção**, escolhidas para uma aluna específica por razões que o Marco conhece e que
não moram neste repositório (ver `CONTEXTO-PRIVADO.md`, fora do versionamento).
**Não remova nenhuma delas sem que Marco peça explicitamente.** Se uma parecer supérflua,
pergunte antes — a que mais parece enfeite costuma ser a que mais sustenta a sessão.

| Recurso | Por que existe |
|---|---|
| Confirmação em dois toques | O 1º toque seleciona, o 2º confirma. Cria o freio entre impulso e ação. |
| Cartão de regra fixo no topo | Tira da memória de trabalho o que ela não precisa segurar de cabeça. |
| Aula fatiada, uma ideia por tela | Blocos longos de texto derrubam a atenção. |
| Andaime "quebrar em partes" | Revela **uma etapa por vez** em questões multi-etapa. Não custa XP: é apoio de organização, não dica de resposta. |
| Segunda tentativa antes do gabarito | Errar e já ver a resposta encerra o esforço. |
| Escudo de sequência (1 por missão) | Zerar a sequência no 1º erro é enquadramento de perda e desmotiva demais. |
| Modo foco | Desliga fundo, sombras, confete e animações. |
| Pausa sugerida após a 2ª e a 4ª missão | Descanso espaçado fixa mais que maratona. |
| **Nenhum cronômetro visível** | Pressão de tempo derruba o desempenho em vez de revelá-lo. O tempo é medido, mas **nunca exibido para ela**. |

### Reforço
XP premia **encarar**, não só acertar: acerto de 1ª = 100, com dica = 60, na 2ª tentativa = 50,
erro = 20. Nunca zerar. O objetivo é impedir que ela evite as questões difíceis para proteger
o placar.

### Tom
Feedback sempre positivo e específico. Nunca sarcasmo, nunca "você errou de novo".
Erro é enquadrado como informação: "agora você não erra mais essa".

---

## 2. Regra de calibragem — como decidir a próxima prova

Nunca calibrar pelo placar bruto. A métrica que importa é **acerto sem apoio**
(acertou de primeira, sem dica e sem andaime).

| Sinal no log | Leitura | Ação no próximo artefato |
|---|---|---|
| ≥85% sem apoio, tempo baixo | domínio | **subir dificuldade** |
| ≥85% mas com apoio ou lento | entende, não automatizou | mesmo nível, mais repetição curta |
| 60–85% | frágil | mesmo nível, variar o contexto do problema |
| <60% ou muitas 2ªs tentativas | lacuna conceitual | voltar à aula e à ferramenta, **não** aplicar mais prova |

**Não tratar nada como diagnóstico** antes de ~10 eventos no tema e 3 sessões distintas.
Três questões é amostra pequena: um tema ruim numa sessão pode ser cansaço, fome ou questão
mal escrita. Tendência importa mais que nível.

---

## 3. Estrutura

```
data/catalogo-temas.json      taxonomia: tema_id, eixo, subtema, BNCC
data/provas/<prova_id>.json   conteúdo de uma prova (missões + questões)
src/motor.html                motor: XP, storage, envio, navegação
src/ferramentas/              widgets interativos reutilizáveis
build.mjs                     injeta o JSON no motor -> docs/<prova_id>.html
docs/                         saída de build — NÃO versionada (ver abaixo)
.github/workflows/publicar.yml  build com o secret SHEET_URL + publicação no Pages
apps-script/enviar.gs         endpoint que grava na planilha + doGet do dashboard
apps-script/dashboard.html    dashboard dos pais (servido pelo Apps Script, nunca pelo Pages)
scripts/preview-dash.mjs      preview do dashboard com dados sintéticos
```

Fonte da verdade é sempre o JSON. **Nunca editar o HTML de `docs/` à mão** — ele é gerado.

**Publicar é dar push.** O Action gera todas as provas de `data/provas/` com a
`SHEET_URL` do secret e publica em <https://mattusca.github.io/missao-estudos/>.
`docs/` está no `.gitignore` de propósito: é a única via pela qual a URL do Apps
Script voltaria para um repositório público. Um passo do Action aborta a publicação
se uma URL real de implantação aparecer em arquivo versionado.

---

## 4. Convenções

### IDs de tema — `MATERIA.EIXO.TOPICO`
Alinhados aos eixos da BNCC, para comparar entre anos escolares.
`MAT.NUM.DEC` · `MAT.NUM.FRA` · `MAT.NUM.MUL10` · `MAT.NUM.OPDEC` ·
`MAT.GEO.AREAPER` · `MAT.PROB.SIMPLES` · `MAT.EST.GRAF`
`ING.CLI.PLUIRR` · `ING.CLI.MODAL` · `ING.CLI.CONT` · `ING.CLI.COMPSUP` ·
`ING.ESC.CONECT` · `ING.ESC.NARR` · `ING.LEI.INTERP`
Futuros: `POR.LEI.INTERP`, `CIE.VID.ECOSS`.

**BNCC de Língua Inglesa só existe a partir do 6º ano.** Os temas `ING.*` de Y5 ficam
com `habilidade_bncc: null` — campo vazio é honesto, código inventado vira conversa
errada com a escola.

**Regra dura:** `tema_id` nunca codifica dificuldade nem ano escolar. Se codificar, o tema
deixa de ser comparável quando reaparece numa série seguinte.

`questao_id` = `<tema_id>.Q<n>` e é **estável entre provas**. É ele que permite medir retenção
quando a mesma questão reaparece semanas depois.

### Quem está estudando
`prova.alunas` é uma lista (`["Alicia", "Marco (teste)", "Fernanda (teste)"]`).
A tela "Quem está estudando?" é a **primeira de toda abertura independente**, não só da estreia do
aparelho: o tablet é dividido entre ela e quem testa. Ao clicar nos botões anterior/próximo
da sequência, manter a pessoa já selecionada na mesma aba, sem perguntar novamente
(alteração solicitada por Marco em 07/09). Essa passagem é de uso único, vinculada
ao destino e válida por um minuto; não deve selecionar automaticamente pelo último
nome salvo no aparelho. Sem armazenamento da passagem, pedir a escolha normalmente.
O último nome vem marcado, para
o caminho de sempre custar um toque. O escolhido vai para a coluna `aluna` de cada linha.

**O progresso é por prova E por pessoa** — `missao_progresso_<prova_id>_<aluna>_v2`.
Sem isso, um teste de adulto entrega à Alícia um mapa já fechado, com todas as medalhas
e o XP cheio: o jogo ganho antes de ela começar. O HUD (nível, XP, medalhas) fica
escondido enquanto ninguém foi escolhido — é o placar de uma pessoa, não do aparelho.

**Toda prova precisa de uma opção de teste.** Adulto testando responde rápido demais e
acerta demais — as duas métricas da tabela da seção 2. Teste gravado no nome dela
envenena a calibragem da prova seguinte.

### Campos de contexto
- `ano_aluna` (em que ano ela está) e `nivel_conteudo` (para que ano o conteúdo foi feito)
  são **campos separados**. Iguais hoje; deixam de ser quando ela revisar Y5 já no Y6.
- `contexto`: `prova` | `revisao_espacada` | `treino_livre`. Véspera de prova e sábado à toa
  não são comparáveis.

### Capítulos de uma trilha
Uma sequência de estudo é **um artefato só, em capítulos** (`prova.capitulos`:
`capitulo_id`, `titulo`, `funcao`, `contexto`, `recuperacao`), e cada missão traz
`capitulo_id`. O mapa agrupa as missões por capítulo; concluir a última missão de um
capítulo abre a primeira do seguinte no mesmo mapa, sem outro link nem nova escolha
de pessoa. O `contexto` de cada linha da planilha vem da missão ou do capítulo
(`prova` no capítulo de ensino, `revisao_espacada` nos de aplicação e mistura), e a
29ª coluna `capitulo_id` distingue os capítulos na planilha.

Ao fechar um capítulo, o mapa mostra um cartão com uma pergunta de recuperação
opcional (`capitulo.recuperacao`: pergunta e resposta de referência), sem nota,
sem registro e sem obrigação, e lembra que o próximo capítulo rende mais em outra
ocasião. Não trancar capítulo por relógio ou data, não premiar emendar capítulos,
não criar sessão nova por capítulo. A pausa sugerida da 2ª e da 4ª missão conta
dentro do capítulo. "Minhas pistas" reúne os cartões de regra das missões concluídas.
Uma missão intercalada pode emprestar o banco de missões anteriores do mesmo arquivo
com `banco_de: {missoes: [ids]}`. Não adaptar dificuldade automaticamente.

Provas antigas sem `capitulos` continuam funcionando como antes. `trilha` com links
entre arquivos é o formato anterior, mantido só para compatibilidade.

A ferramenta `investigar` recebe `dados.exemplos` com contexto, pergunta,
alternativas, gabarito, explicação e figura opcional. Ela exige escolher e
confirmar uma decisão, oferecendo uma segunda tentativa antes da explicação.
Concluir a tentativa libera o avanço mesmo sem acerto; a atividade não altera XP.
As ferramentas anteriores preservam seu portão de interação.

### Dificuldade
Declarada na criação (1–3), nunca inferida do desempenho — senão não é possível provar
evolução, apenas que as questões ficaram fáceis.
`tipo_raciocinio`: `procedimental` | `conceitual` | `multi-etapa` | `interpretacao`.

### Banco de questões e sorteio
`missao.sorteio.dificuldades` é uma lista como `[1,2,2]`: o **tamanho** é quantas questões
a sessão aplica, e cada item é a dificuldade daquela posição. O motor sorteia uma questão
por item, sem repetir dentro da mesma tentativa. Missão **sem** `sorteio` aplica todas as
questões na ordem escrita — é assim que as provas antigas continuam funcionando.

Por que sortear em vez de gerar: o banco **escolhe entre questões escritas à mão**, então
`questao_id` continua estável e continua sendo possível medir retenção e aposentar questão
ruim. Id gerado na hora não se compara com nada, e dificuldade rotulada por template é uma
média — deixaria de ser verdade item a item, em silêncio.

O build recusa a prova se o banco não tiver questões suficientes de cada nível pedido.
Sem essa checagem o motor cairia no fallback e aplicaria uma questão fora do nível
declarado sem avisar ninguém.

### Missão intercalada — só em revisão, nunca na prova
`missao.intercalada: true` faz uma missão misturar questões de **vários temas**, garantindo
que duas consecutivas nunca sejam do mesmo. É prática intercalada, e é a mudança com a
evidência mais forte de todo o projeto: num ensaio randomizado com 54 turmas (Rohrer et al.,
2020), intercalado bateu bloqueado por **61% contra 38%** num teste-surpresa um mês depois,
d = 0,83. O mecanismo é ela ter de **escolher a estratégia** em vez de recebê-la pronta no
cabeçalho do bloco.

```
missao.intercalada: true
missao.sorteio.por_tema: [1,2]    para CADA tema do pool, uma questão de cada nível
missao.banco_de: {prova, temas}   o build copia as questões daquela prova
missao.regras: [{tema_id, rotulo, texto}]   a "cola" — todas as regras juntas
questao.tema_id / eixo / subtema / habilidade_bncc   carimbados pelo build
```

**Bloco na prova, intercalado na revisão — nessa ordem.** Intercalar sem base bloqueada vira
dificuldade *indesejável* para quem tem pouco conhecimento prévio (Hwang, 2025): aprende no
curto prazo e não consolida a regra. Por isso `contexto: prova` continua com missão de tema
único, e só `revisao_espacada` intercala, sobre temas que ela **já viu**.

**A cola é a acomodação do cartão fixo sobrevivendo à intercalação.** As duas brigam: se o
cartão anunciar de que tema é a questão, a discriminação já está feita e o ganho evapora.
Tirar o cartão também não é opção — ele existe para não carregar nada na memória de trabalho.
A saída é enunciar o **critério de decisão** de todos os temas ao mesmo tempo, sem apontar
qual se aplica agora. Regra prática ao escrever: se a cola resolve a questão, ela está errada.

**Missão intercalada não tem aula nem ferramenta.** Revisão é prática de recuperação, e
reensinar antes de recuperar anula o efeito. O build dispensa `aula`, `ferramenta` e `regra`
(ela tem `regras`, no plural) — e **só** nesse caso.

**Tamanho:** a revisão nasce curta de propósito — ~12 questões, uns 5 minutos — para ser feita
**três vezes** entre uma prova e outra. O critério é 3 recuperações corretas *espaçadas*
(Rawson & Dunlosky); exigir mais numa sessão só não rende. Em crianças, praticar 1 min quatro
vezes bate praticar 4 min de uma vez. Mais ocasiões, não mais questões.

### Ordem das alternativas
O motor **embaralha as alternativas a cada abertura** e remapeia o gabarito. Isso mata a
memorização de posição quando ela refaz uma missão — que é justamente o que a repetição
espaçada precisa que não aconteça.

`questao.alternativas_fixas: true` desliga o embaralhamento para as questões cuja ordem
carrega sentido: sequência de etapas, escala crescente, "nenhuma das anteriores".
Como o motor embaralha, **balancear o gabarito à mão só importa nessas** — e é só nelas
que o build ainda checa o balanceamento.

### Campos de acomodação — obrigatórios, o build recusa sem eles
- `missao.regra` (**obrigatório**): o texto do cartão de regra fixo. Aceita HTML simples.
  Vazio = cartão vazio na tela, e cartão vazio conta como acomodação removida.
- `questao.passos` (opcional): array de strings, uma etapa por item, para o andaime
  "quebrar em partes". Vive **na questão**, ancorado no `questao_id` — nunca numa tabela
  externa indexada por posição, porque a ordem das questões muda entre provas.

### Figuras
`questao.figura` é `null` ou um objeto tipado. O motor é dono da moldura (`<figure>`,
legenda); o JSON é dono do conteúdo.
- `{tipo:'barras', fonte:'missao'}` — renderiza `missao.dados.serie` como gráfico de barras.
  A série vive **na missão**, não na questão: a ferramenta manipulável e as questões daquela
  missão leem o mesmo array, então não há como um número mudar num lugar e não no outro.
- `{tipo:'svg', conteudo:'<svg…>', legenda:'…'}` — desenho avulso, para figuras que nenhum
  renderizador genérico resolveria (ex.: retângulo com canto recortado).

---

## 5. Telemetria — uma linha por questão

Nunca uma linha por prova: resumo não se desagrega, detalhe se agrega com fórmula.

Campos: `evento_id`, `sessao_id`, `timestamp`, `aluna`, `materia`, `eixo`, `tema_id`,
`subtema`, `questao_id`, `habilidade_bncc`, `escola`, `ano_aluna`, `nivel_conteudo`,
`bimestre`, `contexto`, `resultado` (`acerto_1a`|`acerto_2a`|`erro`), `usou_dica`,
`usou_andaime`, `dificuldade`, `tipo_raciocinio`, `seg_ate_1o_toque`, `seg_total`,
`saiu_da_tela`, `tempo_valido`, `retomada`, `posicao_na_sessao`, `modo_foco`, `dispositivo`
e, desde 08/09, `capitulo_id` (29ª coluna, vazia em eventos antigos).

**Sobre tempo:** medir até o **primeiro toque** (leitura + decisão); depois disso é ruído.
Marcar `tempo_valido = false` se houve saída de tela (Page Visibility API) ou se passou de
~3 min. Analisar por **mediana**, comparando ela com ela mesma — nunca com padrão externo.

**Sobre sessão:** `sessao_id` expira após **3 h paradas**. Fechar a aba e voltar logo não
abre sessão nova (vira `retomada = true`); voltar no dia seguinte abre, e `posicao_na_sessao`
recomeça em 1. Sem esse teto, duas ocasiões de estudo viravam uma só e a exigência de
**3 sessões distintas** da seção 2 nunca era satisfeita honestamente.

Novos IDs de sessão incluem o `prova_id` como prefixo, para distinguir encontros
na planilha sem alterar suas 28 colunas originais (a 29ª, `capitulo_id`, chegou em 08/09). IDs antigos retomados ficam como estão
até a expiração. A coluna continua sendo um identificador opaco para o dashboard.
Primeiro toque inclui alternativa, dica ou andaime. O tempo total termina antes
da leitura do feedback final; intervalos entre eventos não medem diretamente aula.

**Aba "Recentes".** A aba Eventos é um log e só cresce; leitores que acessam a planilha
pelo Drive devolvem um trecho limitado (~33 mil caracteres) a partir da PRIMEIRA aba.
Por isso o Apps Script mantém a aba `Recentes` em primeiro lugar: uma fórmula QUERY
sobre Eventos com os últimos 14 dias, no máximo 120 linhas, 20 colunas, da mais nova
para a mais antiga (`garantirRecorte_`, criada na primeira gravação ou por `criarRecorte`
no editor). É essa aba que se lê para análise de sessão; Eventos continua sendo a
fonte completa. Perfis `(teste)` aparecem nela e são filtrados por quem lê.

Envio: `fetch` com `mode:'no-cors'` para o Apps Script. Falha ou ausência de URL → fila em
`localStorage`, reenviada na próxima abertura. Sempre existe fallback manual de cópia.

### Dashboard dos pais
`apps-script/dashboard.html`, servido pelo `doGet` do mesmo projeto Apps Script em uma
**segunda implantação** ("como usuário que acessa" + conta Google). O acesso é o
compartilhamento da planilha — nada de senha no código, nada de e-mail no repo.
**Nunca publicar no `docs/`**: junta nome e desempenho das meninas, e Pages é público.

Regras do dash: uma aluna por vez (nunca as duas no mesmo eixo); a métrica é acerto
sem apoio (seção 2), nunca XP/placar; com <10 eventos ou <3 sessões o card diz
"ainda não sei" em vez de número; linhas de aluna com `(teste)` são filtradas no
servidor E no cliente; o rodapé lembra que nenhum número é comentado com as meninas.
Preview local: `node scripts/preview-dash.mjs [pasta] --servir` (saída nunca em `docs/`).

---

## 6. Restrições técnicas

- **Zero dependências em runtime.** Um único HTML, offline-first. Fontes via CDN, com
  fallback de sistema.
- **Persistência em cascata:** `window.storage` → `localStorage` → memória. Nunca assumir que
  uma delas existe.
- **Retomada obrigatória.** XP, medalhas, sequência e modo foco precisam sobreviver a
  fechar a aba. Gravar `modId` (nome), não índice — a ordem das missões muda.
  **Exceção deliberada:** a posição dentro de uma missão inacabada não sobrevive. Uma
  missão só conta quando termina; sair pela metade (pelo botão ou fechando a aba) faz
  ela recomeçar pela aula. O XP já ganho fica, e as linhas já emitidas nunca são
  apagadas — são fatos do que aconteceu.
- Hospedar em origem `https://` (GitHub Pages). `file://` bloqueia o envio à planilha.
- O Drive **não serve HTML como página**: serve para insumos (fotos dos roteiros) e saídas
  (exports da planilha), não para hospedagem nem para o repositório Git.

---

## 7. Ao criar uma prova nova

1. Partir do roteiro real da professora (foto/PDF). **Não inventar tópico fora do roteiro.**
2. Mapear cada tópico a um `tema_id` do catálogo; criar entrada nova se não existir.
3. Consultar o log antes de definir dificuldade — aplicar a tabela da seção 2.
4. Balancear o gabarito só nas questões `alternativas_fixas` — o motor embaralha o resto.
5. Toda missão de prova precisa de: regra curta, aula fatiada, **uma ferramenta manipulável**
   e um banco com pelo menos o dobro do que o `sorteio` aplica. Banco do tamanho exato do
   sorteio não é banco: sorteia sempre as mesmas.
   Missão **intercalada** é a única exceção — não tem aula nem ferramenta, e traz `regras`.
6. A aula não pode ser atravessada a toques: na tela da ferramenta, avançar exige uma
   interação com o widget. Veio de medida, não de palpite — no log de 25/08 a aula ficou
   com 20% do tempo da sessão, 3,1 s por tela. Nunca use temporizador para isso.
7. Ordenar as missões começando pelos temas mais frágeis (atenção é melhor no início).
   **Não automatizar isso.** A evidência de fadiga por posição é de 15 anos e a de ancoragem
   na autoavaliação é de adultos; nenhuma transfere com segurança para 10 anos. Pior: começar
   difícil ancora a impressão dela e essa impressão **não se corrige** conforme a prova
   afrouxa — caro demais para quem o projeto inteiro protege de virar veredito de placar.
8. Rodar `node build.mjs <prova_id>` e testar a retomada antes de publicar.

## 8. Pendências conhecidas

- [ ] Códigos BNCC do `catalogo-temas.json` estão marcados `bncc_conferida: false` —
      **conferir com a professora** antes de usar em conversa com a escola.
- [ ] Implantar o Apps Script (duas implantações) e pôr a URL `/exec` da telemetria
      no secret `SHEET_URL` do repositório. Enquanto isso, o app roda em fila local
      + botão "Copiar resultados", e o dashboard não tem de onde ler.
- [x] Publicação por GitHub Action com o segredo — feito; `docs/` saiu do versionamento.
- [ ] Ferramentas de língua (`conector`, `destacar`, `montar`, `transformar`) já
      nascem parametrizadas por `missao.dados`: a próxima prova de língua não deve
      precisar tocar no motor. Se precisar, o dado é que faltou generalidade.
- [ ] Ferramentas de matemática ainda vivem no motor e ainda embutem conteúdo de prova
      (`3,472` em `valor`, a sacola 3/5/2 em `prob`, os exemplos de `contas`).
      Só `grafico` já lê os dados da missão. Parametrizar as outras.
- [x] Telemetria por questão — feito, 29 campos (28 originais + `capitulo_id`), uma linha por questão respondida.
