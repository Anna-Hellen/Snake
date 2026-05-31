(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {}
  }

  var Game = window.SnakeGame.Game = function (xDim, yDim, ctx, audioCtx) {
    this.X_DIM = xDim;
    this.Y_DIM = yDim;
    this.ctx = ctx;
    this.audioCtx = audioCtx;
    this.database = {};
    // this.database = new Firebase("https://luminous-inferno-7080.firebaseio.com/web/data");
    this.speed = 1;
    this.radius = 2;
    this.showSliders = false;
  };

  Game.prototype.bindKeyHandlers = function () {
    $('#controls').on('click', '#start', function (e) {
      e.preventDefault();
      this.startLevel();
    }.bind(this));

    $('#controls').on('click', '#next-level', function (e) {
      e.preventDefault();
      this.startLevel();
    }.bind(this));

    $('#controls').on('click', "#start-menu", function (e) {
      e.preventDefault();
      $('#controls').empty();
      this.ctx.clearRect(0, 0, this.X_DIM, this.Y_DIM);
      this.showIntro();
    }.bind(this));

    $('#controls').on('change', '#use-timer', function (e) {
      $('#timer-minutes').prop('disabled', !$(this).is(':checked'));
    });

    $('#controls').on('click', '#speed-slider', function (e) {
      e.preventDefault();
      var setting = this.getSliderSetting(e);
      var currentSetting = this.speed;
      $('#speed-slider').children('.slider-toggle').removeClass('size-' + currentSetting).addClass('size-' + setting);

      this.speed = setting;
    }.bind(this));

    $('#controls').on('click', '#size-slider', function (e) {
      e.preventDefault();
      var setting = this.getSliderSetting(e);
      var currentSetting = this.radius;
      $('#size-slider').children('.slider-toggle').removeClass('size-' + currentSetting).addClass('size-' + setting);

      this.radius = setting;
    }.bind(this));

    $(document).keyup(function (e) {
      e.preventDefault();

      if (e.keyCode === 13) {
        $('#start').click();
        $('#next-level').click();
      }
    }.bind(this));
  };

  Game.prototype.getSliderSetting = function(e) {
    var windowMid = window.outerWidth / 2;
    var clientX = e.clientX
    var increment = 32.25;

    if (clientX < windowMid - increment * 3) {
      return 0;
    } else if (clientX < windowMid - increment) {
      return 1;
    } else if (clientX < windowMid + increment) {
      return 2;
    } else if (clientX < windowMid + increment * 3) {
      return 3;
    }

    return 4;
  };

  Game.prototype.showIntro = function () {
    $('#status-bar').empty();
    $('#controls').empty();
    var content = ("<h1>Snake</h1>"
      + "<div class='slider' id='size-slider'><span>size</span><div class='slider-label'><span>|</span><span>|</span>|<span>|</span><span>|</span></div><div class='slider-toggle size-2'></div></div>"
      + "<div class='slider' id='speed-slider'><span>speed</span><div class='slider-label'><span>|</span><span>|</span>|<span>|</span><span>|</span></div><div class='slider-toggle size-1'></div></div>"
      + "<div class='timer-settings'><label><input type='checkbox' id='use-timer'> Use timer</label>"
      + "<label>Duration (min): <input type='number' id='timer-minutes' min='1' max='" + Game.MAX_TIMER_MINUTES + "' value='" + Game.DEFAULT_TIMER_MINUTES + "' disabled></label></div>"
      + "<br><button id='start'>Start</button><br><br><t style='font-weight:bold;'>Press <code>enter</code> or click Start to start</t>");
    $('#controls').append(content);
  };

  Game.prototype.run = function () {
    this.bindKeyHandlers();
    this.showIntro();
  };

  Game.prototype.startLevel = function () {
    var timerEnabled = $('#use-timer').is(':checked');
    var timerMinutes = parseInt($('#timer-minutes').val(), 10);
    if (timerEnabled && !isNaN(timerMinutes)) {
      timerMinutes = Math.min(Math.max(timerMinutes, 1), 5);
    } else {
      timerMinutes = null;
    }

    $('#controls').empty();
    $('#status-bar').empty();

    var level = new window.SnakeGame.Level(Game.RADII[this.radius], this);
    level.startTime = Date.now();
    level.timeLimit = timerMinutes !== null ? timerMinutes * 60 : null;

    var timerLabel = level.timeLimit !== null
      ? 'Time: 00:00 / ' + this.formatTime(level.timeLimit)
      : 'No timer';
    $('#status-bar').html('Apples: <span id="level">0</span> <span id="timer">' + timerLabel + '</span>');

    var _this = this;
    level.draw(this.ctx);

    this.interval = setInterval( function () {
      if (level.timeLimit !== null) {
        var elapsedSeconds = Math.floor((Date.now() - level.startTime) / 1000);
        $('#timer').html('Time: ' + _this.formatTime(elapsedSeconds) + ' / ' + _this.formatTime(level.timeLimit));

        if (elapsedSeconds >= level.timeLimit) {
          _this.endLevel('lost');
          return;
        }
      }

      var step = level.step();
      if (step === "lost" ) {
        _this.endLevel('lost');
      } else if (step === "won") {
        _this.endLevel('won');
      } else {
        level.draw(_this.ctx);
      }
    }, Game.SPEEDS[this.speed]);
  };

  Game.prototype.stop = function () {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  Game.prototype.win = function () {
    content = "<h1>YOU WON!!!</h1><br><button id='start'>Play Again?</button><br><button id='start-menu'>Back to Start Menu</button>";
    $('#controls').append(content);
  };

  Game.prototype.lose = function () {
    var content = "<h1>You Lost :(</h1><br><button id='start'>Play Again?</button><br><button id='start-menu'>Back to Start Menu</button>";
    $('#controls').append(content);
  };

  Game.prototype.formatTime = function (seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
  };

  Game.prototype.endLevel = function (ending) {
    this.stop();
    this.ctx.clearRect(0, 0, this.X_DIM, this.Y_DIM);
    if (ending === "esc") {
      this.showIntro();
    } else if (ending === "won") {
      this.win();
    } else {
      this.lose();
    }
  };

  Game.RADII = [5, 8, 10, 12, 15];

  Game.SPEEDS = [500, 200, 100, 80, 50];

  Game.MAX_TIMER_MINUTES = 5;
  Game.DEFAULT_TIMER_MINUTES = 2;

})();
