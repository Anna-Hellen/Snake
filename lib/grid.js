(function () {
  if (typeof Snake === "undefined") {
    window.Snake = {}
  }

  var Game = window.CrystalQuest.Game = function (xDim, yDim, ctx, audioCtx) {
    this.X_DIM = xDim;
    this.Y_DIM = yDim;
    this.ctx = ctx;
    this.audioCtx = audioCtx;
    this.database = {};
    // this.database = new Firebase("https://luminous-inferno-7080.firebaseio.com/web/data");

    this.bindKeyHandlers();
  }

  Game.prototype.bindKeyHandlers = function () {
    $(document).keyup(function (e) {
      e.preventDefault();

      if (e.keyCode === 13) {
        $('#start').click();
        $('#next-level').click();
      }
    }.bind(this));
  }
})
