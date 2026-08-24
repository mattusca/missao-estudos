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
