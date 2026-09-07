# Proposta — Missão "A Invenção de Hugo Cabret"

Status: **v1 implementada em 07/09/2026** (`data/provas/2026-09-hugo-cabret-y5.json`), com as premissas de §0 assumidas e sem a ferramenta `fotogramas`. Ver changelog. Proposta escrita em 07/09/2026 a partir do mapa do motor
e de guias de leitura do livro. Decisões marcadas com ⚠️ dependem do Marco.

---

## 0. Premissas (confirmar antes de escrever uma linha)

| Premissa | Por que importa | Como confirmar |
|---|---|---|
| Matéria é **Língua Portuguesa** (edição SM, trad. Marcos Bagno, 534 p.) | Define `POR.*` no catálogo e enunciados em português. Se for Language Arts, muda idioma e tema | Roteiro da professora |
| A escola cobra o **livro inteiro** (Parte 1 + Parte 2) | Metade das perguntas clássicas está na Parte 2 (Méliès, Tabard, final) | Roteiro / data da prova |
| Comparação **livro × filme** (Scorsese, 2011) **não** está no roteiro | É o tipo de questão mais comum em material brasileiro, mas só entra se a escola exibiu o filme | Roteiro |
| Há um **roteiro real** da professora | Seção 7 do CLAUDE.md: nunca inventar tópico fora do roteiro. Sem roteiro, esta proposta é a lista de "o que se costuma cobrar", não a prova | Foto do roteiro |

O catálogo hoje **não tem nenhum tema `POR.*`**. O build recusa `tema_id` fora do
catálogo, então o passo 1 da implementação é criar as entradas (com `bncc_conferida: false`,
como as demais).

---

## 1. O que se cobra sobre o livro aos 10 anos

Levantado em guias de professor (Scholastic, Ferguson Library, Reed Novel Studies, grade 5),
LitCharts/Shmoop e materiais brasileiros (SM, roteiro de leitura da edição SM, artigo UFSC).
Ordenado por frequência:

1. **Sequência de acontecimentos** e linha do tempo (Parte 1: caderno → acordo com o velho →
   chave-coração → autômato desenha a Lua; Parte 2: assinatura "Georges Méliès" → biblioteca
   da Academia → Tabard e o projetor → Georges conta sua história → trilhos → homenagem).
2. **Causa e consequência**: por que Hugo rouba, por que o velho confisca o caderno, por que
   Georges se esconde, por que Mama Jeanne guarda segredo.
3. **Personagens**: Hugo, Isabelle, Papa Georges (Méliès), Mama Jeanne, Inspetor (sem nome no
   livro; "Gustave" é do filme), Étienne, tio Claude, pai de Hugo, René Tabard, o autômato.
4. **Inferência**: o que o velho quer dizer com "fantasmas"; ele queimou mesmo o caderno?
5. **Temas/mensagens**: máquinas e pessoas têm um propósito; consertar o que está quebrado;
   segredos e confiança; perda e luto; magia do cinema; família escolhida; roubar é certo?
6. **Como o livro conta**: narrativa por **imagens** (284 páginas de desenho que contam, não
   ilustram), técnica de cinema no papel (zoom, perseguição só em desenho), fotogramas reais
   (*Viagem à Lua*, 1902), Méliès e o autômato de Maillardet são reais, Caldecott 2008.
7. **Vocabulário no contexto**: autômato, engrenagem, relojoeiro, dar corda, fotograma,
   projetor, prenúncio.
8. **Símbolos**: caderno (elo com o pai), relógios, chave-coração, Lua com o foguete no olho.
9. **Narrador**: quem conta a história (Hugo adulto, "Professor Alcofrisbas").

Ressalvas do levantamento: a paginação das frases célebres é da edição americana; a
tradução exata em português não foi conferida em fonte editorial. Alguns materiais
brasileiros chamam Isabelle de "sobrinha"; no original é afilhada. **Conferir na edição SM
antes de escrever as questões.**

---

## 2. Arquitetura proposta — mesmo molde de Language Arts

Arquivo: `data/provas/2026-09-hugo-cabret-y5.json`, `contexto: prova`, 6 missões de tema
único, 3 questões aplicadas por missão (18 na sessão), banco ≥ 2× o sorteio (~40 questões).
Cada missão com regra curta, aula fatiada, uma ferramenta manipulável (portão de um toque)
e `passos` nas questões de dificuldade 3. **Nenhuma ferramenta nova é obrigatória**: as
quatro de língua já são parametrizadas por `missao.dados`.

