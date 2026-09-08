# Missão Estudos

Revisões interativas para provas escolares. Motor único em HTML + conteúdo em JSON.

## Uso rápido

```bash
node build.mjs 2026-08-matematica-y5     # gera docs/2026-08-matematica-y5.html
node scripts/servir.mjs                  # http://localhost:4173 para testar
```

**Publicar é dar push.** O GitHub Actions (`.github/workflows/publicar.yml`) gera todas
as provas com a `SHEET_URL` do secret e publica no Pages:
<https://mattusca.github.io/missao-estudos/>

`docs/` é saída de build e **não é versionada** — é o que mantém a URL do Apps Script
fora do repositório, que é público.

## Estrutura

| Caminho | O quê |
|---|---|
| `CLAUDE.md` | Pedagogia, esquema de dados e convenções. **Ler primeiro.** |
| `AGENTS.md` | Entrada do Codex, com leitura obrigatória das regras comuns |
| `guides/narrative-guide.md` | Roteiro, voz e revisão editorial para Claude e Codex |
| `guides/hugo-study-sequence.md` | Sequência de três encontros de Hugo e critérios para ajustar o estudo |
| `data/catalogo-temas.json` | Taxonomia de temas (tema_id, eixo, BNCC) |
| `data/provas/*.json` | Conteúdo de cada prova |
| `data/publication-routes.json` | Endereços públicos que passam a usar conteúdo de outro arquivo, sem cópia |
| `src/motor.html` | Motor: XP, storage, navegação, envio |
| `build.mjs` | Injeta o JSON no motor |
| `docs/` | Saída de build — gerada, não versionada, não editar à mão |
| `.github/workflows/publicar.yml` | Build com o secret + publicação no Pages |
| `apps-script/enviar.gs` | Endpoint do Google Sheets + `doGet` do dashboard |
| `apps-script/dashboard.html` | Dashboard dos pais (nunca publicado no Pages) |
| `scripts/extrair.mjs` | Migração do monolito antigo para JSON (uso único) |

## Setup da planilha

Passo a passo completo no topo de `apps-script/enviar.gs`. Em resumo: um projeto
Apps Script na planilha, com **duas implantações** — uma recebe a telemetria
(executar como: eu · acesso: qualquer pessoa), outra serve o dashboard dos pais
(executar como: usuário que acessa · acesso: conta Google).

A URL `/exec` da telemetria vai para o **secret `SHEET_URL`** do repositório:

```bash
gh secret set SHEET_URL
```

O build a injeta no HTML; ela nunca entra no repositório. Para testar localmente:

```bash
SHEET_URL="https://script.google.com/macros/s/SEU_ID/exec" node build.mjs 2026-08-matematica-y5
```

Sem `SHEET_URL`, o app não quebra: cada questão respondida vai para uma fila em
`localStorage` e sai pelo botão "Copiar resultados" no fim, em TSV colável.

O acesso ao dashboard é o **compartilhamento da planilha** — quem o Sheets barra,
o dash barra igual. Nenhuma senha no código, nenhum e-mail no repositório.

## Telemetria

Uma linha por questão respondida — nunca por missão. Resumo não se desagrega;
detalhe se agrega com fórmula. As 29 colunas estão em `COLUNAS` (`src/motor.html`)
e espelhadas em `CAMPOS` (`apps-script/enviar.gs`); mexeu numa, mexa na outra.

Novas sessões incluem o `prova_id` no identificador da coluna Sessão. Isso permite
distinguir os encontros de uma sequência mantendo as 28 colunas anteriores e acrescentando a 29ª, `capitulo_id`;
sessões antigas retomadas preservam o ID original até expirar.

## Hugo Cabret — três encontros

O [roteiro do responsável](guides/hugo-study-sequence.md) organiza ensino guiado,
aplicação em situações novas e recuperação posterior. Desde 08/09 os três encontros
são **capítulos de um artefato só** (`data/provas/2026-09-hugo-trilha-y5.json`):
concluir o último desafio de um capítulo abre o seguinte no mesmo mapa, sem outro
link e sem escolher a pessoa de novo. O capítulo 3 é opcional e pressupõe que os
temas já tenham sido trabalhados. O progresso é por pessoa; a passagem completa tem
46 questões (16 + 16 + 14).

```bash
node build.mjs 2026-09-hugo-trilha-y5
node scripts/servir.mjs
```

O endereço público continua o mesmo e abre a trilha:
[Hugo Cabret](https://mattusca.github.io/missao-estudos/2026-09-hugo-cabret-y5.html).
`data/publication-routes.json` aponta esse nome e os antigos `session-1/2/3` para o
mesmo conteúdo, sem redirecionamento e sem cópias. O teste inicial de 07/09 continua
no JSON `2026-09-hugo-cabret-y5.json` como referência histórica, não publicado.

Verificação da sequência e do motor: `node --test tests/motor.test.mjs tests/study-sequence.test.mjs`.
O segundo teste gera a trilha e as rotas sem envio à planilha e verifica o banco
interno, os capítulos, os sorteios e o contrato das 29 colunas. O validador editorial aceita um caminho:
`python scripts/validar-conteudo.py data/provas/2026-09-hugo-trilha-y5.json`.
