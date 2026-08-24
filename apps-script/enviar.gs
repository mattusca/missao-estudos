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
 * 2. Menu Extensões > Apps Script. Cole este arquivo no Código.gs. Depois
 *    Arquivo > Novo > HTML, nomeie "dashboard" e cole o conteúdo de
 *    apps-script/dashboard.html.
 * 3. Salve. São DUAS implantações do mesmo projeto (Implantar > Nova implantação,
 *    tipo "App da Web", duas vezes):
 *
 *    a) TELEMETRIA — recebe as linhas do app da prova.
 *       - Executar como: EU (sua conta)
 *       - Quem pode acessar: QUALQUER PESSOA
 *       Copie a URL /exec e gere o HTML da prova com ela no ambiente:
 *           SHEET_URL="https://script.google.com/.../exec" node build.mjs <prova_id>
 *       A URL não fica no repositório — entra no HTML só na hora do build.
 *
 *    b) DASHBOARD — a página de acompanhamento dos pais.
 *       - Executar como: USUÁRIO QUE ACESSA
 *       - Quem pode acessar: QUALQUER PESSOA COM CONTA GOOGLE
 *       A URL /exec desta implantação é o link do dash. O controle de acesso é
 *       o compartilhamento DA PLANILHA: compartilhe-a com a Fernanda (leitor)
 *       e o dash abre para ela; quem não tem acesso à planilha vê erro do
 *       Google, não dados. Nenhuma senha no código.
 *
 * Observação: na implantação (a), "Qualquer pessoa" significa que quem tiver a
 * URL consegue gravar linhas. Como ela não devolve dados nem expõe a planilha,
 * o risco é baixo — mas não divulgue a URL fora de casa. O doGet abaixo garante
 * que essa implantação NUNCA serve o dashboard.
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

/**
 * GET tem dois papéis, um por implantação:
 * - Telemetria ("executar como: eu" + "qualquer pessoa"): só o ping. Nessa
 *   implantação o usuário ativo vem vazio ou difere do efetivo (que sou eu),
 *   então o gate abaixo NUNCA deixa o dashboard sair por ela — se saísse,
 *   a leitura rodaria como eu e a URL pública entregaria os dados das meninas.
 * - Dashboard ("executar como: usuário que acessa" + "conta Google"): ativo e
 *   efetivo são a mesma pessoa (o visitante), e a leitura da planilha roda COMO
 *   o visitante — ou seja, quem o Sheets barrar, o dash barra igual.
 */
function doGet() {
  var ativo = Session.getActiveUser().getEmail();
  var efetivo = Session.getEffectiveUser().getEmail();
  if (!ativo || ativo !== efetivo) {
    return ContentService.createTextOutput('Endpoint da Missão Estudos ativo — ' + CAMPOS.length + ' campos por evento.');
  }

  var t = HtmlService.createTemplateFromFile('dashboard');
  // </ escapado para o JSON não poder fechar a tag <script> que o embala
  t.dadosJson = JSON.stringify(lerEventos_()).replace(/</g, '\\u003c');
  return t.evaluate()
    .setTitle('Missão Estudos — acompanhamento')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Linhas da aba Eventos, só com os campos que o dashboard usa.
 * Sessões de teste de adulto ficam de fora já aqui: rápido demais e certeiro
 * demais, envenenariam justamente as métricas que o dash exibe.
 */
function lerEventos_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ABA);
  if (!sh || sh.getLastRow() < 2) return [];

  var USADOS = ['aluna', 'materia', 'tema_id', 'subtema', 'sessao_id', 'timestamp',
                'resultado', 'usou_dica', 'usou_andaime', 'dificuldade', 'contexto'];
  var linhas = sh.getRange(2, 1, sh.getLastRow() - 1, CAMPOS.length).getValues();

  return linhas
    .filter(function (l) { return l[CAMPOS.indexOf('aluna')] && !/\(teste\)/i.test(l[CAMPOS.indexOf('aluna')]); })
    .map(function (l) {
      var ev = {};
      USADOS.forEach(function (c) {
        var v = l[CAMPOS.indexOf(c)];
        ev[c] = (v instanceof Date) ? v.toISOString() : v;
      });
      return ev;
    });
}
