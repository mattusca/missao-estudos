import json, re, sys
from pathlib import Path

# Aceita qualquer prova; o caminho padrão acompanha o repositório em qualquer máquina.
P = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "data/provas/2026-09-hugo-cabret-y5.json"
d = json.load(open(P, encoding="utf-8"))
erros, avisos = [], []
def texto(h): return re.sub(r"<[^>]+>", "", h)
def nfr(h): return len([s for s in re.split(r"[.!?…]+(?:\s|$)", texto(h)) if s.strip()])
ids = []
for m in d["missoes"]:
    mid = m["missao_id"]
    # Intercaladas não têm aula: o build valida a cola e resolve o banco emprestado.
    if m.get("intercalada"):
        continue
    corpo = m["aula"]["corpo"]; pre = corpo.split("<h3>")[0]
    blocks = re.findall(r"<p[\s\S]*?</p>|<div class=\"lesson-box\">[\s\S]*?</div>", pre)
    telas, i = [], 0
    while i < len(blocks):
        if blocks[i].startswith("<p") and i + 1 < len(blocks) and blocks[i + 1].startswith("<div"):
            telas.append(blocks[i] + blocks[i + 1]); i += 2
        else: telas.append(blocks[i]); i += 1
    if not 1 <= len(telas) <= 3: erros.append(f"{mid}: {len(telas)} telas (esperadas de 1 a 3)")
    if telas and "lesson-box" in telas[0]: avisos.append(f"{mid}: lesson-box na tela 1")
    for t_i, t in enumerate(telas):
        p = re.findall(r"<p[\s\S]*?</p>", t)
        if p and nfr(p[0]) > 4: avisos.append(f"{mid}: tela {t_i+1} com {nfr(p[0])} frases")
        if len(texto(t)) > 330: avisos.append(f"{mid}: tela {t_i+1} com {len(texto(t))} chars")
    if "<h3>" not in corpo: erros.append(f"{mid}: sem h3")
    if len(texto(m["regra"])) > 200: avisos.append(f"{mid}: regra {len(texto(m['regra']))} chars")
    if re.search(r"\bpra\b", json.dumps(m, ensure_ascii=False)): avisos.append(f"{mid}: 'pra' presente")
    dd = m.get("dados", {})
    if m["ferramenta"] == "destacar":
        fr = [s.strip() for s in dd["texto"].split("|") if s.strip()]
        pref = [a["frase"][:18] for a in dd["alvos"]]
        if len(set(pref)) != len(pref): erros.append(f"{mid}: prefixos repetidos")
        for a in dd["alvos"]:
            if not any(f.startswith(a["frase"][:18]) for f in fr): erros.append(f"{mid}: alvo sem frase {a['frase']}")
        if len(dd["texto"]) > 460: avisos.append(f"{mid}: texto {len(dd['texto'])}")
    if m["ferramenta"] == "montar":
        for it in dd["itens"]:
            if sorted(it["ordem"]) != sorted(it["fichas"]): erros.append(f"{mid}: ordem≠fichas")
    if m["ferramenta"] == "conector":
        for p in dd["pares"]:
            if sum(1 for o in p["opcoes"] if o.get("ok")) != 1: erros.append(f"{mid}: par sem 1 ok")
    for q in m.get("questoes", []):
        qid = q["questao_id"]; ids.append(qid)
        if len(q["alternativas"]) != 4: erros.append(f"{qid}: alternativas")
        if not (0 <= q["correta"] < 4): erros.append(f"{qid}: correta")
        L = [len(a) for a in q["alternativas"]]; c = L[q["correta"]]; outros = max(L[i] for i in range(4) if i != q["correta"])
        if c > 1.35 * outros: avisos.append(f"{qid}: correta {c} chars vs maior distrator {outros}")
        if nfr(q["enunciado"]) > 2: avisos.append(f"{qid}: enunciado com {nfr(q['enunciado'])} frases")
        if q["enunciado"].count("<mark>") != 1: avisos.append(f"{qid}: {q['enunciado'].count('<mark>')} marks")
        if nfr(q["explicacao"]) > 3: avisos.append(f"{qid}: explicação com {nfr(q['explicacao'])} frases")
        if q["dificuldade"] == 3 and not (3 <= len(q.get("passos") or []) <= 4): erros.append(f"{qid}: passos")
        for k in ("dica", "explicacao", "enunciado"):
            if not q.get(k): erros.append(f"{qid}: {k} vazio")
        for campo in ("enunciado", "dica", "explicacao"):
            s = q[campo]
            for tag in ("b", "mark", "i"):
                if s.count(f"<{tag}>") != s.count(f"</{tag}>"): erros.append(f"{qid}: <{tag}> não fechado em {campo}")
if len(set(ids)) != len(ids): erros.append("ids duplicados")
print("\n".join("ERRO " + e for e in erros)); print("\n".join("aviso " + a for a in avisos))
print(f"{len(erros)} erros, {len(avisos)} avisos")
if any(m.get("banco_de") for m in d["missoes"]):
    print("Bancos emprestados: executar também node build.mjs para resolver e validar as questões.")
sys.exit(1 if erros else 0)
