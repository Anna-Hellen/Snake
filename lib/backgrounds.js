/*
 * SnakeGame.Backgrounds
 * Sistema de backgrounds temáticos para o Snake
 *
 * Integração: level.js chama SnakeGame.Backgrounds.draw(ctx, w, h, radius)
 */

(function () {
  if (typeof SnakeGame === 'undefined') {
    window.SnakeGame = {};
  }

  var current = 'classic';

  var themes = {
    /* ── 1. CLÁSSICO ─────────────────────────────────────────── */
    classic: {
      name: 'Clássico',
      pageColor: '#0a1a0a',
      borderColor: '#39ff14',
      draw: function (ctx, w, h, radius) {
        /* fundo escuro */
        ctx.fillStyle = '#080c08';
        ctx.fillRect(0, 0, w, h);

        /* pontos verdes originais do jogo */
        var cell = radius * 2;
        var cols = Math.ceil(w / cell);
        var rows = Math.ceil(h / cell);
        ctx.fillStyle = 'rgba(57, 255, 20, 0.07)';
        for (var c = 0; c <= cols; c++) {
          for (var r = 0; r <= rows; r++) {
            ctx.beginPath();
            ctx.arc(c * cell, r * cell, 1, 0, Math.PI * 2, false);
            ctx.fill();
          }
        }
      },
    },

    /* ── 2. NEON CITY ────────────────────────────────────────── */
    neon: {
      name: 'Neon City',
      pageColor: '#08000f',
      borderColor: '#ff00ff',
      draw: function (ctx, w, h, radius) {
        ctx.fillStyle = '#05000f';
        ctx.fillRect(0, 0, w, h);

        /* grade magenta */
        var cell = radius * 2;
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.13)';
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= w; x += cell) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (var y = 0; y <= h; y += cell) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        /* linhas de perspectiva ciano */
        var hz = h * 0.55;
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        for (var i = 0; i < 14; i++) {
          ctx.beginPath();
          ctx.moveTo(w / 2, hz);
          ctx.lineTo((w / 14) * i, h);
          ctx.stroke();
        }

        /* brilho do horizonte */
        var grd = ctx.createLinearGradient(0, hz - 30, 0, hz + 70);
        grd.addColorStop(0, 'rgba(255,0,255,0)');
        grd.addColorStop(0.5, 'rgba(255,0,255,0.09)');
        grd.addColorStop(1, 'rgba(0,255,255,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, hz - 30, w, 100);

        /* pontos de cruzamento brilhantes */
        ctx.fillStyle = 'rgba(255, 0, 255, 0.18)';
        for (var cx = 0; cx <= w; cx += cell) {
          for (var cy = 0; cy <= h; cy += cell) {
            ctx.beginPath();
            ctx.arc(cx, cy, 1.2, 0, Math.PI * 2, false);
            ctx.fill();
          }
        }
      },
    },

    /* ── 3. FLORESTA ─────────────────────────────────────────── */
    forest: {
      name: 'Floresta',
      pageColor: '#041008',
      borderColor: '#52b788',
      draw: function (ctx, w, h, radius) {
        ctx.fillStyle = '#061210';
        ctx.fillRect(0, 0, w, h);

        /* névoa no topo */
        var fog = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        fog.addColorStop(0, 'rgba(82,183,136,0.08)');
        fog.addColorStop(1, 'rgba(82,183,136,0)');
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, w, h * 0.45);

        /* padrão de folhas */
        var s = 42;
        var rng = function () {
          s = (s * 1664525 + 1013904223) & 0xffffffff;
          return (s >>> 0) / 0xffffffff;
        };
        ctx.fillStyle = 'rgba(45, 106, 79, 0.09)';
        for (var i = 0; i < 75; i++) {
          ctx.beginPath();
          ctx.ellipse(
            rng() * w,
            rng() * h,
            rng() * 18 + 4,
            rng() * 10 + 3,
            rng() * Math.PI,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        /* pontos de grade verdes */
        var cell = radius * 2;
        ctx.fillStyle = 'rgba(82, 183, 136, 0.12)';
        for (var c = 0; c <= Math.ceil(w / cell); c++) {
          for (var r = 0; r <= Math.ceil(h / cell); r++) {
            ctx.beginPath();
            ctx.arc(c * cell, r * cell, 1, 0, Math.PI * 2, false);
            ctx.fill();
          }
        }
      },
    },

    /* ── 4. ESPAÇO ───────────────────────────────────────────── */
    space: {
      name: 'Espaço',
      pageColor: '#00001a',
      borderColor: '#a855f7',
      draw: function (ctx, w, h, radius) {
        ctx.fillStyle = '#010008';
        ctx.fillRect(0, 0, w, h);

        /* estrelas */
        var ss = 7;
        var sr = function () {
          ss = (ss * 1664525 + 1013904223) & 0xffffffff;
          return (ss >>> 0) / 0xffffffff;
        };
        for (var i = 0; i < 160; i++) {
          ctx.fillStyle = 'rgba(255,255,255,' + (sr() * 0.65 + 0.15) + ')';
          ctx.beginPath();
          ctx.arc(sr() * w, sr() * h, sr() * 1.6 + 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        /* nebulosa roxa */
        var n1 = ctx.createRadialGradient(w * 0.28, h * 0.3, 0, w * 0.28, h * 0.3, w * 0.42);
        n1.addColorStop(0, 'rgba(123,45,139,0.16)');
        n1.addColorStop(1, 'rgba(123,45,139,0)');
        ctx.fillStyle = n1;
        ctx.fillRect(0, 0, w, h);

        var n2 = ctx.createRadialGradient(w * 0.74, h * 0.68, 0, w * 0.74, h * 0.68, w * 0.36);
        n2.addColorStop(0, 'rgba(59,7,100,0.18)');
        n2.addColorStop(1, 'rgba(59,7,100,0)');
        ctx.fillStyle = n2;
        ctx.fillRect(0, 0, w, h);

        /* pontos de grade roxos */
        var cell = radius * 2;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.14)';
        for (var c = 0; c <= Math.ceil(w / cell); c++) {
          for (var r = 0; r <= Math.ceil(h / cell); r++) {
            ctx.beginPath();
            ctx.arc(c * cell, r * cell, 1, 0, Math.PI * 2, false);
            ctx.fill();
          }
        }
      },
    },

    /* ── 5. DESERTO ──────────────────────────────────────────── */
    desert: {
      name: 'Deserto',
      pageColor: '#1a0f00',
      borderColor: '#e8a84c',
      draw: function (ctx, w, h, radius) {
        ctx.fillStyle = '#0c0703';
        ctx.fillRect(0, 0, w, h);

        /* horizonte com areia */
        var sand = ctx.createLinearGradient(0, h * 0.62, 0, h);
        sand.addColorStop(0, 'rgba(199,124,44,0.22)');
        sand.addColorStop(1, 'rgba(199,124,44,0.06)');
        ctx.fillStyle = sand;
        ctx.fillRect(0, h * 0.62, w, h * 0.38);

        /* lua no canto superior direito */
        var mg = ctx.createRadialGradient(w * 0.85, h * 0.15, 0, w * 0.85, h * 0.15, 90);
        mg.addColorStop(0, 'rgba(255,220,120,0.2)');
        mg.addColorStop(0.35, 'rgba(255,200,80,0.08)');
        mg.addColorStop(1, 'rgba(255,180,40,0)');
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, w, h);

        /* estrelas quentes */
        var ds = 99;
        var dr = function () {
          ds = (ds * 1664525 + 1013904223) & 0xffffffff;
          return (ds >>> 0) / 0xffffffff;
        };
        for (var i = 0; i < 60; i++) {
          ctx.fillStyle = 'rgba(255,220,160,' + (dr() * 0.4 + 0.1) + ')';
          ctx.beginPath();
          ctx.arc(dr() * w, dr() * h * 0.58, dr() * 1.3 + 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        /* pontos de grade âmbar */
        var cell = radius * 2;
        ctx.fillStyle = 'rgba(199, 124, 44, 0.13)';
        for (var c = 0; c <= Math.ceil(w / cell); c++) {
          for (var r = 0; r <= Math.ceil(h / cell); r++) {
            ctx.beginPath();
            ctx.arc(c * cell, r * cell, 1, 0, Math.PI * 2, false);
            ctx.fill();
          }
        }
      },
    },

    /* ── 6. RETRÔ ────────────────────────────────────────────── */
    retro: {
      name: 'Retrô',
      pageColor: '#0d0d00',
      borderColor: '#ffff00',
      draw: function (ctx, w, h, radius) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        /* scanlines CRT */
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        for (var y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 2);
        }

        /* vinheta */
        var crt = ctx.createRadialGradient(w / 2, h / 2, h * 0.18, w / 2, h / 2, h * 0.95);
        crt.addColorStop(0, 'rgba(0,0,0,0)');
        crt.addColorStop(1, 'rgba(0,0,0,0.62)');
        ctx.fillStyle = crt;
        ctx.fillRect(0, 0, w, h);

        /* pontos fosforescentes amarelos */
        var cell = radius * 2;
        ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
        for (var c = 0; c <= Math.ceil(w / cell); c++) {
          for (var r = 0; r <= Math.ceil(h / cell); r++) {
            ctx.beginPath();
            ctx.arc(c * cell, r * cell, 1, 0, Math.PI * 2, false);
            ctx.fill();
          }
        }
      },
    },
  };

  /* ── API pública ──────────────────────────────────────────── */

  var Backgrounds = (window.SnakeGame.Backgrounds = {
    themes: themes,

    setTheme: function (key) {
      if (!themes[key]) return;
      current = key;
      var t = themes[key];

      /* fundo da página */
      document.body.style.background = t.pageColor;

      /* brilho do canvas */
      var canvas = document.getElementById('game-canvas');
      if (canvas) {
        canvas.style.boxShadow =
          '0 0 30px ' + t.borderColor + '55, 0 0 60px ' + t.borderColor + '18';
        canvas.style.border = '2px solid ' + t.borderColor + '66';
      }

      /* botões */
      document.querySelectorAll('.bg-btn').forEach(function (btn) {
        var active = btn.dataset.theme === key;
        btn.classList.toggle('active', active);
        btn.style.borderColor = active ? t.borderColor : '';
        btn.style.color = active ? t.borderColor : '';
        btn.style.boxShadow = active ? '0 0 8px ' + t.borderColor + '55' : '';
      });
    },

    draw: function (ctx, w, h, radius) {
      themes[current].draw(ctx, w, h, radius || 10);
    },
  });

  /* Aplica o tema inicial */
  Backgrounds.setTheme('classic');
})();
