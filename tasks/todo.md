# Pendências

## 2026-09-08 — Verificação e recuperação do envio de Hugo
- [x] Conferir a origem por intervalo completo, testar o receptor e investigar envio/fila.
- [x] Reproduzir perda por recarga e drenagem antecipada; persistir antes do envio,
      exigir confirmação e testar recuperação sem duplicação.
- [x] Preparar atualização do mesmo endereço: 42 testes, oito builds e recuperação
      offline/fechar/reabrir conferida no navegador com o receptor real.
- [ ] Confirmar o aparelho usado e inspecionar a fila/aba da sessão relatada;
      ausência na planilha não prova ausência de respostas. Copiar resultados de
      uma aba antiga ainda aberta antes de recarregar: ela pode ter dados só em RAM.
- [ ] No próximo ajuste do receptor, isolar a criação de `Recentes` da gravação
      principal: erro na aba auxiliar não deve impedir o append em `Eventos`.
      Responsável: Codex; motor, testes e integração estritamente necessária.
      Preservar dados locais e alterações existentes; não inserir dados pessoais
      ou URL privada nos arquivos versionáveis.

## 2026-09-08 — Comparativo privado das duas sessões de Hugo
- [x] Transformar o comparativo em HTML independente com apresentação editorial,
      em pasta temporária externa ao repositório; conferir desktop e celular.
- [x] Ler os registros de 07/09, separar sessões/pessoa e conferir métricas e versões.
- [x] Criar dashboard comparativo privado, com resultados observados e limites da amostra.
- [x] Auditar cálculos e conferir a visualização no navegador.
      Responsável: Codex; dados e visual fora do repositório público, somente leitura
      da planilha. Sem alterar o artefato escolar ou publicar no Pages.
      Revisão independente dos cálculos e do contrato histórico da telemetria;
      visual conferido em tela estreita/larga e em temas claro/escuro.

## 2026-09-08 — Auditoria da implementação 5158477
- [x] Auditar motor, dados, build/publicação e telemetria; reproduzir findings.
      Responsável: Codex, com revisores independentes de escopo separado.
      Somente auditoria e registros; sem corrigir código ou publicar.
- [ ] Resolver a perda de capitulo_id enquanto o receptor publicado declara 28
      campos; revisar o intervalo afetado sem presumir recuperação por reenvio.
- [ ] Corrigir exportação após o primeiro final, overflow de medalhas em 390 px,
      recuperação apagada ao voltar das pistas e ausência de saída de descanso no final.
- [ ] Corrigir importação de window.storage e de progresso atualizado numa aba
      legada após a primeira importação; barrar IDs duplicados dentro de missão emprestada.

## 2026-09-08 — Plano do painel infantil de evolução
- [ ] **Marco: criar a aba Recentes** — no editor do Apps Script, colar o `enviar.gs`
      atual, escolher a função `criarRecorte` e clicar em Run (sem reimplantar). Ou
      reimplantar: a aba nasce sozinha na próxima gravação. Conferir que "Recentes" é a
      primeira aba e mostra as sessões de 7/9.
- [x] Plano revisado por Claude (08/09) e implementado no mesmo dia: trilha única em
      capítulos, cartão de recuperação opcional, "Minhas pistas", coluna 29, rotas.
- [x] Apps Script reimplantado por Marco em 08/09 às 17:09 (versão 4, mesma URL do
      segredo). Endpoint responde "29 campos por evento". A coluna Capítulo entra na
      aba na primeira gravação; conferir na planilha após a próxima resposta.
- [ ] Mapa em SVG da estação (etapa D do plano), depois da prova.
- [ ] Observar com a Alícia: ela encontra o capítulo 2 sem perguntar? aceita a pergunta
      de recuperação? Sem cobrar resposta.
- [x] Consolidar a visão final sobre a revisão do Claude, com crítica adversarial
      e recomendação de executor; editar o mesmo plano, sem criar arquivos.
      Responsável: Codex; escopo documental, sem implementar ou publicar.
- [x] Integrar a discussão enviada por Marco: artefato único em capítulos, mapa
      visual persistente e transições com pausas; conciliar histórico e migração.
      Responsável: Codex; escopo documental no plano e nos registros desta tarefa.
- [x] Definir experiência, recompensas positivas e regras de comparação por artefato/pessoa.
- [x] Especificar dados mínimos, estados sem histórico e critérios de validação.
- [x] Revisar o plano e entregar documento para discussão com Claude.
      Responsável: Codex; apenas `guides/student-progress-dashboard-plan.md` e
      registros de planejamento. Sem implementação, build, commit ou publicação.
