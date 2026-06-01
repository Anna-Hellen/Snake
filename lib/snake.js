(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Snake = window.SnakeGame.Snake = function (level) {
    this.radius    = level.radius;
    this.xDim      = level.xDim / (level.radius * 2);
    this.yDim      = level.yDim / (level.radius * 2);
    this.level     = level;
    this.direction = 'up';
    this.joints    = [[Math.floor(this.xDim / 2), Math.floor(this.yDim / 2)]];
  };

  Snake.prototype.move = function () {
    var newHead = this.joints[this.joints.length - 1].slice();

    if      (this.direction === 'up')    newHead[1] -= 1;
    else if (this.direction === 'down')  newHead[1] += 1;
    else if (this.direction === 'right') newHead[0] += 1;
    else                                 newHead[0] -= 1;

    if (newHead.toString() !== this.level.apple.position.toString()) {
      this.joints.shift();
    }

    if (this.isValidJoint(newHead)) {
      if (newHead.toString() === this.level.apple.position.toString()) {
        this.level.changeApplePosition();
      }
      this.joints.push(newHead);
    } else {
      this.level.lose();
    }
  };

  Snake.prototype.deepIncludes = function (array) {
    return !this.joints.every(function (joint) {
      return joint.toString() !== array.toString();
    });
  };

  Snake.prototype.isValidJoint = function (position) {
    return (
      position[0] >= 0 && position[0] < this.xDim &&
      position[1] >= 0 && position[1] < this.yDim &&
      !this.deepIncludes(position)
    );
  };

  Snake.prototype.draw = function (ctx) {
    var total  = this.joints.length;
    var radius = this.radius;

    /* Parse the chosen hex color into r,g,b components */
    var hex   = (this.level.game.snakeColor || '#39ff14').replace('#', '');
    var baseR = parseInt(hex.substring(0, 2), 16);
    var baseG = parseInt(hex.substring(2, 4), 16);
    var baseB = parseInt(hex.substring(4, 6), 16);

    /* Derive a bright tint and a dark shadow from the base color */
    var tint  = 'rgb(' +
      Math.min(255, baseR + 120) + ',' +
      Math.min(255, baseG + 120) + ',' +
      Math.min(255, baseB + 120) + ')';
    var shadow = 'rgb(' +
      Math.round(baseR * 0.12) + ',' +
      Math.round(baseG * 0.12) + ',' +
      Math.round(baseB * 0.12) + ')';
    var glowRgb = baseR + ',' + baseG + ',' + baseB;

    this.joints.forEach(function (joint, idx) {
      var cx = (joint[0] * radius * 2) + radius;
      var cy = (joint[1] * radius * 2) + radius;

      var t      = total === 1 ? 1 : idx / (total - 1);
      var isHead = idx === total - 1;

      /* --- segment glow near head --- */
      if (t > 0.7) {
        var glowAlpha = (t - 0.7) / 0.3 * 0.18;
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(' + glowRgb + ',' + glowAlpha.toFixed(3) + ')';
        ctx.fill();
      }

      /* --- radial gradient per segment --- */
      var grad = ctx.createRadialGradient(
        cx - radius * 0.25, cy - radius * 0.25, radius * 0.05,
        cx, cy, radius
      );

      if (isHead) {
        grad.addColorStop(0,    tint);
        grad.addColorStop(0.45, 'rgb(' + baseR + ',' + baseG + ',' + baseB + ')');
        grad.addColorStop(1,    shadow);
      } else {
        var alpha = 0.35 + t * 0.55;
        grad.addColorStop(0,   'rgba(' + Math.min(255, baseR + 120) + ',' + Math.min(255, baseG + 120) + ',' + Math.min(255, baseB + 120) + ',' + alpha.toFixed(2) + ')');
        grad.addColorStop(0.5, 'rgba(' + baseR + ',' + baseG + ',' + baseB + ',' + alpha.toFixed(2) + ')');
        grad.addColorStop(1,   'rgba(' + Math.round(baseR * 0.12) + ',' + Math.round(baseG * 0.12) + ',' + Math.round(baseB * 0.12) + ',' + alpha.toFixed(2) + ')');
      }

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2, false);
      ctx.fillStyle = grad;
      ctx.fill();

      /* --- specular highlight --- */
      ctx.beginPath();
      ctx.arc(
        cx - radius * 0.25,
        cy - radius * 0.25,
        radius * 0.2,
        0, Math.PI * 2, false
      );
      ctx.fillStyle = 'rgba(255,255,255,' + (0.12 + t * 0.18).toFixed(2) + ')';
      ctx.fill();

      /* --- eyes on the head --- */
      if (isHead) {
        var eyeR   = Math.max(1.5, radius * 0.18);
        var pupilR = Math.max(1,   radius * 0.10);
        var eyes   = this._getEyePositions(cx, cy, radius, this.direction);

        eyes.forEach(function (eye) {
          ctx.beginPath();
          ctx.arc(eye[0], eye[1], eyeR, 0, Math.PI * 2, false);
          ctx.fillStyle = 'rgba(220,255,200,0.9)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(eye[0], eye[1], pupilR, 0, Math.PI * 2, false);
          ctx.fillStyle = '#001a00';
          ctx.fill();
        });
      }
    }.bind(this));
  };

  /* ── Refatoração 3: Decompose Conditional ────────────────────
   * A lógica de posicionamento dos olhos foi extraída do draw()
   * para um método dedicado, nomeando claramente a intenção. */
  Snake.prototype._getEyePositions = function (cx, cy, radius, direction) {
    var offset = radius * 0.38;
    var isVertical = (direction === 'up' || direction === 'down');
    return isVertical
      ? [[cx - offset, cy], [cx + offset, cy]]
      : [[cx, cy - offset], [cx, cy + offset]];
  };

})();