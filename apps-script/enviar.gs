/**
 * Recebe os resultados da "Missão Matemática" e grava numa aba da planilha.
 *
 * COMO INSTALAR
 * 1. Crie uma planilha no Google Sheets.
 * 2. Menu Extensões > Apps Script. Apague o conteúdo e cole este arquivo.
 * 3. Salve. Depois clique em Implantar > Nova implantação.
 * 4. Tipo: "App da Web".
 *    - Executar como: EU (sua conta)
 *    - Quem pode acessar: QUALQUER PESSOA
 * 5. Autorize quando o Google pedir. Copie a URL que termina em /exec.
 * 6. Cole essa URL na constante SHEET_URL do arquivo HTML do quiz.
 *
 * Observação: "Qualquer pessoa" significa que quem tiver a URL consegue
 * gravar linhas. Como ela não devolve dados nem expõe a planilha, o risco é
 * baixo — mas não divulgue a URL fora de casa.
 */

var ABA = 'Resultados';

var CABECALHO = [
  'Data/hora', 'Aluna', 'Tipo', 'Missão', 'Acertos', 'Total', '% acerto',
  'Medalha', 'Dicas usadas', 'Quebrar em partes', '2ª tentativas',
  'Erros', 'Minutos', 'XP total', 'Modo foco'
];

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

    sh.appendRow([
      d.quando ? new Date(d.quando) : new Date(),
      d.aluna || '',
      d.tipo || '',
      d.missao || '',
      d.acertos === '' ? '' : d.acertos,
      d.total || '',
      d.pct === '' ? '' : d.pct,
      d.medalha || '',
      d.dicas === '' ? '' : d.dicas,
      d.partes === '' ? '' : d.partes,
      d.segundas === '' ? '' : d.segundas,
      (d.erros || []).join(' | '),
      d.minutos === '' ? '' : d.minutos,
      d.xp || '',
      d.foco || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/** Só para testar no navegador se a implantação está no ar. */
function doGet() {
  return ContentService.createTextOutput('Endpoint da Missão Matemática ativo.');
}
