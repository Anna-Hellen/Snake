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
    /* --- background (tema selecionado) --- */
    window.SnakeGame.Backgrounds.draw(ctx, this.xDim, this.yDim, this.radius);

    /* --- game objects --- */
    this.apple.draw(ctx);
    this.snake.draw(ctx);
  };

  Level.prototype.changeSnakeDirection = function (direction) {
    var opposite = { up: "down", down: "up", left: "right", right: "left" };

    /* Ignora se a cobra tiver mais de 1 segmento e a direção for oposta */
    if (
      this.snake.joints.length > 1 &&
      opposite[direction] === this.snake.direction
    ) {
      return;
    }

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
