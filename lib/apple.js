(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Apple = window.SnakeGame.Apple = function (level) {
    this.radius = level.radius;
    this.level = level;
    this.resetPosition();
  };

  Apple.prototype.resetPosition = function () {
    var position = this.randomApplePosition();

    while (this.level.snake.deepIncludes(position)) {
      position = this.randomApplePosition();
    }

    this.position = position;
  };

  Apple.prototype.randomApplePosition = function () {
    var length = this.level.xDim / (this.radius * 2);
    var height = this.level.yDim / (this.radius * 2);

    var x = Math.floor(Math.random() * (length - 1));
    var y = Math.floor(Math.random() * (height - 1));

    return [x, y];
  };

  Apple.prototype.draw = function (ctx) {
    var r  = this.radius;
    var cx = (this.position[0] * r * 2) + r;
    var cy = (this.position[1] * r * 2) + r;

    /* --- outer glow ring --- */
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2, false);
    ctx.fillStyle = 'rgba(255, 69, 69, 0.12)';
    ctx.fill();

    /* --- radial gradient fill (gives sphere depth) --- */
    var grad = ctx.createRadialGradient(
      cx - r * 0.3, cy - r * 0.3, r * 0.1,
      cx, cy, r
    );
    grad.addColorStop(0,   '#ff9090');   /* bright highlight */
    grad.addColorStop(0.5, '#ff4545');   /* main red */
    grad.addColorStop(1,   '#8b0000');   /* deep shadow */

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
    ctx.fillStyle = grad;
    ctx.fill();

    /* --- stem (small green tick on top) --- */
    ctx.beginPath();
    ctx.moveTo(cx,       cy - r);
    ctx.lineTo(cx + r * 0.4, cy - r * 1.4);
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth   = Math.max(1, r * 0.18);
    ctx.lineCap     = 'round';
    ctx.stroke();

    /* --- specular highlight dot --- */
    ctx.beginPath();
    ctx.arc(cx - r * 0.28, cy - r * 0.28, r * 0.18, 0, Math.PI * 2, false);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fill();
  };

})();
// ctx.beginPath();
    //
    // ctx.arc(
    //   (this.position[0] * this.radius * 2) + this.radius,
    //   (this.position[1] * this.radius * 2) + this.radius,
    //   this.radius,
    //   0,
    //   (2 * Math.PI),
    //   false
    // );
    // ctx.fillStyle = "#FF0000";
    // ctx.fill();