(function () {
  if (typeof SnakeGame === 'undefined') {
    window.SnakeGame = {};
  }

  SnakeGame.Fruits = (function () {
    function drawApple(ctx, cx, cy, r) {
      /* glow externo */
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,69,69,0.12)';
      ctx.fill();
      /* esfera vermelha */
      var g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      g.addColorStop(0, '#ff9090');
      g.addColorStop(0.5, '#ff4545');
      g.addColorStop(1, '#8b0000');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      /* cabo */
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.4, cy - r * 1.4);
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = Math.max(1, r * 0.18);
      ctx.lineCap = 'round';
      ctx.stroke();
      /* brilho */
      ctx.beginPath();
      ctx.arc(cx - r * 0.28, cy - r * 0.28, r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
    }

    function drawOrange(ctx, cx, cy, r) {
      /* glow */
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,140,0,0.12)';
      ctx.fill();
      /* esfera laranja */
      var g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      g.addColorStop(0, '#ffd080');
      g.addColorStop(0.5, '#ff8c00');
      g.addColorStop(1, '#7a3800');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      /* textura de casca (pontinhos) */
      ctx.fillStyle = 'rgba(160,60,0,0.18)';
      for (var i = 0; i < 10; i++) {
        var a = (i / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
      /* cabo */
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.3, cy - r * 1.35);
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = Math.max(1, r * 0.15);
      ctx.lineCap = 'round';
      ctx.stroke();
      /* brilho */
      ctx.beginPath();
      ctx.arc(cx - r * 0.28, cy - r * 0.28, r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fill();
    }

    function drawWatermelon(ctx, cx, cy, r) {
      /* glow verde */
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40,180,40,0.12)';
      ctx.fill();
      /* casca verde escura */
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#1e6b1e';
      ctx.fill();
      /* faixa clara da casca */
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
      ctx.fillStyle = '#e8ffe0';
      ctx.fill();
      /* polpa vermelha */
      var g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.05, cx, cy, r * 0.76);
      g.addColorStop(0, '#ff9090');
      g.addColorStop(0.5, '#ff2222');
      g.addColorStop(1, '#aa0000');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.74, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      /* sementes */
      ctx.fillStyle = '#110500';
      [
        [0, -0.38],
        [0.3, 0.15],
        [-0.3, 0.15],
        [0, 0.42],
        [0.42, -0.1],
        [-0.42, -0.1],
      ].forEach(function (s) {
        ctx.save();
        ctx.translate(cx + s[0] * r * 0.6, cy + s[1] * r * 0.6);
        ctx.rotate(Math.atan2(s[1], s[0]) + Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.055, r * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      /* brilho */
      ctx.beginPath();
      ctx.arc(cx - r * 0.25, cy - r * 0.3, r * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();
    }

    function drawStrawberry(ctx, cx, cy, r) {
      /* glow */
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,50,100,0.12)';
      ctx.fill();
      /* corpo vermelho-rosa */
      var g = ctx.createRadialGradient(
        cx - r * 0.25,
        cy - r * 0.2,
        r * 0.05,
        cx + r * 0.05,
        cy + r * 0.1,
        r
      );
      g.addColorStop(0, '#ffb0b8');
      g.addColorStop(0.4, '#ff2255');
      g.addColorStop(1, '#880020');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      /* sementes (pontinhos claros) */
      ctx.fillStyle = 'rgba(255,220,200,0.75)';
      [
        [0, -0.42],
        [0.34, -0.22],
        [-0.34, -0.22],
        [0.44, 0.08],
        [-0.44, 0.08],
        [0, 0.38],
        [0.26, 0.4],
        [-0.26, 0.4],
      ].forEach(function (s) {
        ctx.beginPath();
        ctx.arc(cx + s[0] * r, cy + s[1] * r, Math.max(1, r * 0.072), 0, Math.PI * 2);
        ctx.fill();
      });
      /* folhas verdes no topo */
      ctx.fillStyle = '#22cc00';
      for (var i = 0; i < 5; i++) {
        var a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.8);
        ctx.quadraticCurveTo(
          cx + Math.cos(a) * r * 0.62,
          cy - r * 0.8 + Math.sin(a) * r * 0.5,
          cx + Math.cos(a) * r * 0.44,
          cy - r * 1.05
        );
        ctx.fill();
      }
      /* brilho */
      ctx.beginPath();
      ctx.arc(cx - r * 0.28, cy - r * 0.3, r * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fill();
    }

    function drawGrape(ctx, cx, cy, r) {
      /* glow */
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(130,40,200,0.12)';
      ctx.fill();
      /* cluster de 4 uvas */
      var gr = r * 0.44;
      [
        [0, -r * 0.36],
        [-r * 0.38, 0],
        [r * 0.38, 0],
        [0, r * 0.4],
      ].forEach(function (pos) {
        var gx = cx + pos[0],
          gy = cy + pos[1];
        var gg = ctx.createRadialGradient(gx - gr * 0.3, gy - gr * 0.3, gr * 0.05, gx, gy, gr);
        gg.addColorStop(0, '#e0a0ff');
        gg.addColorStop(0.5, '#9b30d0');
        gg.addColorStop(1, '#3a0060');
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fillStyle = gg;
        ctx.fill();
        /* brilho por uva */
        ctx.beginPath();
        ctx.arc(gx - gr * 0.28, gy - gr * 0.28, gr * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.38)';
        ctx.fill();
      });
      /* cabo */
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.72);
      ctx.lineTo(cx + r * 0.22, cy - r * 1.12);
      ctx.strokeStyle = '#8b6914';
      ctx.lineWidth = Math.max(1, r * 0.14);
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    function drawLemon(ctx, cx, cy, r) {
      /* glow */
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,240,0,0.12)';
      ctx.fill();
      /* corpo oval (achatado verticalmente) */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.82);
      var g = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.05, 0, 0, r);
      g.addColorStop(0, '#ffffa8');
      g.addColorStop(0.5, '#ffe000');
      g.addColorStop(1, '#b07800');
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
      /* pontinhas do limão (topo e base) */
      [
        [0, -r * 0.82],
        [0, r * 0.82],
      ].forEach(function (p) {
        ctx.beginPath();
        ctx.arc(cx + p[0], cy + p[1], r * 0.19, 0, Math.PI * 2);
        ctx.fillStyle = '#b07800';
        ctx.fill();
      });
      /* brilho */
      ctx.beginPath();
      ctx.arc(cx - r * 0.28, cy - r * 0.28, r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
    }

    var fruits = {
      apple: { name: 'Maca', draw: drawApple },
      orange: { name: 'Laranja', draw: drawOrange },
      watermelon: { name: 'Melancia', draw: drawWatermelon },
      strawberry: { name: 'Morango', draw: drawStrawberry },
      grape: { name: 'Uva', draw: drawGrape },
      lemon: { name: 'Limao', draw: drawLemon },
    };

    var current = 'apple';

    function setCurrent(key) {
      if (!fruits[key]) return;
      current = key;
      document.querySelectorAll('.fruit-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.fruit === key);
      });
    }

    function draw(ctx, cx, cy, r) {
      fruits[current].draw(ctx, cx, cy, r);
    }

    return { fruits: fruits, setCurrent: setCurrent, draw: draw };
  })();

  var Apple = (window.SnakeGame.Apple = function (level) {
    this.radius = level.radius;
    this.level = level;
    this.resetPosition();
  });

  Apple.prototype.resetPosition = function () {
    var position = this.randomApplePosition();
    while (this.level.snake.deepIncludes(position)) {
      position = this.randomApplePosition();
    }
    this.position = position;
  };

  Apple.prototype.randomApplePosition = function () {
    var length = this.level.cols;
    var height = this.level.rows;

    var x = Math.floor(Math.random() * length);
    var y = Math.floor(Math.random() * height);

    return [x, y];
  };

  Apple.prototype.draw = function (ctx) {
    var r = this.radius;
    var cx = this.position[0] * r * 2 + r;
    var cy = this.position[1] * r * 2 + r;
    window.SnakeGame.Fruits.draw(ctx, cx, cy, r);
  };
})();