- [x] Incorporar a devolutiva do Claude e fechar a recomendação no mesmo plano.
      Escopo reduzido: progresso acumulado, capítulos, recuperação opcional,
      pistas e compatibilidade mínima; sem histórico de rodadas.
- [ ] Implementar o plano consolidado após autorização de Marco; sem nova rodada
      conceitual prevista. Recomendação de autoria: Claude/Opus, com auditoria
      independente, correções e validação do receptor antes da publicação.

## 2026-09-07 — Voltar de encontro e manter a pessoa selecionada
- [x] Dar ao encontro anterior o mesmo destaque visual do avanço.
- [x] Repassar a identidade apenas na navegação entre etapas, com progresso por pessoa
      e por prova e escolha explícita na abertura independente. Responsável: Codex;
      escopo: `src/motor.html`, testes, `CLAUDE.md` e registros desta entrega.
- [x] Verificar ida, volta, troca de pessoa, abertura independente e telas estreitas.
      Dezessete testes e sete builds aprovados; revisão independente sem achados.
      Navegador em 390 e 1100 px, ida/volta, troca explícita e reabertura conferidas.
      Publicação pelo workflow existente, mantendo o endereço original.

## 2026-09-07 — Destaque do próximo encontro
- [x] Dar ao link de avanço aparência de botão, com contraste e área de toque maiores.
      Responsável: Codex; escopo: `src/motor.html` e registros da entrega.
- [x] Conferir o resultado em tela estreita, navegação e modo foco.
      Navegador em 390 e 1100 px, área de toque de 54 px de altura, sem rolagem
      horizontal; passagem ao encontro 2 conferida e 12 testes aprovados.
      A publicação segue pelo workflow existente, no endereço preservado.

## 2026-09-07 — Publicação no mesmo endereço de Hugo
- [x] Substituir a página antiga pelo encontro 1, preservando a URL compartilhada.
- [x] Validar conteúdo gerado, continuidade dos encontros e separação do progresso.
      Doze testes aprovados; auditor independente confirmou a correção da migração
      da fila offline antiga, preservando eventos sem herdar XP ou medalhas.
- [x] Publicar no Pages e verificar a página entregue pela implantação.
      Commit 1c33536; Action 34146074968 concluído com sucesso. Endereço original
      abre o encontro 1; três páginas com HTTP 200, trilha e telemetria configuradas.
      Mapa publicado conferido no navegador com Marco (teste), sem responder questões.

## 2026-09-07 — Hugo: três encontros de estudo antes de 09/09
- [x] Definir ensino guiado → aplicação em novas situações → recuperação espaçada,
      com seis temas já existentes, progressos separados e terceiro encontro opcional.
- [x] Redigir três arquivos de conteúdo, com aulas curtas, decisões nas ferramentas,
      questões novas e figuras para leitura visual. Responsável: agente de conteúdo (Sol).
- [x] Implementar ferramenta de investigação, navegação da sequência e identificação
      do encontro no log, preservando as 28 colunas e as acomodações. Responsável: Terra.
- [x] Preparar roteiro de uso do responsável e corrigir imprecisões da versão inicial.
- [x] Executar builds, verificações de regressão e teste visual em tela estreita.
      Sete builds; nove testes; três novos encontros com zero erros e avisos editoriais.
- [x] Rodar auditor independente sobre o resultado, corrigir achados e conferir novamente.
      Revisores técnico e pedagógico independentes; seis grupos pedagógicos corrigidos
      e rechecados, além de dois destaques editoriais e ajustes de navegação/legibilidade.
- [x] Registrar entregas, limitações e pendências após a verificação final.
- [ ] Conferir o acesso no aparelho de estudo após a publicação acompanhada acima.
- [ ] Após cada uso real, reler o log com identificação do encontro e o contexto
      de ajuda/leitura antes de ajustar a passagem seguinte. A sequência não se adapta sozinha.
- [ ] Planejar, em mudança própria do contrato, telemetria direta de aula, ferramenta,
      leitura do feedback e tipo do primeiro toque; essas medidas ainda não existem no GSheet.

## 2026-09-07 — Implementação da convivência e do guia narrativo
- [x] Definir uma referência comum no `CLAUDE.md` e uma entrada curta no `AGENTS.md`.
- [x] Escrever o guia editorial compartilhado e conectá-lo às instruções e ao README.
- [x] Aplicar o exemplo de revisão à aula de Enredo de Hugo Cabret.
- [x] Revisar os documentos, executar build/validação e conferir a aula no navegador.
      Build OK; 0 erros e os mesmos 6 avisos de comprimento do validador;
      convite, ferramenta e fechamento conferidos em 390 × 844, como Marco (teste).

