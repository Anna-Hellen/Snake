/*
 * SnakeGame.Backgrounds
 * Sistema de fundos para o jogo Snake
 * 
 * e inclua-o no index.html ANTES de lib/game.js
 */

var SnakeGame = SnakeGame || {};

SnakeGame.Backgrounds = (function () {

  // ─── Configurações de cada background ───────────────────────────────────────
  var themes = {

    classic: {
      name: "Clássico",
      emoji: "🟩",
      bodyBg: "#1a1a2e",
      borderColor: "#4CAF50",
      snakeColor: "#4CAF50",
      snakeHeadColor: "#81C784",
      draw: function (ctx, w, h) {
        // Fundo escuro com grid verde clássico
        ctx.fillStyle = "#0d1f0d";
        ctx.fillRect(0, 0, w, h);

        // Linhas de grid
        var cellSize = 20;
        ctx.strokeStyle = "rgba(76, 175, 80, 0.15)";
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= w; x += cellSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (var y = 0; y <= h; y += cellSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      }
    },

    neon: {
      name: "Neon City",
      emoji: "🌆",
      bodyBg: "#0a0010",
      borderColor: "#ff00ff",
      snakeColor: "#00ffff",
      snakeHeadColor: "#ffffff",
      draw: function (ctx, w, h) {
        // Fundo cyberpunk escuro
        ctx.fillStyle = "#05000f";
        ctx.fillRect(0, 0, w, h);

        var cellSize = 20;

        // Grid neon magenta
        ctx.strokeStyle = "rgba(255, 0, 255, 0.12)";
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= w; x += cellSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (var y = 0; y <= h; y += cellSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Linhas de perspectiva no horizonte (efeito cidade)
        var horizon = h * 0.55;
        ctx.strokeStyle = "rgba(0, 255, 255, 0.06)";
        ctx.lineWidth = 1;
        for (var i = 0; i < 12; i++) {
          ctx.beginPath();
          ctx.moveTo(w / 2, horizon);
          ctx.lineTo((w / 12) * i, h);
          ctx.stroke();
        }

        // Glow no horizonte
        var grd = ctx.createLinearGradient(0, horizon - 30, 0, horizon + 60);
        grd.addColorStop(0, "rgba(255, 0, 255, 0)");
        grd.addColorStop(0.5, "rgba(255, 0, 255, 0.08)");
        grd.addColorStop(1, "rgba(0, 255, 255, 0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, horizon - 30, w, 90);
      }
    },

    forest: {
      name: "Floresta",
      emoji: "🌿",
      bodyBg: "#0b1a0b",
      borderColor: "#2d6a4f",
      snakeColor: "#52b788",
      snakeHeadColor: "#d8f3dc",
      draw: function (ctx, w, h) {
        // Fundo floresta escura
        ctx.fillStyle = "#071510";
        ctx.fillRect(0, 0, w, h);

        // Gradiente de névoa no topo
        var fog = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        fog.addColorStop(0, "rgba(82, 183, 136, 0.06)");
        fog.addColorStop(1, "rgba(82, 183, 136, 0)");
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Padrão de folhas (círculos orgânicos pequenos)
        ctx.fillStyle = "rgba(45, 106, 79, 0.07)";
        var seed = 42;
        var rng = function () { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
        for (var i = 0; i < 80; i++) {
          var lx = rng() * w;
          var ly = rng() * h;
          var lr = rng() * 18 + 4;
          ctx.beginPath();
          ctx.ellipse(lx, ly, lr, lr * 0.6, rng() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }

        // Grid sutil
        var cellSize = 20;
        ctx.strokeStyle = "rgba(82, 183, 136, 0.08)";
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= w; x += cellSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (var y = 0; y <= h; y += cellSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      }
    },

    space: {
      name: "Espaço",
      emoji: "🚀",
      bodyBg: "#00001a",
      borderColor: "#7b2d8b",
      snakeColor: "#a855f7",
      snakeHeadColor: "#e879f9",
      draw: function (ctx, w, h) {
        // Fundo espaço profundo
        ctx.fillStyle = "#010008";
        ctx.fillRect(0, 0, w, h);

        // Estrelas (determinísticas para não piscar)
        var starSeed = 7;
        var srng = function () { starSeed = (starSeed * 1664525 + 1013904223) & 0xffffffff; return (starSeed >>> 0) / 0xffffffff; };

        for (var i = 0; i < 160; i++) {
          var sx = srng() * w;
          var sy = srng() * h;
          var size = srng() * 1.8 + 0.3;
          var bright = srng() * 0.6 + 0.2;
          ctx.fillStyle = "rgba(255, 255, 255, " + bright + ")";
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Nebulosa roxa sutil
        var neb1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.4);
        neb1.addColorStop(0, "rgba(123, 45, 139, 0.12)");
        neb1.addColorStop(1, "rgba(123, 45, 139, 0)");
        ctx.fillStyle = neb1;
        ctx.fillRect(0, 0, w, h);

        var neb2 = ctx.createRadialGradient(w * 0.75, h * 0.7, 0, w * 0.75, h * 0.7, w * 0.35);
        neb2.addColorStop(0, "rgba(59, 7, 100, 0.15)");
        neb2.addColorStop(1, "rgba(59, 7, 100, 0)");
        ctx.fillStyle = neb2;
        ctx.fillRect(0, 0, w, h);

        // Grid estelar
        var cellSize = 20;
        ctx.strokeStyle = "rgba(168, 85, 247, 0.07)";
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= w; x += cellSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (var y = 0; y <= h; y += cellSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      }
    },

    desert: {
      name: "Deserto",
      emoji: "🏜️",
      bodyBg: "#1a0f00",
      borderColor: "#c77c2c",
      snakeColor: "#e8a84c",
      snakeHeadColor: "#fff3d4",
      draw: function (ctx, w, h) {
        // Céu noturno do deserto (fundo)
        ctx.fillStyle = "#0d0804";
        ctx.fillRect(0, 0, w, h);

        // Horizonte com areia
        var sand = ctx.createLinearGradient(0, h * 0.6, 0, h);
        sand.addColorStop(0, "rgba(199, 124, 44, 0.18)");
        sand.addColorStop(1, "rgba(199, 124, 44, 0.06)");
        ctx.fillStyle = sand;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);

        // Lua/sol no canto
        var moonGlow = ctx.createRadialGradient(w * 0.85, h * 0.15, 0, w * 0.85, h * 0.15, 80);
        moonGlow.addColorStop(0, "rgba(255, 220, 120, 0.15)");
        moonGlow.addColorStop(0.3, "rgba(255, 200, 80, 0.06)");
        moonGlow.addColorStop(1, "rgba(255, 180, 40, 0)");
        ctx.fillStyle = moonGlow;
        ctx.fillRect(0, 0, w, h);

        // Estrelas do deserto
        var dSeed = 99;
        var drng = function () { dSeed = (dSeed * 1664525 + 1013904223) & 0xffffffff; return (dSeed >>> 0) / 0xffffffff; };
        for (var i = 0; i < 60; i++) {
          var sx = drng() * w;
          var sy = drng() * h * 0.55;
          ctx.fillStyle = "rgba(255, 220, 160, " + (drng() * 0.4 + 0.1) + ")";
          ctx.beginPath();
          ctx.arc(sx, sy, drng() * 1.2 + 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Grid areia
        var cellSize = 20;
        ctx.strokeStyle = "rgba(199, 124, 44, 0.10)";
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= w; x += cellSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (var y = 0; y <= h; y += cellSize) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      }
    },

    retro: {
      name: "Retrô",
      emoji: "👾",
      bodyBg: "#0f0f00",
      borderColor: "#ffff00",
      snakeColor: "#ffff00",
      snakeHeadColor: "#ffffff",
      draw: function (ctx, w, h) {
        // Fundo preto CRT
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        // Scanlines horizontais (efeito CRT)
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        for (var y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 2);
        }

        // Vinheta de tela CRT
        var crt = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.95);
        crt.addColorStop(0, "rgba(0,0,0,0)");
        crt.addColorStop(1, "rgba(0,0,0,0.55)");
        ctx.fillStyle = crt;
        ctx.fillRect(0, 0, w, h);

        // Grid amarelo fosforescente
        var cellSize = 20;
        ctx.strokeStyle = "rgba(255, 255, 0, 0.08)";
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= w; x += cellSize) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (var y2 = 0; y2 <= h; y2 += cellSize) {
          ctx.beginPath(); ctx.moveTo(0, y2); ctx.lineTo(w, y2); ctx.stroke();
        }
      }
    }

  };

  // ─── Estado atual ────────────────────────────────────────────────────────────
  var current = "classic";

  // ─── API pública ─────────────────────────────────────────────────────────────
  return {

    themes: themes,

    getCurrent: function () {
      return themes[current];
    },

    setTheme: function (key) {
      if (themes[key]) {
        current = key;
        // Atualiza fundo da página
        document.body.style.background = themes[key].bodyBg;
        // Atualiza borda do canvas
        var canvas = document.getElementById("game-canvas");
        if (canvas) {
          canvas.style.boxShadow = "0 0 30px " + themes[key].borderColor + "55, 0 0 60px " + themes[key].borderColor + "22";
          canvas.style.border = "2px solid " + themes[key].borderColor + "88";
        }
        // Atualiza botões
        document.querySelectorAll(".bg-btn").forEach(function (btn) {
          btn.classList.toggle("active", btn.dataset.theme === key);
        });
      }
    },

    draw: function (ctx, width, height) {
      themes[current].draw(ctx, width, height);
    }

  };

})();
