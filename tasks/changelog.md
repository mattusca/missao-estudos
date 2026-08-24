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
