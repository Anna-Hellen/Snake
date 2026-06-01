(function () {
  if (typeof SnakeGame === 'undefined') {
    window.SnakeGame = {};
  }

  /*
   * SnakeGame.AudioEngine
   * Gera música chiptune 8-bit via Web Audio API — sem arquivos externos.
   *
   * Uso:ápido)
   *   audio.stop();          // para tudo
   *   var audio = new SnakeGame.AudioEngine();
   *   audio.playMenu();      // loop do menu
   *   audio.playGame();      // loop do jogo (mais r
   *   audio.eatSound();      // efeito ao comer maçã
   *   audio.deathSound();    // efeito de morte
   */

  var AudioEngine = (window.SnakeGame.AudioEngine = function () {
    /* Web Audio API — criado com interação do usuário para evitar autoplay block */
    this.ctx = null;
    this.masterGain = null;
    this.sequence = null; /* setInterval da sequência atual */
    this.step = 0;
    this.currentTrack = null;
    this.muted = false;
    this.VOLUME = 0.18; /* volume padrão */
  });

  /* ── Inicializa o contexto (chamar após gesto do usuário) ── */
  AudioEngine.prototype._init = function () {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : this.VOLUME;
    this.masterGain.connect(this.ctx.destination);
  };

  /* ── Liga/desliga o som — retorna o novo estado ── */
  AudioEngine.prototype.toggleMute = function () {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.muted ? 0 : this.VOLUME,
        this.ctx.currentTime,
        0.05 /* fade suave de 50ms */
      );
    }
    /* Atualiza todos os botões de mute na página */
    $('.mute-btn').toggleClass('muted', this.muted);
    $('.mute-btn').attr('title', this.muted ? 'Ativar som' : 'Desativar som');
    return this.muted;
  };

  /* ── Toca uma nota quadrada (square wave) ── */
  AudioEngine.prototype._note = function (freq, duration, when, gainVal) {
    if (!this.ctx) return;
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(gainVal || 0.3, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + duration * 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(when);
    osc.stop(when + duration);
  };

  /* ── Toca um ruído de percussão (noise burst) ── */
  AudioEngine.prototype._drum = function (when, duration) {
    if (!this.ctx) return;
    var bufSize = this.ctx.sampleRate * duration;
    var buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    var src = this.ctx.createBufferSource();
    var gain = this.ctx.createGain();
    src.buffer = buffer;
    gain.gain.setValueAtTime(0.4, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + duration);
    src.connect(gain);
    gain.connect(this.masterGain);
    src.start(when);
  };

  /* ── Para a sequência atual ── */
  AudioEngine.prototype.stop = function () {
    if (this.sequence) {
      clearInterval(this.sequence);
      this.sequence = null;
    }
    this.step = 0;
    this.currentTrack = null;
  };

  /* ── Refatoração 2: Extract Method ──────────────────────────
   * playMenu() e playGame() tinham estrutura idêntica de loop.
   * Extraído para _playLoop(trackName, melody, bass, options)
   * para eliminar duplicação de código. */
  AudioEngine.prototype._playLoop = function (trackName, melody, bass, options) {
    this._init();
    if (this.currentTrack === trackName) return;
    this.stop();
    this.currentTrack = trackName;

    var stepMs = (60 / options.bpm) * 500;
    var self = this;
    var totalSteps = melody.length;

    this.sequence = setInterval(function () {
      var now = self.ctx.currentTime;
      var i = self.step % totalSteps;

      if (melody[i])
        self._note(melody[i], (stepMs / 1000) * options.melodyDur, now, options.melodyGain);
      if (bass[i]) self._note(bass[i], (stepMs / 1000) * options.bassDur, now, options.bassGain);

      options.drum(self, now, i);

      self.step++;
    }, stepMs);
  };

  /* ────────────────────────────────────────────
   * TRILHA DO MENU — arpejo suave e melódico
   * ──────────────────────────────────────────── */
  AudioEngine.prototype.playMenu = function () {
    this._playLoop(
      'menu',
      /* melody — Escala de Dó maior */
      [262, 330, 392, 440, 392, 330, 262, 220, 294, 370, 440, 494, 440, 370, 294, 220],
      /* bass — C3 G3 A3 G3 */
      [131, 0, 196, 0, 220, 0, 196, 0, 147, 0, 185, 0, 220, 0, 185, 0],
      {
        bpm: 112,
        melodyDur: 0.7,
        melodyGain: 0.22,
        bassDur: 0.9,
        bassGain: 0.12,
        drum: function (engine, now, i) {
          if (i % 4 === 0) engine._drum(now, 0.06);
        },
      }
    );
  };

  /* ────────────────────────────────────────────
   * TRILHA DO JOGO — mais urgente e rítmica
   * ──────────────────────────────────────────── */
  AudioEngine.prototype.playGame = function () {
    this._playLoop(
      'game',
      /* melody — Riff em lá menor pentatônica */
      [220, 262, 294, 349, 330, 294, 262, 220, 247, 294, 330, 392, 370, 330, 294, 247],
      /* bass */
      [110, 0, 165, 0, 138, 0, 165, 0, 123, 0, 185, 0, 138, 0, 185, 0],
      {
        bpm: 148,
        melodyDur: 0.6,
        melodyGain: 0.2,
        bassDur: 0.85,
        bassGain: 0.1,
        drum: function (engine, now, i) {
          if (i % 4 === 0) engine._drum(now, 0.05);
          if (i % 4 === 2) engine._drum(now, 0.02);
        },
      }
    );
  };

  /* ────────────────────────────────────────────
   * EFEITOS SONOROS
   * ──────────────────────────────────────────── */

  /* Efeito ao comer maçã — glissando ascendente */
  AudioEngine.prototype.eatSound = function () {
    this._init();
    var now = this.ctx.currentTime;
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  };

  /* Efeito de morte — glissando descendente */
  AudioEngine.prototype.deathSound = function () {
    this._init();
    var now = this.ctx.currentTime;

    /* Três tons descendentes */
    var freqs = [440, 330, 220];
    var duration = 0.18;
    for (var i = 0; i < freqs.length; i++) {
      this._note(freqs[i], duration, now + i * (duration * 0.8), 0.3);
    }
  };
})();