| # | Missão | `tema_id` (novo) | Ferramenta | O que a ferramenta faz aqui | Questões típicas |
|---|---|---|---|---|---|
| 1 | **A linha do tempo** | `POR.LEI.SEQ` | `montar` (fichas de frases) | Ordenar 4–5 marcos de uma parte; cada acerto parcial explica o "porquê" da ordem | "O que aconteceu logo depois de…", "antes de girar a chave…" |
| 2 | **Quem é quem** | `POR.LEI.PERS` | `destacar` | Texto com 6 frases, uma ação de cada personagem; tocar revela o traço que a ação mostra | traço de personagem, comparação Hugo × Isabelle, mudança de Georges |
| 3 | **Por que aconteceu** | `POR.LEI.CAUSA` | `conector` (pares causa/efeito com "porque/então/mas") | Ligar dois fatos do livro com o conector certo e ver se faz sentido | causa e consequência, prenúncio (a cela do Inspetor) |
| 4 | **O que o livro quer dizer** | `POR.LEI.TEMA` | `destacar` | 5–6 frases-chave (paráfrases curtas) e o tema que cada uma carrega | propósito das máquinas/pessoas, consertar, segredos, família |
| 5 | **Palavras da estação** | `POR.LEI.VOCAB` | `conector` (frase com lacuna + chips de palavras) | Escolher a palavra que cabe e ler o sentido | autômato, engrenagem, fotograma, relojoeiro, dar corda |
| 6 | **Um filme de papel** | `POR.LEI.FORMA` | ⚠️ `fotogramas` (nova, ver §3) ou `destacar` | Ver como o livro usa a linguagem do cinema e o que é real na história | imagens que contam, Méliès real, autômato real, narrador |

**Ordem**: a tabela está na ordem "do concreto ao abstrato". A regra do projeto (seção 7,
item 7) é começar pelo tema mais frágil, **decidido pelo Marco**, não automatizado. Sem log
de `POR.*`, não há sinal: sugiro começar por Personagens ou Linha do tempo, que são os mais
seguros para abrir a sessão sem ancorar impressão negativa.

**Dificuldade**: sem histórico no tema, aplicar a mesma distribuição de estreia de Language
Arts (`[1,2,2]` na maioria, `[1,2,3]` em Temas e Forma). `tipo_raciocinio`: majoritariamente
`interpretacao`; `multi-etapa` nas de inferência com `passos`.

**Texto de apoio**: diferente da missão de leitura de LA, aqui o "texto" é o livro que ela
já leu. O `dados.texto` de cada missão é curto (paráfrase de 5–6 frases, ~400 caracteres,
limite prático do cartão fixo) e serve de âncora, não de fonte. As questões devem ser
**autossuficientes** (o enunciado carrega o mini-contexto) — isso é o que permite a revisão
intercalada de §5, onde o cartão não mostra `dados.texto`.

**Direitos autorais**: nada de trecho longo do livro nem de reprodução dos desenhos do
Selznick. Frases-chave em paráfrase ou citação curta com atribuição. Figuras: desenho
próprio em SVG simples.

---

## 3. Recursos visuais, movimento e som — o que cabe e o que não cabe

O projeto já decidiu (todo.md, "Descartados em 25/08") que ilustração decorativa e
micro-movimento decorativo **ficam fora**, com lastro em pesquisa sobre detalhes sedutores.
A proposta segue esse critério: **só entra visual que carrega o conteúdo**. Hugo Cabret é o
caso raro em que a forma visual *é* matéria da prova, então há espaço legítimo, mas pequeno.

### 3.1 Cabe (sem tocar no motor)
- **Figuras SVG em `questao.figura`** (já suportado): desenho próprio, linhas simples, paleta
  do motor. Candidatas: a Lua com o foguete no olho (símbolo cobrado), o relógio com o
  mostrador de vidro (de onde Hugo observa), esquema de engrenagens do autômato com legenda
  (para a questão de vocabulário/mecanismo). Uma figura por missão, no máximo.
- **"Cartaz" de missão** no `aula.corpo` só na missão 6, que trata da linguagem visual.

### 3.2 Cabe, com uma ferramenta nova genérica (⚠️ decisão) 
`fotogramas`: uma tira de 3–5 quadros SVG que avança **por toque** (o toque é o portão da
aula). Cada quadro tem `legenda`. Lê `dados.quadros: [{svg, legenda}]`, então é reutilizável
(qualquer sequência em qualquer prova: etapas de uma conta, fases de um experimento).
Uso aqui: reproduzir a técnica do "zoom" de abertura (Paris → estação → relógio → olho) com
desenhos próprios, para ela perceber que **as imagens contam**, não enfeitam. É a única
mudança de motor da proposta e é opcional: `destacar` cobre a missão 6 sem ela, com menos
força. Custo estimado: uma tarde, incluindo o portão e o modo foco.

