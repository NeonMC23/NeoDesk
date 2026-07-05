/* ═══════════════════════════════════════════
   NeoDesk V4 — Distract Terminal
   Full-screen mini programs: Matrix, Conway
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  NeoDesk.prototype._stopDistract = function() {
    this._distractRunning = false;
    if (this._distractAnimId) { clearTimeout(this._distractAnimId); this._distractAnimId = null; }
    if (this._conwayCleanup) { this._conwayCleanup(); this._conwayCleanup = null; }
  };

  NeoDesk.prototype._openDistract = function() {
    this._distractActive = true;
    this._distractAnimId = null;
    this._distractRunning = false;
    var el = document.getElementById('distract-terminal');
    el.classList.add('active');
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    this._dprint('<span class="hl2">NeoDesk Distract Terminal</span>');
    this._dprint('Commands: matrix, conway, exit');
    document.getElementById('distract-input').focus();
  };

  NeoDesk.prototype._dprint = function(text, type) {
    if (!type) type = '';
    var out = document.getElementById('distract-output');
    if (!out) return;
    var line = document.createElement('div');
    line.className = 'terminal-line ' + type;
    line.innerHTML = text;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  };

  NeoDesk.prototype._closeDistract = function() {
    this._stopDistract();
    this._distractActive = false;
    document.getElementById('distract-terminal').classList.remove('active');
  };

  NeoDesk.prototype._distractExec = function(input) {
    var trimmed = input.trim().toLowerCase();
    if (!trimmed) return;
    this._dprint('> ' + trimmed, 'input');
    this._stopDistract();
    var self = this;
    setTimeout(function() {
      if (trimmed === 'exit') { self._closeDistract(); }
      else if (trimmed === 'matrix') { self._launchMatrix(); }
      else if (trimmed === 'conway') { self._launchConway(); }
      else { self._dprint('Unknown. Try: matrix, conway, exit', 'error'); }
    }, 50);
  };

  /* ========== 1. MATRIX — Full-screen, kanji, optimized ========== */
  NeoDesk.prototype._launchMatrix = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;';
    out.style.fontSize = '14px';
    out.style.lineHeight = '1.3';

    var cols = Math.floor(window.innerWidth / 13);
    var rows = Math.floor(window.innerHeight / 19);
    if (cols < 30) cols = 30;
    if (rows < 15) rows = 15;

    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ0123456789天地玄黄宇宙洪荒日月盈昃辰宿列張寒来暑往秋收冬蔵';

    var drops = [], speeds = [];
    for (var i = 0; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * -rows * 2);
      speeds[i] = 0.4 + Math.random() * 1.8;
    }

    var self = this;
    var anim = function() {
      if (!self._distractRunning) return;
      var html = '';

      for (var r = 0; r < rows; r++) {
        var row = '';
        for (var c = 0; c < cols; c++) {
          var dp = drops[c], dist = r - dp;
          if (dist >= 0 && dist < 18) {
            var ch = chars[Math.floor(Math.random() * chars.length)];
            if (dist === 0) {
              row += '<span style="color:#fff;font-weight:600">' + ch + '</span>';
            } else if (dist < 3) {
              row += '<span style="color:#7ee787">' + ch + '</span>';
            } else if (dist < 8) {
              row += '<span style="color:#3fb950;opacity:' + (0.7 - (dist - 3) * 0.1) + '">' + ch + '</span>';
            } else {
              var op = Math.max(0.05, 0.3 - (dist - 8) * 0.035);
              row += '<span style="color:#2ea043;opacity:' + op + '">' + ch + '</span>';
            }
          } else {
            row += '&nbsp;';
          }
        }
        html += '<div style="line-height:1.3;margin:0">' + row + '</div>';
      }

      out.innerHTML = html;

      for (var i = 0; i < cols; i++) {
        drops[i] += speeds[i];
        if (drops[i] >= rows + 3) {
          drops[i] = Math.floor(Math.random() * -8);
          speeds[i] = 0.4 + Math.random() * 1.8;
        }
      }

      self._distractAnimId = setTimeout(anim, 90);
    };
    anim();
    this._dprint('[Matrix running. Kanji rain. Type "exit" to stop.]');
  };

  /* ========== 2. CONWAY — Full-screen with color control ========== */
  NeoDesk.prototype._launchConway = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;';

    var canvas = document.createElement('canvas');
    canvas.id = 'conway-canvas';
    out.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var CONTROL_H = 50;
    var cellSize = 8;
    var COLS = Math.floor((window.innerWidth - 20) / cellSize);
    var ROWS = Math.floor((window.innerHeight - CONTROL_H - 20) / cellSize);
    canvas.width = COLS * cellSize;
    canvas.height = ROWS * cellSize;

    var grid = [], running = false, interval = null, speed = 150;
    var cellColor = '#3fb950';
    var self = this;

    function randomize() {
      grid = [];
      for (var r = 0; r < ROWS; r++) { grid[r] = []; for (var c = 0; c < COLS; c++) grid[r][c] = Math.random() > 0.7 ? 1 : 0; }
    }
    var neigh = function(r, c) {
      var n = 0;
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        n += grid[(r + dr + ROWS) % ROWS][(c + dc + COLS) % COLS];
      }
      return n;
    };
    var nextGen = function() {
      var ng = [];
      for (var r = 0; r < ROWS; r++) { ng[r] = []; for (var c = 0; c < COLS; c++) { var n = neigh(r, c); ng[r][c] = grid[r][c] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0); } }
      grid = ng;
    };
    var render = function() {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
        if (grid[r][c]) { ctx.fillStyle = cellColor; ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0, cellSize - 0); }
      }
    };

    var startSim = function() {
      if (interval) clearInterval(interval);
      interval = setInterval(function() { if (running) { nextGen(); render(); } }, speed);
    };

    randomize();
    render();

    var controlsHtml =
      '<div class="conway-controls" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:10px;align-items:center;z-index:10;font-family:monospace;font-size:14px;color:#3fb950;background:rgba(0,0,0,0.8);padding:6px 14px;border-radius:8px;border:1px solid rgba(63,185,80,0.2);white-space:nowrap;">'
      + '<span id="conway-toggle" style="cursor:pointer;text-decoration:underline;opacity:0.8">> Start</span>'
      + '<span style="opacity:0.2">|</span>'
      + '<span id="conway-step" style="cursor:pointer;text-decoration:underline;opacity:0.6">Step</span>'
      + '<span style="opacity:0.2">|</span>'
      + '<span id="conway-reset" style="cursor:pointer;text-decoration:underline;opacity:0.6">Reset</span>'
      + '<span style="opacity:0.2">|</span>'
      + '<span id="conway-slower" style="cursor:pointer;opacity:0.6">&#9664; Slow</span>'
      + '<span id="conway-speed-display" style="opacity:0.8;min-width:44px;text-align:center">' + speed + 'ms</span>'
      + '<span id="conway-faster" style="cursor:pointer;opacity:0.6">Fast &#9654;</span>'
      + '<span style="opacity:0.2">|</span>'
      + '<span id="conway-color-prev" style="cursor:pointer;opacity:0.6">&#9664; Color</span>'
      + '<span id="conway-color-display" style="opacity:0.8;min-width:60px;text-align:center;font-size:12px">Green</span>'
      + '<span id="conway-color-next" style="cursor:pointer;opacity:0.6">Color &#9654;</span>'
      + '</div>';

    var cd = document.createElement('div'); cd.innerHTML = controlsHtml; out.appendChild(cd);

    var colors = [
      { name: 'Green', color: '#3fb950' },
      { name: 'Blue', color: '#58a6ff' },
      { name: 'Coral', color: '#f78166' },
      { name: 'Purple', color: '#a371f7' },
      { name: 'Gold', color: '#d29922' },
      { name: 'Pink', color: '#ff6b9d' },
      { name: 'Teal', color: '#56d4dd' },
      { name: 'Red', color: '#ff4444' },
      { name: 'White', color: '#f0f6fc' },
      { name: 'Orange', color: '#ffa657' },
    ];
    var colorIdx = 0;

    setTimeout(function() {
      var t = document.getElementById('conway-toggle'),
          rs = document.getElementById('conway-reset'),
          st = document.getElementById('conway-step'),
          sl = document.getElementById('conway-slower'),
          fa = document.getElementById('conway-faster'),
          sp = document.getElementById('conway-speed-display'),
          cp = document.getElementById('conway-color-prev'),
          cn = document.getElementById('conway-color-next'),
          cd = document.getElementById('conway-color-display');

      if (t) t.onclick = function(e) {
        e.stopPropagation();
        running = !running;
        t.textContent = running ? '|| Pause' : '> Start';
        if (running) startSim(); else if (interval) clearInterval(interval);
      };
      if (rs) rs.onclick = function(e) { e.stopPropagation(); running = false; if (interval) clearInterval(interval); if (t) t.textContent = '> Start'; randomize(); render(); };
      if (st) st.onclick = function(e) { e.stopPropagation(); if (!running) { nextGen(); render(); } };
      if (sl) sl.onclick = function(e) {
        e.stopPropagation(); speed = Math.min(1000, speed + 50);
        if (sp) sp.textContent = speed + 'ms'; if (running) startSim();
      };
      if (fa) fa.onclick = function(e) {
        e.stopPropagation(); speed = Math.max(20, speed - 50);
        if (sp) sp.textContent = speed + 'ms'; if (running) startSim();
      };
      if (cp) cp.onclick = function(e) {
        e.stopPropagation(); colorIdx = (colorIdx - 1 + colors.length) % colors.length;
        cellColor = colors[colorIdx].color;
        if (cd) cd.textContent = colors[colorIdx].name;
        render();
      };
      if (cn) cn.onclick = function(e) {
        e.stopPropagation(); colorIdx = (colorIdx + 1) % colors.length;
        cellColor = colors[colorIdx].color;
        if (cd) cd.textContent = colors[colorIdx].name;
        render();
      };
    }, 50);

    this._conwayCleanup = function() { running = false; if (interval) clearInterval(interval); };
    this._dprint('[Conway Game of Life. Controls: speed + color.]');
  };

})();
