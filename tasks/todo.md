# Pendências

## Evoluir o artefato (decidido em 25/08, depois da prova)
- [ ] A aula precisa custar mais que um toque: o "próximo" da tela da ferramenta
      só habilita depois de ela mexer uma vez no widget. **Marco decide** se entra —
      é atrito deliberado, da mesma família dos dois toques, e isso é chamada dele.
- [ ] Tela final visual: mapa das 7 missões com medalha de cada uma, no lugar do
      número grande de XP. O dado já existe em `S.done` e `S.errors`.
- [ ] `missao.ilustracao` com SVG inline, no padrão do `questao.figura`: motor dono
      da moldura, JSON dono do desenho. Prova nova segue sendo só dado.
- [ ] Micro-movimento (medalha que aparece, barra que enche), sempre morto no modo
      foco e sob `prefers-reduced-motion`. Nada de GIF: arquivo único, offline-first.
- [x] Banco de questões com sorteio por dificuldade — feito em 25/08.
- [x] Alternativas embaralhadas com gabarito remapeado — feito em 25/08.
- [ ] Encher o banco da prova de matemática (hoje 21, sem `sorteio`).

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
