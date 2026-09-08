# Plano final recomendado — Trilha em capítulos e Minhas pistas

Consolidação de Codex e da revisão de Claude em 08/09/2026. Referência: `952fac4`.
**Revisão final de Claude em 08/09/2026 e implementação autorizada por Marco na mesma data.**
Este documento substitui as alternativas anteriores no mesmo arquivo. As notas marcadas
*Claude, revisão final* registram o que mudou em relação ao texto do Codex.

## 0. Veredito

**Adotar a maior parte da simplificação do Claude, corrigindo seus atalhos técnicos e algumas justificativas pedagógicas.** Meu plano original superdimensionou o histórico necessário para uma experiência motivacional ainda não validada. Rodadas, assinaturas de conteúdo e comparação de respostas ficam fora desta entrega.

Isso não torna todo painel inútil, nem transforma qualquer comparação factual em diagnóstico. O corte se justifica por prioridade, custo e risco de interpretação. O pedido de Marco continua atendido por **progresso visível por pessoa e artefato**, reconhecimento concreto do percurso e liberdade para parar. Não será um painel de melhora de desempenho entre tentativas.

Não aceitar como simplificação a perda presumidamente inofensiva de progresso ou telemetria. Preservar dados existentes exige cuidados delimitados, não uma plataforma de histórico.

## 1. Resultado desejado

A criança sabe onde está, reconhece o caminho percorrido, encontra a próxima atividade sem procurar outro link e pode encerrar satisfeita. O mapa e o fechamento usam os mesmos registros de conclusão.

Manter uma frase factual, como “Você concluiu este capítulo”, sem inferir domínio, autonomia ou esforço não observado. Acolhimento e acesso aos apoios não dependem da quantidade de acertos.

## 2. Critério pedagógico

Aprendizagem, motivação e facilidade de uso são critérios conjuntos. Recuperar conteúdo é uma boa direção; **uma pergunta oral no final não garante, por si, aprendizagem profunda**.

