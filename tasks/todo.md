# Pendências

## Antes de considerar o circuito fechado
- [ ] Marco: rodar o roteiro de teste manual (abaixo) no aparelho da Alícia.
- [ ] Implantar `apps-script/enviar.gs` + `dashboard.html` (DUAS implantações,
      ver instruções no topo do enviar.gs) e pegar as duas URLs `/exec`.
- [ ] Compartilhar a planilha com a Fernanda (leitor) e testar o dash na conta dela.
- [ ] `gh secret set SHEET_URL` com a URL `/exec` da telemetria e dar um push
      (ou `gh workflow run publicar.yml`) para republicar com o envio ligado.
- [ ] Confirmar que uma questão respondida vira uma linha na aba `Eventos`.
- [ ] Confirmar a deduplicação: responder offline, voltar online, reabrir,
      e checar que a fila subiu sem duplicar linha.

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
