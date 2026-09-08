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
detalhe se agrega com fórmula. As 28 colunas estão em `COLUNAS` (`src/motor.html`)
e espelhadas em `CAMPOS` (`apps-script/enviar.gs`); mexeu numa, mexa na outra.

Novas sessões incluem o `prova_id` no identificador da coluna Sessão. Isso permite
distinguir os encontros de uma sequência mantendo as 28 colunas existentes;
sessões antigas retomadas preservam o ID original até expirar.

## Hugo Cabret — três encontros

O [roteiro do responsável](guides/hugo-study-sequence.md) organiza ensino guiado,
aplicação em situações novas e recuperação posterior. O terceiro encontro é
opcional e pressupõe que os temas já tenham sido trabalhados. Cada arquivo tem
progresso próprio por pessoa e 14 questões por passagem.

```bash
node build.mjs 2026-09-hugo-session-1-y5
node build.mjs 2026-09-hugo-session-2-y5
node build.mjs 2026-09-hugo-session-3-y5
node scripts/servir.mjs
```

Abra o índice local e escolha **Encontro 1**. O teste inicial continua disponível
no JSON original como referência histórica. Seu endereço público agora abre o
primeiro encontro da sequência:
[Hugo Cabret](https://mattusca.github.io/missao-estudos/2026-09-hugo-cabret-y5.html).
O mapeamento em `data/publication-routes.json` preserva o link compartilhado e
usa diretamente o conteúdo do encontro 1; não há redirecionamento nem duas cópias
de conteúdo para manter. Os encontros seguintes são acessíveis pela própria página.

Verificação da sequência e do motor: `node --test tests/motor.test.mjs tests/study-sequence.test.mjs`.
O segundo teste gera os três HTMLs sem envio à planilha e verifica o banco emprestado,
os sorteios e o contrato das 28 colunas. O validador editorial aceita um caminho:
`python scripts/validar-conteudo.py data/provas/2026-09-hugo-session-1-y5.json`.
