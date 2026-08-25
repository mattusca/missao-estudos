# Pendências

## Escopo fechado em 25/08 — evolução do artefato

**Todos os seis implementados, auditados e publicados em 25/08 (noite).**
O que sobra de cada um está anotado abaixo do item.

Ordenado por retorno esperado sobre custo. Nada disso entra antes da prova de 26/08.
A pesquisa que embasa cada item está no changelog da mesma data.

### ✅ 1. A aula precisa custar mais que um toque — **decisão do Marco, pendente**
O "próximo" da tela da ferramenta só habilita depois de um toque no widget.
**Por quê:** no log de 25/08 a aula ficou com 20% do tempo da sessão — 3,1 s por tela,
em 28 telas. As questões receberam 80%. Nenhum ajuste de quantidade conserta isso.
**Objetivo:** devolver à instrução mais da metade do tempo da sessão.
**Ressalva:** é atrito deliberado numa criança com dificuldade de atenção, da mesma
família da confirmação em dois toques. Por isso a chamada é do Marco, não minha.

### ✅ 2. Intercalar as revisões espaçadas
Missão de tema único continua em `contexto: prova`. `revisao_espacada` passa a
misturar questões de temas que ela já viu.
**Por quê:** Rohrer et al. 2020 (RCT, 54 turmas): 61% × 38% num teste-surpresa um mês
depois, d = 0,83. E três questões seguidas do mesmo tema é prática massada — intercalar
espaça as recuperações sem tirar nem pôr uma questão.
**Objetivo:** ela escolher a estratégia em vez de recebê-la pronta no cabeçalho do bloco.
**Ressalva:** Hwang 2025 — intercalar sem base bloqueada é dificuldade *indesejável* para
quem tem pouco conhecimento prévio. Por isso bloco na prova, intercalado só na revisão.

### ✅ 3. Cartão de regra vira cola de todas as regras (só nas revisões intercaladas)
**Por quê:** o cartão fixo e a intercalação brigam — se ele anuncia o tema, a
discriminação já está feita e o ganho do item 2 evapora. Tirar o cartão não é opção:
é acomodação.
**Objetivo:** nada na memória de trabalho dela, nada entregue de bandeja.

### ✅ 4. Revisão espaçada nasce menor e repetida
9–12 questões, ~5 min, desenhada para ser feita **três vezes** entre uma prova e outra.
**Por quê:** Rawson & Dunlosky — o critério é 3 recuperações corretas espaçadas; exigir
4 não traz benefício. Em crianças, praticar 1 min quatro vezes bate 4 min de uma vez.
Cepeda: com prova em duas semanas, revisar por volta do 3º e do 7º dia.
**Objetivo:** trocar "mais questões" por "mais ocasiões", que é onde está a evidência.
Sessão curta também encurta a distância entre esforço e recompensa.

### ✅ 5. Retenção como entrada da calibragem
Mesmo `questao_id` reaparecendo semanas depois.
**Por quê:** Bjork — desempenho durante a prática é índice ruim de aprendizagem. Hoje a
seção 2 lê só a sessão corrente, que é exatamente a medida que ilude o instrutor.
**Objetivo:** calibrar por retenção medida com atraso, não por placar do dia.
É trabalho de dashboard, não de motor.

### ✅ 6. Encher o banco
- [ ] Language Arts: 4 das 7 missões ainda não têm nenhuma questão de dificuldade 3
      (conectores, continuous, modais, plurais); narrativa não tem nenhuma de nível 1.
- [ ] Matemática: 21 questões, sem `sorteio` — continua no formato antigo.
**Objetivo:** banco maior serve a todos os cenários e não depende de decisão pendente.

### Descartados em 25/08 — sem lastro de pesquisa
Registrados com o motivo para não serem reinventados daqui a três meses.

| Ideia | Por que caiu |
|---|---|
| Tela final visual (mapa de medalhas no lugar do XP) | Nenhuma evidência a favor. Meta-análises de gamificação acham efeito pequeno-a-moderado, mais extrínseco que intrínseco, com risco de sobrejustificação — aumentar a camada de recompensa sem necessidade é o movimento errado. |
| Ilustração decorativa por missão | **Pesquisa contra**: meta-análise do efeito de detalhes sedutores; em leitores iniciantes, simplificar as ilustrações melhorou atenção e compreensão. Sobrevive só a figura que EXPLICA — e para isso já existe `questao.figura`. |
| Micro-movimento decorativo | Mesma pesquisa. Sobrevive só o movimento que carrega informação (barra de XP enchendo). |

### Restrição permanente de reforço
O `+XP` continua aparecendo **no instante da resposta**. Aversão a atraso em TDAH não é
só preferir recompensa imediata: o atraso carrega valência afetiva negativa. Enfileirar o
reforço atrás de uma animação bonita quebra uma acomodação com um enfeite.

