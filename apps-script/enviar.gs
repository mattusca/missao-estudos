/**
 * Recebe UMA LINHA POR QUESTÃO RESPONDIDA e grava na planilha.
 *
 * Por que por questão e não por missão: um resumo não se desagrega depois.
 * "Ela tirou 2 de 3 em frações" não permite descobrir qual questão falhou,
 * se foi com dica, ou se ela travou 4 minutos lendo o enunciado. O detalhe,
 * ao contrário, agrega com uma fórmula na própria planilha.
 *
 * COMO INSTALAR
 * 1. Crie uma planilha no Google Sheets.
 * 2. Menu Extensões > Apps Script. Apague o conteúdo e cole este arquivo.
 * 3. Salve. Depois clique em Implantar > Nova implantação.
 * 4. Tipo: "App da Web".
 *    - Executar como: EU (sua conta)
 *    - Quem pode acessar: QUALQUER PESSOA
 * 5. Autorize quando o Google pedir. Copie a URL que termina em /exec.
 * 6. Gere o HTML com essa URL no ambiente:
 *        SHEET_URL="https://script.google.com/.../exec" node build.mjs <prova_id>
 *    A URL não fica no repositório — ela entra no HTML só na hora do build.
 *
 * Observação: "Qualquer pessoa" significa que quem tiver a URL consegue
 * gravar linhas. Como ela não devolve dados nem expõe a planilha, o risco é
 * baixo — mas não divulgue a URL fora de casa.
 *
 * ATENÇÃO: a ordem de CAMPOS espelha a constante COLUNAS do motor
 * (src/motor.html). Mexeu num, mexa no outro.
 */

var ABA = 'Eventos';

var CAMPOS = [
  'evento_id', 'sessao_id', 'timestamp', 'aluna', 'materia', 'eixo', 'tema_id',
  'subtema', 'questao_id', 'habilidade_bncc', 'escola', 'ano_aluna', 'nivel_conteudo',
  'bimestre', 'contexto', 'resultado', 'usou_dica', 'usou_andaime', 'dificuldade',
  'tipo_raciocinio', 'seg_ate_1o_toque', 'seg_total', 'saiu_da_tela', 'tempo_valido',
  'retomada', 'posicao_na_sessao', 'modo_foco', 'dispositivo'
];

/** Cabeçalho legível, na mesma ordem de CAMPOS. */
var CABECALHO = [
  'Evento', 'Sessão', 'Data/hora', 'Aluna', 'Matéria', 'Eixo', 'Tema',
  'Subtema', 'Questão', 'BNCC', 'Escola', 'Ano da aluna', 'Nível do conteúdo',
  'Bimestre', 'Contexto', 'Resultado', 'Usou dica', 'Usou andaime', 'Dificuldade',
  'Tipo de raciocínio', 'Seg até 1º toque', 'Seg total', 'Saiu da tela', 'Tempo válido',
  'Retomada', 'Posição na sessão', 'Modo foco', 'Dispositivo'
];

function celula_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? 'sim' : 'nao';
  if (Array.isArray(v)) return v.join(' | ');
  return v;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(ABA) || ss.insertSheet(ABA);

    if (sh.getLastRow() === 0) {
      sh.appendRow(CABECALHO);
      sh.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    // Mesma questão reenviada pela fila local não vira linha duplicada.
    if (d.evento_id && jaGravado_(sh, d.evento_id)) {
      return json_({ ok: true, duplicado: true });
    }

    var linha = CAMPOS.map(function (c) {
      return c === 'timestamp' ? (d.timestamp ? new Date(d.timestamp) : new Date()) : celula_(d[c]);
    });
    sh.appendRow(linha);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** A fila local reenvia o que não subiu; sem isso um reenvio duplicaria a questão. */
function jaGravado_(sh, eventoId) {
  var n = sh.getLastRow() - 1;
  if (n <= 0) return false;
  var ids = sh.getRange(2, 1, n, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(eventoId)) return true;
  }
  return false;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Só para testar no navegador se a implantação está no ar. */
function doGet() {
  return ContentService.createTextOutput('Endpoint da Missão Estudos ativo — ' + CAMPOS.length + ' campos por evento.');
}