### 3.3 Movimento
Apenas o que carrega informação, como já vale para a barra de XP. Na `fotogramas`, a troca
de quadro é um estado, não uma animação. Qualquer transição precisa morrer sob `body.focus`
e sob `prefers-reduced-motion`, que o motor já respeita. Engrenagem girando "para ficar
bonito" não entra.

### 3.4 Som — recomendo **não** incluir
- O motor não tem áudio nenhum, e a restrição de arquivo único offline sem dependências
  torna qualquer asset de som custoso.
- Efeito sonoro é detalhe sedutor por definição e briga com o modo foco.
- A única exceção defensável seria **leitura em voz alta dos enunciados** (`speechSynthesis`,
  nativo do navegador, sem dependência): isso é acomodação, não enfeite. Mas a voz em
  português varia por aparelho, não funciona offline em todos, e não há sinal no log de
  que decodificação de leitura seja o gargalo. Deixar registrado como opção futura, a ser
  acionada só se o log mostrar tempo até o 1º toque muito alto em questões longas.

---

## 4. Preparação antes de aplicar — o protocolo de Language Arts, adaptado

O que foi feito em LA e vale repetir, na ordem:

1. **Insumos**: foto do roteiro da professora; data da prova; edição SM em mãos para conferir
   nomes, relações (afilhada) e os capítulos que a escola cobrou. **Sem roteiro não começa.**
2. **Catálogo**: criar as 6 entradas `POR.LEI.*` (BNCC de Língua Portuguesa existe para o
   5º ano, por exemplo EF35LP03/EF35LP04 para localizar informação e inferir; conferir com a
   professora antes de usar, `bncc_conferida: false`).
3. **Escrever o banco** (~40 questões) com dica, explicação, `passos` nas de nível 3, uma
   figura SVG por missão no máximo. Balancear gabarito só nas `alternativas_fixas` (a linha
   do tempo terá algumas: ordem tem sentido).
4. **Revisão de conteúdo por adulto que leu o livro** antes de qualquer teste: erro de fato
   numa prova de livro é pior que erro de gramática, porque ela confia no que o app afirma.
5. `node build.mjs 2026-09-hugo-cabret-y5` e a suíte de auditoria do HTML publicado (a mesma
   de 25/08): plano de dificuldade, sorteio cobrindo o banco, gabarito remapeado.
6. **Jogada completa como "Marco (teste)"** no tablet e no celular: 18 linhas na planilha,
   portão da ferramenta em todas as missões, retomada, modo foco, cartão fixo sem empurrar a
   1ª alternativa para baixo da dobra (limite de ~400 caracteres no texto de apoio).
7. Push (o Action publica). Só depois a Alícia joga, uma vez, na véspera da semana da prova.

---

## 5. Calendário de estudo (a "preparação" que fizemos com Language Arts)

Language Arts teve a prova completa **e** uma revisão intercalada curta para repetir três
vezes. Aqui dá para fazer igual, com uma vantagem: nenhuma missão depende de um texto de
leitura no cartão, então **todos os 6 temas podem intercalar**.

| Momento | Artefato | Duração |
|---|---|---|
| D-7 a D-6 | `2026-09-hugo-cabret-y5` completa (6 missões, 18 questões, aula + ferramenta) | ~20 min, com as pausas sugeridas |
| D-5, D-3, D-1 | `2026-09-revisao-hugo-y5`: intercalada, `banco_de` a prova, `por_tema: [1,2]` → 12 questões, cola com os 6 critérios de decisão | ~5 min cada |

A cola da revisão (`regras`) precisa enunciar **como decidir** (ex.: "causa vem antes,
consequência vem depois"; "traço de personagem é o que a ação mostra, não o que ela diz"),
sem apontar o tema da questão, como manda a seção 4 do CLAUDE.md.

Calibragem: com ~18 eventos por tema ao fim do ciclo (prova + 3 revisões), a tabela da
seção 2 passa a ter amostra. Antes disso, nada é diagnóstico.

---

## 6. Esforço estimado

| Etapa | Estimativa |
|---|---|
| Catálogo + esqueleto do JSON (6 missões, regras, aulas, dados das ferramentas) | 1 sessão |
| Banco de ~40 questões + figuras SVG | 2 sessões |
| Ferramenta `fotogramas` (se aprovada) | 0,5 sessão |
| Revisão intercalada + auditoria + jogada de teste | 0,5 sessão |

---

## 7. Decisões pendentes do Marco

1. Matéria e idioma: Português (assumido) ou Language Arts?
2. Roteiro da professora e data da prova.
3. Livro × filme entra?
4. Ferramenta `fotogramas` (única mudança de motor) — sim ou fica só com `destacar`?
5. Ordem das missões (qual tema abre a sessão).
6. Som: concordância em deixar fora, com leitura em voz alta registrada como opção futura.
