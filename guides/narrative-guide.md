# Guia narrativo dos artefatos

Guia compartilhado por Claude e Codex para criar e revisar o conteúdo das provas.
As acomodações, a calibragem e o esquema de dados seguem o [CLAUDE.md](../CLAUDE.md).
Este guia define critérios editoriais; não substitui o roteiro da professora nem
comprova fatos do material estudado.

## 1. Planejar o percurso

Antes da redação, registrar no escopo da tarefa:

- **Objetivo:** o que a aluna deverá conseguir observar, explicar ou resolver.
- **Fonte:** roteiro e material que sustentam os fatos; lacunas ainda não verificadas.
- **Pergunta da missão:** uma curiosidade ou decisão ligada ao conteúdo.
- **Ação:** o que ela fará na ferramenta para explorar essa ideia.
- **Aplicação:** como as questões pedem que use o que aprendeu.

Em uma prova de livro, a pergunta pode nascer de uma cena. Em Matemática, pode
nascer da comparação de quantidades ou de uma meta. Usar o contexto necessário
para a decisão; retirar detalhes que não ajudem a compreender ou agir.
Preservar a ordem de missões acordada com Marco.

## 2. Construir a missão

Para missões com aula, usar esta sequência como referência de roteiro:

1. **Cena ou situação:** apresentar algo concreto e uma pergunta compreensível.
2. **Ideia:** mostrar como um conceito ajuda a entender a situação, com um exemplo.
3. **Ação:** convidar a observar, ordenar, comparar ou experimentar na ferramenta.
4. **Aplicação:** propor questões que exijam o raciocínio trabalhado.
5. **Fechamento:** explicar o que a resposta revela e qual estratégia pode ser reutilizada.

Essa sequência não determina a quantidade de telas. Cada tela desenvolve uma
ideia; a ferramenta mantém seu espaço e sua interação obrigatória. A referência
de Hugo Cabret usa três telas de texto, seguidas de ferramenta e fechamento.
Conferir a divisão produzida pelo motor antes de tomar o JSON como retrato da tela.

Em `revisao_espacada` com missão intercalada, manter entrada breve, cola com os
critérios dos temas e recuperação direta. Não acrescentar aula, ferramenta ou
enredo que anuncie a estratégia de cada questão.

## 3. Escrever com uma voz consistente

- Usar português claro, acolhedor e adequado à aluna, sem infantilização ou sarcasmo.
- Preferir ações e exemplos concretos. Explicar termos novos perto de seu primeiro uso.
- Usar perguntas para orientar a observação; evitar suspense que só adie a explicação.
- Usar metáforas curtas quando ajudem a compreender e ligá-las ao conceito preciso.
- Convidar a tentar e revisar. Evitar ameaça de prova, julgamento da pessoa ou
  promessa de domínio baseada no placar.
- Encerrar explicações com uma ideia útil. Uma frase memorável precisa preservar
  o sentido do conteúdo e não tornar o texto desnecessariamente longo.

Exemplo editorial de Enredo:

> A ordem deixa pistas. Antes de escolher a próxima ficha, pergunte: o que
> aconteceu antes e o que veio depois?

O convite aponta uma ação que a ferramenta permite realizar. Aplicar esse
critério também aos botões, instruções e transições entre telas.
Ao explicar causalidade, acrescentar a pergunta pelo motivo: um acontecimento
vir antes de outro não basta para ser sua causa.

## 4. Preservar a função de cada apoio

| Elemento | Função editorial |
|---|---|
| Cartão de regra | Dar um critério reutilizável, sem reproduzir o gabarito da questão |
| Enunciado | Apresentar contexto suficiente e uma tarefa clara |
| Alternativas | Representar respostas plausíveis, incluindo confusões do conteúdo |
| Dica | Direcionar a atenção para uma pista, preservando uma decisão para a aluna |
| Andaime | Organizar etapas do trabalho, sem responder essas etapas por ela |
| Explicação | Mostrar por que a resposta funciona e esclarecer a confusão relevante |

Conferir se o tamanho, o tom ou as palavras das alternativas denunciam a correta.
Os alertas de comprimento são sinais para revisão, não uma prova de qualidade.
Evitar truques como escolher sempre a resposta mais abrangente sem examinar o texto.
O feedback narrativo preserva a segunda tentativa e o reforço imediato do motor.

## 5. Conferir continuidade e fatos

O arco pode atravessar as aulas; cada questão deve funcionar isoladamente, pois
o motor sorteia questões, embaralha alternativas e pode reutilizá-las na revisão.
Evitar referências como "na questão anterior" ou pistas que dependam de acertar
outra pergunta. Ao misturar temas, a narrativa não deve entregar qual regra aplicar.

Verificar toda referência a cartão, seta, figura, botão ou trecho da tela: o
elemento precisa existir e permitir a ação descrita. Após uma reescrita, conferir
também o fechamento e os dados da ferramenta, que podem conservar referências antigas.

Em conteúdo de livro, conferir fatos e relações no material de origem. Distinguir
livro de adaptação, fato de interpretação e paráfrase de citação. Uma formulação
fluente não resolve uma lacuna factual; registrar o que depende de confirmação.

Em edição apenas de texto, preservar IDs, dificuldades, gabaritos, sorteio e dados
das ferramentas. Se a revisão mudar o fato ou o raciocínio exigido por uma questão,
tratar como alteração de conteúdo e avaliar sua identidade para manter a retenção
comparável, conforme o contrato de `questao_id`.

## 6. Autoria, revisão e verificação

Em criação ou reescrita ampla, um agente redige uma missão completa de referência
e outro revisa: clareza, voz, fatos sustentados, continuidade, apoios e ausência
de pistas involuntárias. Resolver os achados antes de expandir a voz para o resto
do artefato. Claude e Codex podem alternar esses papéis; ajustes pequenos recebem
uma leitura proporcional, sem uma etapa obrigatória de delegação.

Antes de concluir, conferir a missão inteira na ordem de uso, executar o build
da prova e os validadores aplicáveis, e abrir a saída no navegador. Verificar a
leitura em tela pequena, a transição para a ferramenta e o fechamento. Usar perfil
de teste e ambiente local sem envio de eventos reais. Registrar o que foi testado
e as pendências factuais; aprovação estrutural não equivale a revisão factual.
