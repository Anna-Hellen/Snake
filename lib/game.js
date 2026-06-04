(function () {
  if (typeof SnakeGame === 'undefined') {
    window.SnakeGame = {};
  }

  var Game = (window.SnakeGame.Game = function (xDim, yDim, ctx, audioCtx) {
    this.X_DIM = xDim;
    this.Y_DIM = yDim;
    this.ctx = ctx;
    this.audioCtx = audioCtx;
    this.speed = 0;
    this.radius = 2;
    this.showSliders = false;
    this.score = 0;
    this.snakeColor = Game.SNAKE_COLORS[0]; /* default: neon green */
    this.audio = new window.SnakeGame.AudioEngine();
  });

  /* ── Key & UI bindings ── */
  Game.prototype.bindKeyHandlers = function () {
    var self = this;

    /* Remove all previous handlers to avoid duplicates */
    $('#controls').off('click', '#start');
    $('#controls').off('click', '#next-level');
    $('#controls').off('click', '#start-menu');
    $('#controls').off('change', '#use-timer');
    $('#controls').off('click', '#speed-slider');
    $('#controls').off('click', '#size-slider');
    $('#controls').off('click', '.color-swatch');
    $(document).off('click', '.mute-btn');
    $(document).off('keyup');

    $('#controls').on('click', '#start', function (e) {
      e.preventDefault();
      self.startLevel();
    });

    $('#controls').on('click', '#next-level', function (e) {
      e.preventDefault();
      self.startLevel();
    });

    $('#controls').on('click', '#start-menu', function (e) {
      e.preventDefault();
      self.stop();
      $('#controls').empty();
      self.ctx.clearRect(0, 0, self.X_DIM, self.Y_DIM);
      self.showIntro();
    });

    $('#controls').on('change', '#use-timer', function () {
      $('#timer-minutes').prop('disabled', !$(this).is(':checked'));
    });

    $('#controls').on('click', '#speed-slider', function (e) {
      e.preventDefault();

      var setting = self.getSliderSetting(e);
      var current = self.speed;

      $('#speed-slider .slider-toggle')
        .removeClass('size-' + current)
        .addClass('size-' + setting);

      self.speed = setting;
    });

    $('#controls').on('click', '#size-slider', function (e) {
      e.preventDefault();
      var setting = self.getSliderSetting(e);
      var current = self.radius;
      $('#size-slider .slider-toggle')
        .removeClass('size-' + current)
        .addClass('size-' + setting);
      self.radius = setting;
    });

    $(document).on('click', '.mute-btn', function () {
      self.audio.toggleMute();
    });

    $('#controls').on('click', '.color-swatch', function () {
      var picked = $(this).data('color');
      self.snakeColor = picked;
      $('.color-swatch').removeClass('active');
      $(this).addClass('active');
    });

    $(document).on('keyup', function (e) {
      e.preventDefault();
      if (e.keyCode === 13) {
        $('#start').click();
        $('#next-level').click();
      }
    });
  };

  Game.prototype.getSliderSetting = function (e) {
    var sliderElement = $(e.currentTarget);
    var sliderRect = sliderElement[0].getBoundingClientRect();
    var clickX = e.clientX - sliderRect.left;
    var relativePosition = clickX / sliderRect.width;

    if (relativePosition < 0.125) return 0;
    if (relativePosition < 0.375) return 1;
    if (relativePosition < 0.625) return 2;
    if (relativePosition < 0.875) return 3;
    return 4;
  };

  /* ── Screens ── */
  Game.prototype.showIntro = function () {
    this.speed = 0;
    this.radius = 2;

    $('#status-bar').empty();
    $('#controls').empty();

    /* Mute button persists in status-bar during menu */
    $('#status-bar').html(
      '<button class="mute-btn' +
        (this.audio.muted ? ' muted' : '') +
        '" title="' +
        (this.audio.muted ? 'Ativar som' : 'Desativar som') +
        '"></button>'
    );

    var html = [
      '<h1>Snake</h1>',

      /* Size slider */
      '<div class="slider" id="size-slider">',
      '<span>size</span>',
      '<div class="slider-label">',
      '<span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>',
      '</div>',
      '<div class="slider-toggle size-2"></div>',
      '</div>',

      /* Speed slider */
      '<div class="slider" id="speed-slider">',
      '<span>speed</span>',
      '<div class="slider-label">',
      '<span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>',
      '</div>',
      '<div class="slider-toggle size-0"></div>',
      '</div>',

      /* Snake color picker */
      '<div class="color-picker">',
      '<span class="color-picker-label">snake color</span>',
      '<div class="color-swatches">',
      Game.SNAKE_COLORS.map(function (c, i) {
        return (
          '<button class="color-swatch' +
          (i === 0 ? ' active' : '') +
          '" ' +
          'data-color="' +
          c +
          '" ' +
          'style="background:' +
          c +
          '" ' +
          'title="' +
          c +
          '"></button>'
        );
      }).join(''),
      '</div>',
      '</div>',

      /* Timer settings */
      '<div class="timer-settings">',
      '<label><input type="checkbox" id="use-timer"> Use timer</label>',
      '<label>Duration (min):',
      '<input type="number" id="timer-minutes"',
      ' min="1" max="' + Game.MAX_TIMER_MINUTES + '"',
      ' value="' + Game.DEFAULT_TIMER_MINUTES + '" disabled>',
      '</label>',
      '</div>',

      '<br>',
      '<button id="start">▶ &nbsp;Start</button>',
      '<br><br>',
      '<span class="kb-hint">Press <code>enter</code> or click Start</span>',
    ].join('');

    $('#controls').append(html);
    $('#bg-selector').show();
    this.audio.playMenu();
  };

  Game.prototype.run = function () {
    this.bindKeyHandlers();
    this.showIntro();
  };

  /* ── Level lifecycle ── */
  Game.prototype.startLevel = function () {
    var timerEnabled = $('#use-timer').is(':checked');
    var timerMinutes = parseInt($('#timer-minutes').val(), 10);

    if (timerEnabled && !isNaN(timerMinutes)) {
      timerMinutes = Math.min(
        Math.max(timerMinutes, Game.MIN_TIMER_MINUTES),
        Game.MAX_TIMER_MINUTES
      );
    } else {
      timerMinutes = null;
    }

    $('#controls').empty();
    $('#status-bar').empty();
    this.score = 0;
    $('#bg-selector').hide();
    this.audio.playGame();

    var level = new window.SnakeGame.Level(Game.RADII[this.radius], this);
    this.currentLevel = level;
    level.startTime = Date.now();
    this.levelStartTime = level.startTime;
    level.timeLimit = timerMinutes !== null ? timerMinutes * 60 : null;

    var timerLabel =
      level.timeLimit !== null ? 'Time: 00:00 / ' + this.formatTime(level.timeLimit) : '';

    $('#status-bar').html(
      'Apples&nbsp;<span id="level">0</span>' +
        (timerLabel ? ' <span id="timer">' + timerLabel + '</span>' : '') +
        '<button class="mute-btn' +
        (this.audio.muted ? ' muted' : '') +
        '" title="' +
        (this.audio.muted ? 'Ativar som' : 'Desativar som') +
        '"></button>'
    );

    var self = this;
    level.draw(this.ctx);

    this.interval = setInterval(function () {
      /* Timer tick */
      if (level.timeLimit !== null) {
        var elapsed = Math.floor((Date.now() - level.startTime) / 1000);
        var remaining = level.timeLimit - elapsed;

        /* Colour the timer red in the last 10 seconds */
        var timerEl = document.getElementById('timer');
        if (timerEl) {
          timerEl.innerHTML =
            'Time: ' + self.formatTime(elapsed) + ' / ' + self.formatTime(level.timeLimit);
          timerEl.style.color = remaining <= 10 ? '#ff4545' : '';
        }

        if (elapsed >= level.timeLimit) {
          self.endLevel('lost');
          return;
        }
      }

      var step = level.step();
      if (step === 'lost') {
        self.endLevel('lost');
      } else if (step === 'won') {
        self.endLevel('won');
      } else {
        level.draw(self.ctx);
      }
    }, Game.SPEEDS[this.speed]);
  };

  /* Call from Level when a fruit is eaten */
  Game.prototype.incrementScore = function () {
    this.score += 1;
    this.audio.eatSound();
    var $lvl = $('#level');
    $lvl.text(this.score);

    /* Brief pulse for tactile feedback */
    $lvl.addClass('score-pulse');
    setTimeout(function () {
      $lvl.removeClass('score-pulse');
    }, 220);
  };

  Game.prototype.stop = function () {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  /* ── Refatoração 4: Consolidate Duplicate Conditional Fragments ──
   * win() e lose() compartilhavam a mesma estrutura de HTML.
   * Extraído para _showEndScreen() para eliminar duplicação. */
  Game.prototype._showEndScreen = function (title, titleClass, btnLabel) {
    var html = [
      '<h2 class="' + titleClass + '">' + title + '</h2>',
      '<h3>Score: ' + this.score + '</h3>',
      '<button id="start">▶ &nbsp;' + btnLabel + '</button>',
      '<button id="start-menu">← &nbsp;Menu</button>',
    ].join('<br>');
    $('#controls').append(html);
  };

  Game.prototype.win = function () {
    this.audio.stop();
    this._showEndScreen('You Won!', 'win', 'Play Again');
  };

  Game.prototype.lose = function () {
    this.audio.stop();
    this.audio.deathSound();
    this._showEndScreen('Game Over', 'lose', 'Try Again');
  };

  Game.prototype.formatTime = function (seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return (
      (minutes < 10 ? '0' : '') +
      minutes +
      ':' +
      (remainingSeconds < 10 ? '0' : '') +
      remainingSeconds
    );
  };

  Game.prototype.endLevel = function (ending) {
    this.stop();
    this.ctx.clearRect(0, 0, this.X_DIM, this.Y_DIM);
    if (ending === 'esc') {
      this.showIntro();
      return;
    }

    try {
      var apples = this.currentLevel ? this.currentLevel.numApples : this.score;
      var seconds =
        this.currentLevel && this.currentLevel.startTime
          ? Math.floor((Date.now() - this.currentLevel.startTime) / 1000)
          : 0;

      SnakeGame.Scores.save(apples, seconds, ending === 'won' ? 'won' : 'lost');
    } catch (e) {}

    if (ending === 'won') {
      this.win();
    } else {
      this.lose();
    }
  };

  /* ── Constants ── */
  Game.RADII = [5, 8, 10, 12, 15];
  Game.SPEEDS = [400, 325, 250, 175, 100];

  Game.MIN_TIMER_MINUTES = 1; /* menor duração permitida do timer */
  Game.MAX_TIMER_MINUTES = 5;
  Game.DEFAULT_TIMER_MINUTES = 2;

  /* Available snake colors — main hue passed to snake.js draw */
  Game.SNAKE_COLORS = [
    '#39ff14' /* neon green  (default) */,
    '#00cfff' /* electric cyan         */,
    '#ff4545' /* hot red               */,
    '#e8ff00' /* acid yellow           */,
    '#bf5fff' /* neon purple           */,
    '#ff8c00' /* deep orange           */,
  ];
})();