Experimentos com crianças e textos escolares encontraram dificuldades na recuperação pouco orientada e resultados melhores com recuperação guiada. Isso sustenta oferecer uma pergunta delimitada e apoio, não exigir uma síntese extensa ao terminar cansada. O estudo não valida diretamente esta tela ou estas três perguntas. [Karpicke et al., 2014](https://learninglab.psych.purdue.edu/downloads/2014/2014_Karpicke_etal_JARMAC.pdf).

A pergunta final complementa as missões. Não substitui a cobertura de enredo, personagens, situação-problema, cenário, clímax e desfecho indicada por Daniela, nem o intervalo entre ocasiões de estudo.

## 3. Um artefato, três capítulos

Preservar o [endereço público atual](https://mattusca.github.io/missao-estudos/2026-09-hugo-cabret-y5.html) e o `prova_id` do encontro 1: `2026-09-HUGO-E1-Y5`.

| Capítulo | Missões atuais | Função |
|---|---:|---|
| Aprender as pistas | 7 | Aula, ferramenta e aplicação inicial. |
| Aplicar em cenas novas | 7 | Aplicação em situações diferentes. |
| Misturar tudo | 2 | Recuperação intercalada. |

São 16 missões, não 16 questões. Preservar conteúdo, dificuldade declarada e acomodações; a fusão não cria atividades extras.

Concluir um capítulo disponibiliza o seguinte no mesmo mapa. A próxima missão só começa quando escolhida. Não há nova seleção de pessoa durante a navegação; uma abertura independente continua pedindo identificação. “Trocar pessoa” permanece disponível.

Primeiro entregar **lista com cabeçalhos de capítulo**, capítulo atual expandido e progresso legível. O SVG autoral da estação fica para uma melhoria posterior: incorporado ao HTML, ligado a IDs estáveis, acessível e estático no modo foco. Sem personagem, combate, moedas ou cutscenes.

## 4. Fechamento com recuperação opcional

Um cartão no mapa ao concluir cada capítulo:

> Você concluiu Aprender as pistas.
> Se quiser, pense ou conte uma resposta: o que Hugo quer fazer com o autômato, e o que atrapalha?
> Você pode descansar agora e continuar em outro momento.
>
> [Conferir uma possibilidade]
>
> [Parar por hoje]  [Continuar no mapa]

Não exigir adulto disponível, fala, digitação, gravação, nota ou confirmação de que respondeu. Os botões permanecem disponíveis; a conferência não é uma barreira. Aceitar paráfrases e outras respostas sustentadas pelo livro.

Perguntas recomendadas, ancoradas no conteúdo atual:

| Capítulo | Pergunta | Conferência opcional |
|---|---|---|
| 1 | O que Hugo quer fazer com o autômato, e o que atrapalha? | Consertá-lo; faltam peças e ele precisa agir escondido. Outras dificuldades coerentes com a cena também valem. |
| 2 | Como a estação ajuda Hugo e também o coloca em risco? | Oferece esconderijo, mas ali está o Inspetor; os relógios parados poderiam chamar atenção. |
| 3 | Como a vida de Hugo muda do começo para o fim? | Do isolamento e segredo ao acolhimento e aos vínculos. Uma cena pode ajudar a explicar. |

As duas primeiras se apoiam nas missões de estrutura; a terceira, no tema retomado pela revisão. Não exigir recontar o livro inteiro nem presumir um detalhe da adaptação cinematográfica.

Na v1, `capitulo.recuperacao` contém apenas pergunta e resposta de referência. Sem gerador, sorteio, rubrica automática ou nova telemetria oral.

## 5. Pausas, pistas e reconhecimento

- Pausas após a 2ª e a 4ª missão **dentro de cada capítulo** e ao fim do capítulo; coincidências geram um único convite. Reabrir ou repetir uma missão não deve anunciar outro capítulo conquistado.
- Sem trava por horário, cronômetro ou prêmio por emendar capítulos. A mudança de capítulo não cria sessão nova. A atividade pode ser planejada como revisão espaçada e ter sido realizada sem intervalo: o log deve permitir reconhecer isso.
- “Minhas pistas” abre, pelo mapa, as regras das missões concluídas. Usar `regra` nas comuns e `regras` nas intercaladas, com títulos e conteúdo recolhido para não formar um mural.
- Descrever como “as pistas das missões que você percorreu”; a criança não escreveu essas regras. Consulta é apoio, não comprovação de retenção.
- Não abrir pistas automaticamente antes da recuperação nem acrescentar, durante questões intercaladas, um destaque que revele qual estratégia usar.
- XP e medalhas atuais permanecem. Não criar álbum, novos selos, sequências diárias ou bônus. Celebração final existente, sem nova camada de animação; modo foco e movimento reduzido respeitados.

## 6. O que o painel mostra — e o que fica fora

O fechamento mostra **o percurso acumulado daquele usuário naquele artefato**: capítulos e missões com conclusão registrada, acesso a “Minhas pistas” e a opção de encerrar. Pode dizer “No seu mapa, os três capítulos estão concluídos”, quando isso for verdadeiro.

Não afirmar que tudo foi feito hoje, em uma nova rodada ou sem ajuda. Uma conclusão antiga não comprova que todo o banco ampliado de questões foi respondido. Conteúdo substancialmente novo deve receber a identidade de missão apropriada, conforme a prática do projeto.

Ficam fora: comparação de acertos entre tentativas, gráfico de nota, tendência infantil, histórico de rodadas, coleção adicional e sincronização entre aparelhos. O dashboard privado dos responsáveis mantém sua função. O piso de dez eventos e três sessões é uma regra de prudência do projeto, não garantia científica de estabilidade.

## 7. Contrato técnico mínimo

| Área | Decisão recomendada |
|---|---|
| Dados | Um JSON com capítulos e `missao.capitulo_id`. Contexto efetivo declarado na missão ou herdado do capítulo; fallback ao da prova para arquivos antigos. |
| Estado | Reutilizar `S.done`, `S.xp` e persistência existente. Nenhum histórico de rodadas. No máximo, um resumo da última missão concluída para oferecer uma revisão pertinente. |
| Banco interno | Capítulo 3 referencia explicitamente as **missões de origem do capítulo 2**. Buscar apenas pelo tema escolheria o capítulo 1, que aparece antes. Inicialmente, emprestar só de missões com questões próprias, sem cadeias de empréstimo. |
| Validação | IDs únicos de capítulos/missões; referências válidas; questões compartilhadas mantêm ID e conteúdo compatíveis. Impedir duplicatas indevidas na aplicação e manter regras de sorteio/intercalação. |
| Telemetria | Acrescentar somente `capitulo_id` como 29º campo. Preservar as 28 posições anteriores; payload antigo ou fila antiga sem o campo resulta em célula vazia. Não inventar uma nova sessão para indicar capítulo. |
| Publicação | Mesma URL preferencial; gerar explicitamente páginas compatíveis para os links antigos de E2/E3, sem duplicar entradas no índice. Abertura por link não contorna identificação ou desbloqueio. |

*Claude, revisão final:* a ordem servidor-antes-do-HTML não é necessária. O receptor monta a
linha por `CAMPOS`, então um cliente que envia 29 campos a um servidor de 28 tem o 29º
ignorado, sem perda das outras colunas; e um servidor de 29 recebendo payload antigo grava
célula vazia. O que era verdade: o cabeçalho de uma aba existente não ganhava a coluna nova.
Isso foi resolvido em `enviar.gs` com `garantirCabecalho_`, idempotente, chamada a cada
gravação. Resta a Marco reimplantar o Apps Script; até lá, `capitulo_id` não é gravado.

**Texto original:** A nova coluna exige atualização do servidor e da planilha existente antes do HTML. Hoje o receptor escreve por posição e só cria cabeçalho numa aba vazia. Alterar a constante não acrescenta o cabeçalho à aba atual. Atualizar também os leitores afetados e testar envio antigo e novo. Com `no-cors`, o navegador não comprova que o servidor gravou o campo.

**Preservação limitada dos dados legados:** manter o estado do E1 e verificar, no próprio navegador, se existem estados de E2/E3. Se existirem, importar somente progresso e XP da mesma pessoa, com controle simples de importação por origem para não somar novamente. Manter as chaves antigas até confirmar a gravação. Não reconstruir respostas ou rodadas a partir de medalhas.

Reaproveitar o resgate de filas existente, preservando IDs, horários e contexto originais; reenvio não vira novo evento. A prova original histórica permanece distinguível. **Ausência de linhas no Sheets não demonstra ausência de progresso offline**, e este plano não autoriza descartá-lo.

Não criar um framework de migrações. A compatibilidade cobre as três versões conhecidas de Hugo. Progresso continua local ao navegador; falha de armazenamento não pode gerar mensagem de “salvo”.

## 8. Corrigir o final sem inventar rodadas

Os defeitos apontados são reais, mas precisam de soluções coerentes com a retirada do histórico:

1. Rotular XP como **acumulado neste artefato**.
2. Retirar a lista automática de erros acumulados. Se houver uma sugestão, usar no máximo uma questão da **última missão concluída**, identificada assim. Um único resumo por pessoa/artefato basta; não um banco de tentativas.
3. Remover “nenhum erro nesta sessão” baseado em `S.errors` vazio.
4. Avaliar a conclusão acumulada pelas missões atuais do mapa, sem chamar isso de nova rodada completa. Repetir uma missão não dispara novamente a celebração do percurso inteiro.
5. Sem resumo atual confiável, oferecer “Minhas pistas”; não inferir uma dificuldade a partir de dados antigos.

O resumo mínimo guarda missão, referência estável da questão e explicação pertinente; se o conteúdo deixar de corresponder, omitir a sugestão. Não apagar a telemetria nem os dados antigos só para limpar a interface.

## 9. Execução recomendada

Implementar depois da prova de 09/09, em uma entrega funcional: conteúdo único, capítulos, pausas, pergunta opcional, pistas, final corrigido e compatibilidade. Conferir o mapa em 390 px durante o trabalho. SVG não condiciona essa entrega.

Ordem operacional: validar localmente → auditar e corrigir → atualizar receptor/cabeçalho e verificar a compatibilidade → publicar HTML no mesmo endereço → conferir a página e o registro recebido com perfil de teste.

Um autor principal e um auditor independente ao final bastam. Paralelizar apenas conteúdo e testes realmente separados; vários agentes editando o motor aumentariam a coordenação.

“Um dia e meio” é uma estimativa provisória, não compromisso verificado. Acesso à implantação e testes de dados existentes precisam caber na entrega. Nenhuma nova rodada de discussão conceitual é necessária; a execução continua dependendo da autorização de Marco.

## 10. Aceitação da entrega

- Identidade e progresso separados por pessoa; abertura independente e navegação interna corretas.
- Capítulo seguinte disponível no mesmo mapa, sem iniciar atividade; pausas sem duplicação; saída e retomada claras.
- Recuperação e conferência opcionais, sem nota ou perda de recompensa; pistas corretas para missões comuns e intercaladas.
- Banco do capítulo 3 vem do capítulo 2 e mantém as identidades das questões.
- Progresso e filas legados preservados; recarga não duplica importação, XP ou celebração.
- Servidor recebe eventos de 28 e 29 campos, inclusive em aba já existente; contexto correto e sessão preservada entre capítulos.
- URL principal e aliases funcionam; índice sem duplicação; demais provas continuam funcionando.
- Final usa o período correto, sem lista de erros antigos ou promessa de domínio; nova missão não aparece concluída por herança.
- Navegador em 390 px, teclado, modo foco, movimento reduzido, falha de armazenamento e uso offline verificados.

Avaliar se a criança encontra o caminho, reconhece o que realizou, usa ajuda sem receio e consegue parar satisfeita. Observar a recuperação quando ela aceitar o convite; responder oralmente não é obrigação nem indicador automático de sucesso do produto.

## 11. Quem deve implementar

*Claude, revisão final:* executado em 08/09 assim: JSON único, rotas, Apps Script e
documentação por Claude (Fable); motor por um agente Opus; build e testes por um agente
Sonnet, em paralelo e em arquivos separados; auditoria independente em duas frentes
(pedagógica e de integração) por agentes Sonnet, com correções aplicadas antes de publicar.
Fable ficou na orquestração e na revisão, o que é o uso de "reservar Fable" que o Codex
propôs. Decisões tomadas na revisão final, além da telemetria acima: a importação de
progresso legado dos encontros 2 e 3 foi implementada como o Codex pediu (simples, por
pessoa, idempotente, sem apagar chaves antigas); a recuperação de fim de capítulo é opcional,
com "Conferir uma possibilidade"; a tela final segue a seção 8 sem histórico de rodadas;
o SVG da estação fica para depois.


**Recomendação: Claude com Opus como autor principal; uma auditoria independente delimitada antes da publicação.** A continuidade da implementação recente e o escopo agora mais enxuto favorecem essa escolha operacional. Não há evidência de comparação controlada entre os modelos neste repositório que permita declarar um vencedor universal.

Como referência de custo, os preços-base de API consultados em 08/09/2026 são: Opus 5, US$ 5/25; Fable 5.1, US$ 10/50; GPT-6 Astra, US$ 10/50 por milhão de tokens de entrada/saída. Esses valores não medem custo por tarefa nem consumo da assinatura; cache, raciocínio, volume e retrabalho podem mudar a conta. [Opus](https://www.anthropic.com/claude/opus), [Fable](https://www.anthropic.com/claude/fable), [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra).

Começar com Opus é uma escolha de custo-benefício para este escopo, não uma garantia de menor custo total. Reservar Fable para uma dificuldade concreta que justifique escalada; não alternar modelos sem necessidade. Codex/Astra também é uma opção capaz e pode fazer a auditoria técnica, mas não considero necessário transferir-lhe a autoria nem contratar uma segunda implementação.

A análise adversarial técnica e pedagógica foi incorporada neste documento. Nenhum código, JSON de prova, implantação ou arquivo novo foi criado nesta revisão.
