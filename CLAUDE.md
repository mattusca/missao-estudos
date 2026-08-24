# Missão Estudos

Gerador de revisões interativas para provas escolares. Um motor (HTML/JS) + conteúdo em JSON.
Cada prova nova é **um arquivo de dados**, nunca uma reescrita do motor.

Responsável: Marco. Contexto da aluna e dos dados: `CONTEXTO-PRIVADO.md` (não versionado).

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
docs/                         saída publicada (GitHub Pages)
apps-script/enviar.gs         endpoint que grava na planilha
```

Fonte da verdade é sempre o JSON. **Nunca editar o HTML de `docs/` à mão** — ele é gerado.

---

## 4. Convenções

### IDs de tema — `MATERIA.EIXO.TOPICO`
Alinhados aos eixos da BNCC, para comparar entre anos escolares.
`MAT.NUM.DEC` · `MAT.NUM.FRA` · `MAT.NUM.MUL10` · `MAT.NUM.OPDEC` ·
`MAT.GEO.AREAPER` · `MAT.PROB.SIMPLES` · `MAT.EST.GRAF`
Futuros: `POR.LEI.INTERP`, `CIE.VID.ECOSS`.

**Regra dura:** `tema_id` nunca codifica dificuldade nem ano escolar. Se codificar, o tema
deixa de ser comparável quando reaparece numa série seguinte.

`questao_id` = `<tema_id>.Q<n>` e é **estável entre provas**. É ele que permite medir retenção
quando a mesma questão reaparece semanas depois.

### Campos de contexto
- `ano_aluna` (em que ano ela está) e `nivel_conteudo` (para que ano o conteúdo foi feito)
  são **campos separados**. Iguais hoje; deixam de ser quando ela revisar Y5 já no Y6.
- `contexto`: `prova` | `revisao_espacada` | `treino_livre`. Véspera de prova e sábado à toa
  não são comparáveis.

### Dificuldade
Declarada na criação (1–3), nunca inferida do desempenho — senão não é possível provar
evolução, apenas que as questões ficaram fáceis.
`tipo_raciocinio`: `procedimental` | `conceitual` | `multi-etapa` | `interpretacao`.

---

## 5. Telemetria — uma linha por questão

Nunca uma linha por prova: resumo não se desagrega, detalhe se agrega com fórmula.

Campos: `evento_id`, `sessao_id`, `timestamp`, `aluna`, `materia`, `eixo`, `tema_id`,
`subtema`, `questao_id`, `habilidade_bncc`, `escola`, `ano_aluna`, `nivel_conteudo`,
`bimestre`, `contexto`, `resultado` (`acerto_1a`|`acerto_2a`|`erro`), `usou_dica`,
`usou_andaime`, `dificuldade`, `tipo_raciocinio`, `seg_ate_1o_toque`, `seg_total`,
`saiu_da_tela`, `tempo_valido`, `retomada`, `posicao_na_sessao`, `modo_foco`, `dispositivo`.

**Sobre tempo:** medir até o **primeiro toque** (leitura + decisão); depois disso é ruído.
Marcar `tempo_valido = false` se houve saída de tela (Page Visibility API) ou se passou de
~3 min. Analisar por **mediana**, comparando ela com ela mesma — nunca com padrão externo.

Envio: `fetch` com `mode:'no-cors'` para o Apps Script. Falha ou ausência de URL → fila em
`localStorage`, reenviada na próxima abertura. Sempre existe fallback manual de cópia.

---

## 6. Restrições técnicas

- **Zero dependências em runtime.** Um único HTML, offline-first. Fontes via CDN, com
  fallback de sistema.
- **Persistência em cascata:** `window.storage` → `localStorage` → memória. Nunca assumir que
  uma delas existe.
- **Retomada obrigatória.** Toda alteração de estado precisa sobreviver a fechar a aba.
  Gravar `modId` (nome), não índice — a ordem das missões muda.
- Hospedar em origem `https://` (GitHub Pages). `file://` bloqueia o envio à planilha.
- O Drive **não serve HTML como página**: serve para insumos (fotos dos roteiros) e saídas
  (exports da planilha), não para hospedagem nem para o repositório Git.

---

## 7. Ao criar uma prova nova

1. Partir do roteiro real da professora (foto/PDF). **Não inventar tópico fora do roteiro.**
2. Mapear cada tópico a um `tema_id` do catálogo; criar entrada nova se não existir.
3. Consultar o log antes de definir dificuldade — aplicar a tabela da seção 2.
4. Balancear o gabarito: distribuir as respostas corretas entre as alternativas,
   sem padrão que possa ser decorado.
5. Toda missão precisa de: regra curta, aula fatiada, **uma ferramenta manipulável** e 3 questões.
6. Ordenar as missões começando pelos temas mais frágeis (atenção é melhor no início).
7. Rodar `node build.mjs <prova_id>` e testar a retomada antes de publicar.

## 8. Pendências conhecidas

- [ ] Códigos BNCC do `catalogo-temas.json` estão marcados `bncc_conferida: false` —
      **conferir com a professora** antes de usar em conversa com a escola.
- [ ] Motor ainda é monolítico (`src/motor.html`); separar as ferramentas em módulos.
- [ ] Telemetria por questão ainda não implementada (hoje é por missão).
- [ ] Colar a URL do Apps Script em `SHEET_URL`.
