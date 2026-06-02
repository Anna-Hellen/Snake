(function () {
  if (typeof SnakeGame === 'undefined') {
    window.SnakeGame = {};
  }

  var Level = (window.SnakeGame.Level = function (radius, game) {
    this.game = game;
    var cell = radius * 2;
    this.cols = Math.max(1, Math.floor(game.X_DIM / cell));
    this.rows = Math.max(1, Math.floor(game.Y_DIM / cell));
    this.xDim = this.cols * cell;
    this.yDim = this.rows * cell;
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
          38: 'up',
          87: 'up',
          40: 'down',
          83: 'down',
          37: 'left',
          65: 'left',
          39: 'right',
          68: 'right',
        };

        var direction = keyHash[e.keyCode];

        if (direction) {
          this.changeSnakeDirection(direction);
        } else if (e.keyCode === 27) {
          this.game.endLevel('esc');
        }
      }.bind(this)
    );
  };

  Level.prototype.draw = function (ctx) {
    window.SnakeGame.Backgrounds.draw(ctx, this.xDim, this.yDim, this.radius);
    this.apple.draw(ctx);
    this.snake.draw(ctx);
  };

  Level.prototype.changeSnakeDirection = function (direction) {
    var opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };

    /* Usa a direção pendente como base da comparação, não a atual.
     * Isso evita a race condition onde duas teclas no mesmo frame
     * passam pela verificação porque a direção ainda não foi aplicada. */
    var currentDir = this._pendingDirection || this.snake.direction;

    if (this.snake.joints.length > 1 && opposite[direction] === currentDir) {
      return;
    }

    this._pendingDirection = direction;
  };

  Level.prototype.changeApplePosition = function () {
    this.numApples++;
    this.game.incrementScore();
    this.apple.resetPosition();
  };

  Level.prototype.lose = function () {
    this.isLost = true;
  };

  Level.prototype.isWon = function () {
    return this.snake.joints.length === this.cols * this.rows;
  };

  Level.prototype.step = function () {
    if (this.isWon()) return 'won';
    if (this.isLost) return 'lost';

    /* Aplica a direção pendente uma vez por frame, antes de mover */
    if (this._pendingDirection) {
      this.snake.direction = this._pendingDirection;
      this._pendingDirection = null;
    }

    this.snake.move();
  };
})();