## 2026-09-07 — Papel complementar do Codex (análise)
- [x] Ler as regras pedagógicas, o `CLAUDE.md`, o `AGENTS.md` e o histórico do projeto.
- [x] Conferir a arquitetura e propor responsabilidades e um protocolo de convivência.
- [x] Executar o build local dos quatro arquivos de prova/revisão, sem `SHEET_URL`.
- [x] Ampliar a proposta para incluir coautoria narrativa e edição didática,
      com leitura de exemplos de Hugo Cabret, Language Arts e Matemática.
- [ ] Investigar o contrato de retenção: a seleção de campos de `getDashboardData`
      em `apps-script/enviar.gs` omite `questao_id`, exigido pelo cálculo em
      `apps-script/dashboard.html`. Achado estático; validar com dados sintéticos.
- [x] Implementar a proposta de manter as regras comuns no `CLAUDE.md` e um
      `AGENTS.md` curto que exija sua leitura e acrescente o papel do Codex,
      incluindo coautoria narrativa. Autorizado e implementado em 07/09.
- [ ] Conciliar pendências antigas com código e changelog: implantação registrada
      como feita, expansão dos bancos, retenção e localização atual do validador.
      Não considerar os registros históricos como verificação da implantação atual.
- [x] Revisar o fechamento da aula de Enredo de Hugo Cabret: removida a referência
      à "seta seguinte" no cartão; agora orienta recuperar a cena e o que ela
      tornou possível. Convite à ferramenta também reescrito em tom de descoberta.

## Hugo Cabret (v1 em 07/09) — antes de a Alícia jogar
- [x] **Retorno da psicopedagoga (07/09, testou o encontro 1 no celular como "Fernanda (teste)")**:
      interativo e apropriado para a idade. Pede que toda proposta cubra **enredo,
      personagens principais, situação-problema, cenário, clímax e desfecho**.
      Feito em 07/09 (noite): tema `POR.LEI.ESTR` no catálogo; missão "O painel de
      partidas" na prova original (montar, banco de 7, sorteio [1,2,3]); missões
      `estrutura-e1`/`estrutura-e2` nos encontros (investigar, Q101–Q104, Q201–Q204);
      tema e critério na cola do encontro 3. Encontros passam a 7 missões e 14 questões.
      "Clímax" e "desfecho" nomeados em SEQ.Q6, SEQ.Q7 e SEQ.Q203.
- [ ] Conferir `POR.LEI.ESTR` com o roteiro da professora: se ela usar outros nomes
      ("conflito", "situação inicial", "resolução"), alinhar o vocabulário das questões.
- [ ] Revisão do Codex de 08/09 aplicada (clímax como tensão/virada, situação inicial com
      dificuldades, desfecho ensinado antes de cobrado, quatro marcos praticados, `isOpen`).
      Ficou de fora, por decisão: a ferramenta `investigar` libera o avanço após um exemplo;
      o segundo pode ser pulado. Decidir se o portão deve exigir todos os exemplos.
- [ ] Encontro 3 sorteia 1 questão por nível e por tema: pratica 2 dos 4 marcos. Aceito
      por ser recuperação opcional; rever se virar sessão obrigatória.
- [ ] Conferir com o roteiro da professora: matéria (Português assumido), capítulos
      cobrados, se livro × filme entra. Ajustar missões ao roteiro.
- [ ] Revisão factual por adulto que leu a edição SM (nomes, "afilhada", Inspetor sem
      nome, ordem dos eventos). Erro de fato numa prova de livro é pior que de gramática.
- [x] Criar revisão intercalada de Hugo: entregue em
      `data/provas/2026-09-hugo-session-3-y5.json`, com banco do encontro 2,
      `por_tema: [1,2]` e seis critérios. Calendário ajustado para 07–08/09;
      o terceiro encontro é opcional e depende da base ensinada, conforme o guia.
- [ ] Decidir ferramenta `fotogramas` (proposta §3.2). Sem ela, missão 6 fica em `destacar`.
- [x] Textos de apoio de Temas e Forma encurtados para ≤450 chars (07/09 tarde).
- [ ] Promover o validador de conteúdo (`validate_final.py`, no scratch desta sessão) para
      `scripts/` e rodar no build: telas por aula, correta ≤1,35× o maior distrator,
      passos sem resposta colada, cartão não pode conter gabarito.
- [ ] Commit e push (publica no Pages) só depois da revisão factual.

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
