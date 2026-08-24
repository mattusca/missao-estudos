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
4. Copiar a URL `/exec` e colar em `SHEET_URL` no motor
