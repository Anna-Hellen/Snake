(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Level = (window.SnakeGame.Level = function (radius, game) {
    this.game = game;
    this.xDim = game.X_DIM;
    this.yDim = game.Y_DIM;
    this.radius = radius;
    this.numApples = 0;
    this.snake = new window.SnakeGame.Snake(this);
    this.apple = new window.SnakeGame.Apple(this);
    this.isLost = false;
    this.bindKeyHandlers();
  });

  Level.prototype.bindKeyHandlers = function () {
    $(document).keydown(
      function (e) {
        e.preventDefault();

        var keyHash = {
          38: "up",
          87: "up",
          40: "down",
          83: "down",
          37: "left",
          65: "left",
          39: "right",
          68: "right",
        };

        var direction = keyHash[e.keyCode];

        if (direction) {
          this.changeSnakeDirection(direction);
        } else if (e.keyCode === 27) {
          this.game.endLevel("esc");
        }
      }.bind(this),
    );
  };

  Level.prototype.draw = function (ctx) {
    /* --- background --- */
    ctx.fillStyle = "#080c08";
    ctx.fillRect(0, 0, this.xDim, this.yDim);

    /* --- subtle dot grid matching the CSS background --- */
    var cell = this.radius * 2; /* one snake cell = one grid unit */
    var cols = Math.ceil(this.xDim / cell);
    var rows = Math.ceil(this.yDim / cell);

    ctx.fillStyle = "rgba(57, 255, 20, 0.07)";
    for (var col = 0; col <= cols; col++) {
      for (var row = 0; row <= rows; row++) {
        ctx.beginPath();
        ctx.arc(col * cell, row * cell, 1, 0, Math.PI * 2, false);
        ctx.fill();
      }
    }

    /* --- game objects --- */
    this.apple.draw(ctx);
    this.snake.draw(ctx);
  };

  Level.prototype.changeSnakeDirection = function (direction) {
    this.snake.direction = direction;
  };

  Level.prototype.changeApplePosition = function () {
    this.numApples++;
    this.game.incrementScore(); /* delegates score update + pulse to Game */
    this.apple.resetPosition();
  };

  Level.prototype.lose = function () {
    this.isLost = true;
  };

  Level.prototype.isWon = function () {
    return (
      this.snake.joints.length ===
      (this.xDim / (this.radius * 2)) * (this.yDim / (this.radius * 2))
    );
  };

  Level.prototype.step = function () {
    if (this.isWon()) return "won";
    if (this.isLost) return "lost";
    this.snake.move();
  };
})();