### Congelados, com motivo
| | Por quê |
|---|---|
| Ordenar missões por desempenho | Evidência de adultos (ancoragem) e de 15 anos (fadiga). Não transfere com segurança para 10 anos. |
| Dificuldade adaptativa em tempo real | Princípio tem apoio (Metcalfe), gatilho e tamanho de amostra não. Destruiria a comparabilidade de "acerto sem apoio". |
| Mudar as 21 questões da prova | 7 min de sessão contra 20–30 min de atenção sustentada esperada. O tamanho está certo; o arranjo é que não (ver item 2). |

- [x] Banco de questões com sorteio por dificuldade — feito em 25/08.
- [x] Alternativas embaralhadas com gabarito remapeado — feito em 25/08.

## Questões para reler no log
- [ ] `ING.ESC.CONECT.Q2` — 41 s até o 1º toque e erro. Reli: a questão está correta,
      o tropeço provável é gramatical ("In addition to" não abre frase com vírgula).
      Vale ver se cai de novo agora que `ING.ESC.CONECT.Q6` treina exatamente isso.
- [ ] `ING.CLI.PLUIRR.Q2` — erro em 8 s numa dificuldade 1. Reli: a armadilha
      ("sheeps") é intencional e funcionou. É pressa, não questão ruim.

## Prova de Language Arts (26/08)
- [ ] Marco: testar a prova antes de a Alícia usar (25/08).
      https://mattusca.github.io/missao-estudos/2026-08-language-arts-y5.html
      **Escolher "Marco (teste)" na tela de identidade** — teste de adulto gravado
      no nome dela envenena a calibragem.
- [ ] Conferir com o roteiro se algum tópico ficou de fora ou fora de foco.

## Antes de considerar o circuito fechado
- [ ] Marco: rodar o roteiro de teste manual (abaixo) no aparelho da Alícia.
- [x] Implantar `apps-script/enviar.gs` + `dashboard.html` — feito em 25/08,
      duas implantações no ar.
- [ ] Compartilhar a planilha com a Fernanda (leitor) e testar o dash na conta dela.
- [x] `gh secret set SHEET_URL` — feito; build imprime "envio para a planilha: ATIVO".
- [x] Confirmado: questão respondida vira linha na aba `Eventos`, 28 colunas.
- [x] Proteção anti-fórmula verificada no endpoint em 25/08 (Version 3):
      `=1+1` gravado como texto literal, não avaliado como `2`.
- [ ] Confirmar a deduplicação: responder offline, voltar online, reabrir,
      e checar que a fila subiu sem duplicar linha.
- [ ] Apagar a linha `teste-seguranca-002` da planilha quando quiser (inofensiva:
      é texto inerte e `(teste)`, filtrada do dashboard).

## Depois do teste manual passar
- [x] GitHub Action: build com `SHEET_URL` de secret + publicação no Pages.
      `docs/` saiu do versionamento — era a via pela qual a URL voltaria ao repo.
- [ ] Parametrizar as ferramentas restantes (hoje só `grafico` lê `missao.dados`).
      `valor` embute `3,472`, `prob` a sacola 3/5/2, `contas` os exemplos numéricos.
- [ ] Conferir os códigos BNCC com a professora (`bncc_conferida: false`).

## Dashboard — quando houver volume real de dados
- [ ] Retenção: mesmo `questao_id` reaparecendo semanas depois (fixou ou evaporou).
- [ ] QA de questões: todo mundo erra = mal escrita; 100% na 3ª aparição = aposentar.
- [ ] Decidir os campos `resposta_1a`/`resposta_2a` (qual distrator foi marcado) e a
      aba `provas_reais` (nota da escola como variável de resultado). São mudança de
      schema — baratas agora, irrecuperáveis depois. Decisão separada do dash.

## Roteiro de teste manual

```bash
node build.mjs 2026-08-matematica-y5
node scripts/servir.mjs
```

Abrir `http://localhost:4173/2026-08-matematica-y5.html`.

1. **Mapa** — título, "Y5 · Matemática", 7 missões começando por "Ler gráficos"
   e terminando em "Decimais sob controle". Só a 1ª destravada.
2. **Aula** — 4 telas; na 3ª, o gráfico responde ao toque em duas barras.
3. **Cartão de regra** — no topo dos desafios, com texto. Vazio = defeito.
4. **Dois toques** — 1º seleciona (fica roxo), 2º confirma. Um toque só não responde.
5. **2ª tentativa** — errar na 1ª elimina só a alternativa escolhida, sem gabarito.
6. **Andaime** — 🧩 aparece na 3ª questão de gráficos e revela uma etapa por vez.
7. **Escudo** — no 1º erro da missão a sequência não zera e aparece o aviso.
8. **Modo foco** — desliga fundo quadriculado, sombras e confete.
9. **Sair pelo mapa** — "← Voltar ao mapa" na aula sai direto; nos desafios
   pergunta antes. O XP já ganho continua; a missão recomeça pela aula.
10. **Retomada** — fechar a aba no meio e reabrir: XP e medalhas preservados,
    e a missão inacabada volta ao início ("É só tocar nela para fazer do início").
11. **Envio** — com `SHEET_URL`, uma linha por questão na aba `Eventos`.
    Sem ela, "Copiar resultados" no fim gera TSV de 28 colunas.

**Nunca deve aparecer**: qualquer cronômetro ou contagem de tempo na tela da aluna.
