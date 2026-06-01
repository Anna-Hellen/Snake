(function () {
  if (typeof SnakeGame === 'undefined') {
    window.SnakeGame = {};
  }

  var KEY = 'snakegame_scores';
  var MAX_ROWS = 10;

  function getAll() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(apples, seconds, result) {
    try {
      var list = getAll();
      list.push({
        apples: apples,
        seconds: seconds,
        result: result,
        date: new Date().toLocaleDateString('pt-BR'),
      });
      list.sort(function (a, b) {
        return b.apples !== a.apples ? b.apples - a.apples : a.seconds - b.seconds;
      });
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_ROWS)));
    } catch (e) {}
    render();
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    render();
  }

  function fmt(s) {
    s = s || 0;
    var m = Math.floor(s / 60),
      r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }

  function render() {
    var el = document.getElementById('scoreboard');
    if (!el) return;
    var list = getAll();
    if (list.length === 0) {
      el.innerHTML =
        '<p class="sb-title">High Scores</p>' +
        '<p class="sb-empty">Nenhuma partida salva ainda.</p>';
      return;
    }
    var rows = list
      .map(function (row, i) {
        var cls = row.result === 'won' ? 'sb-won' : 'sb-lost';
        var res = row.result === 'won' ? 'Vitoria' : 'Derrota';
        return (
          '<tr class="' +
          cls +
          '">' +
          '<td class="sb-num">' +
          (i + 1) +
          '</td>' +
          '<td class="sb-apples">' +
          row.apples +
          '</td>' +
          '<td class="sb-time">' +
          fmt(row.seconds) +
          '</td>' +
          '<td class="sb-result">' +
          res +
          '</td>' +
          '<td class="sb-date">' +
          row.date +
          '</td>' +
          '</tr>'
        );
      })
      .join('');
    el.innerHTML =
      '<p class="sb-title">High Scores</p>' +
      '<table class="sb-table">' +
      '<thead><tr><th>#</th><th>Macas</th><th>Tempo</th><th>Resultado</th><th>Data</th></tr></thead>' +
      '<tbody>' +
      rows +
      '</tbody>' +
      '</table>' +
      '<button class="sb-clear" onclick="SnakeGame.Scores.clear()">Limpar historico</button>';
  }

  window.SnakeGame.Scores = { save: save, getAll: getAll, clear: clear, fmt: fmt, render: render };
})();
