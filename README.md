# Missão Estudos

Revisões interativas para provas escolares. Motor único em HTML + conteúdo em JSON.

## Uso rápido

```bash
node build.mjs 2026-08-matematica-y5     # gera docs/2026-08-matematica-y5.html
```

Publicar: `docs/` via GitHub Pages (origem https:// é necessária para o envio à planilha).

## Estrutura

| Caminho | O quê |
|---|---|
| `CLAUDE.md` | Pedagogia, esquema de dados e convenções. **Ler primeiro.** |
| `data/catalogo-temas.json` | Taxonomia de temas (tema_id, eixo, BNCC) |
| `data/provas/*.json` | Conteúdo de cada prova |
| `src/motor.html` | Motor: XP, storage, navegação, envio |
| `build.mjs` | Injeta o JSON no motor |
| `docs/` | Saída publicada — **gerada, não editar à mão** |
| `apps-script/enviar.gs` | Endpoint do Google Sheets |
| `scripts/extrair.mjs` | Migração do monolito antigo para JSON (uso único) |

## Setup da planilha

1. Nova planilha no Google Sheets > Extensões > Apps Script
2. Colar `apps-script/enviar.gs`
3. Implantar > App da Web > Executar como: eu > Acesso: qualquer pessoa
4. Copiar a URL `/exec` e usá-la **no build**, não no código:

```bash
SHEET_URL="https://script.google.com/macros/s/SEU_ID/exec" node build.mjs 2026-08-matematica-y5
```

Sem `SHEET_URL`, o app não quebra: cada questão respondida vai para uma fila em
`localStorage` e sai pelo botão "Copiar resultados" no fim, em TSV colável.

⚠️ `docs/` é público no GitHub Pages. O HTML commitado é gerado **sem** a URL de
propósito. Enquanto não existir a publicação por Action, gere o arquivo com a URL
localmente e publique-o sem commitar.

## Telemetria

Uma linha por questão respondida — nunca por missão. Resumo não se desagrega;
detalhe se agrega com fórmula. As 28 colunas estão em `COLUNAS` (`src/motor.html`)
e espelhadas em `CAMPOS` (`apps-script/enviar.gs`); mexeu numa, mexa na outra.
