# Pendências

## Antes de considerar o circuito fechado
- [ ] Marco: rodar o roteiro de teste manual (abaixo) no aparelho da Alícia.
- [ ] Implantar `apps-script/enviar.gs` e pegar a URL `/exec`.
- [ ] Gerar com `SHEET_URL=... node build.mjs 2026-08-matematica-y5` e confirmar
      que uma questão respondida vira uma linha na aba `Eventos`.
- [ ] Confirmar a deduplicação: responder offline, voltar online, reabrir,
      e checar que a fila subiu sem duplicar linha.

## Depois do teste manual passar
- [ ] GitHub Action: build com `SHEET_URL` de secret + publicação no Pages,
      para a URL não voltar ao repositório via `docs/`.
- [ ] Parametrizar as ferramentas restantes (hoje só `grafico` lê `missao.dados`).
      `valor` embute `3,472`, `prob` a sacola 3/5/2, `contas` os exemplos numéricos.
- [ ] Conferir os códigos BNCC com a professora (`bncc_conferida: false`).

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
9. **Retomada** — fechar a aba no meio e reabrir: XP preservado e botão
   "Continuar de onde parei" voltando na questão certa.
10. **Envio** — com `SHEET_URL`, uma linha por questão na aba `Eventos`.
    Sem ela, "Copiar resultados" no fim gera TSV de 28 colunas.

**Nunca deve aparecer**: qualquer cronômetro ou contagem de tempo na tela da aluna.
