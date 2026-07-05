/* ═══════════════════════════════════════════
   NeoDesk V4 — Distract Terminal
   Full-screen mini programs: Glitch, Matrix, Conway
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  function getCols() { return Math.floor((window.innerWidth - 20) / 10); }
  function getRows() { return Math.floor((window.innerHeight - 80) / 18); }

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
    this._dprint('Commands: glitch, matrix, conway, exit');
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
      else if (trimmed === 'glitch') { self._launchGlitch(); }
      else if (trimmed === 'matrix') { self._launchMatrix(); }
      else if (trimmed === 'conway') { self._launchConway(); }
      else { self._dprint('Unknown. Try: glitch, matrix, conway, exit', 'error'); }
    }, 50);
  };

  /* ========== 1. GLITCH ========== */
  NeoDesk.prototype._launchGlitch = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;';
    out.style.fontSize = '12px';
    out.style.lineHeight = '1.2';
    var cols = getCols(), rows = getRows();
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
    var palette = ['#3fb950','#58a6ff','#f78166','#d29922','#a371f7','#ff6b9d','#56d4dd','#f0f6fc','#ff4444','#79c0ff','#7ee787','#ffa657'];
    var grid = [];
    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < cols; j++) {
        row.push({ char: chars[Math.floor(Math.random() * chars.length)], color: palette[Math.floor(Math.random() * palette.length)], opacity: 0.3 + Math.random() * 0.7 });
      }
      grid.push(row);
    }
    var self = this;
    var anim = function() {
      if (!self._distractRunning) return;
      var html = '';
      for (var i = 0; i < rows; i++) {
        var rowHtml = '';
        for (var j = 0; j < cols; j++) {
          var cell = grid[i][j];
          var r = Math.random();
          if (r < 0.03) {
            cell.char = chars[Math.floor(Math.random() * chars.length)];
            cell.color = palette[Math.floor(Math.random() * palette.length)];
            cell.opacity = 0.5 + Math.random() * 0.5;
            rowHtml += '<span style="color:' + cell.color + ';opacity:' + cell.opacity + '">' + cell.char + '</span>';
          } else if (r < 0.06) {
            rowHtml += '<span style="color:#fff;opacity:' + (0.7 + Math.random() * 0.3) + ';font-weight:600">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
          } else if (r < 0.09) {
            rowHtml += '<span style="color:' + palette[Math.floor(Math.random() * palette.length)] + ';opacity:0.9">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
          } else if (r < 0.11) {
            rowHtml += '<span style="opacity:0">' + cell.char + '</span>';
          } else {
            cell.opacity = Math.max(0.2, Math.min(1, cell.opacity + (Math.random() - 0.5) * 0.2));
            rowHtml += '<span style="color:' + cell.color + ';opacity:' + cell.opacity + '">' + cell.char + '</span>';
          }
        }
        if (Math.random() < 0.015) {
          var shift = Math.floor(Math.random() * 7) - 3;
          html += '<div style="transform:translateX(' + shift + 'px);margin:0">' + rowHtml + '</div>';
        } else {
          html += '<div style="margin:0">' + rowHtml + '</div>';
        }
      }
      if (Math.random() < 0.005) {
        html = '<div style="background:' + palette[Math.floor(Math.random() * palette.length)] + ';opacity:0.15;position:absolute;inset:0"></div>' + html;
      }
      out.innerHTML = html;
      self._distractAnimId = setTimeout(anim, 80 + Math.random() * 30);
    };
    anim();
    this._dprint('[Glitch running. Type "exit" to stop.]');
  };

  /* ========== 2. MATRIX (optimized, less dense) ========== */
  NeoDesk.prototype._launchMatrix = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;';
    out.style.fontSize = '14px';
    out.style.lineHeight = '1.3';
    var cols = Math.floor(window.innerWidth / 14);
    var rows = Math.floor((window.innerHeight - 60) / 20);
    if (cols < 30) cols = 30;
    if (rows < 15) rows = 15;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var drops = [], speeds = [];
    for (var i = 0; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * -rows * 2);
      speeds[i] = 0.3 + Math.random() * 1.5;
    }
    var self = this;
    var anim = function() {
      if (!self._distractRunning) return;
      var html = '';
      for (var r = 0; r < rows; r++) {
        var row = '';
        for (var c = 0; c < cols; c++) {
          var dp = drops[c], dist = r - dp;
          if (dist >= 0 && dist < 15) {
            var ch = chars[Math.floor(Math.random() * chars.length)];
            if (dist === 0) { row += '<span style="color:#fff;font-weight:600">' + ch + '</span>'; }
            else if (dist < 3) { row += '<span style="color:#7ee787">' + ch + '</span>'; }
            else if (dist < 7) { row += '<span style="color:#3fb950;opacity:' + (0.7 - (dist - 3) * 0.12) + '">' + ch + '</span>'; }
            else { var op = Math.max(0.05, 0.3 - (dist - 7) * 0.04); row += '<span style="color:#2ea043;opacity:' + op + '">' + ch + '</span>'; }
          } else { row += '&nbsp;'; }
        }
        html += '<div style="line-height:1.3;margin:0">' + row + '</div>';
      }
      out.innerHTML = html;
      for (var i = 0; i < cols; i++) {
        drops[i] += speeds[i];
        if (drops[i] >= rows + 3) { drops[i] = Math.floor(Math.random() * -8); speeds[i] = 0.3 + Math.random() * 1.5; }
      }
      self._distractAnimId = setTimeout(anim, 100);
    };
    anim();
    this._dprint('[Matrix running. Type "exit" to stop.]');
  };

  /* ========== 3. CONWAY with speed controls ========== */
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
      var gap = 0;
      var size = cellSize;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
        if (grid[r][c]) { ctx.fillStyle = '#3fb950'; ctx.fillRect(c * cellSize, r * cellSize, size - gap, size - gap); }
      }
    };

    var startSim = function() {
      if (interval) clearInterval(interval);
      interval = setInterval(function() { if (running) { nextGen(); render(); } }, speed);
    };

    randomize();
    render();

    var controlsHtml =
      '<div class="conway-controls" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:12px;align-items:center;z-index:10;font-family:monospace;font-size:14px;color:#3fb950;background:rgba(0,0,0,0.7);padding:6px 14px;border-radius:6px;border:1px solid rgba(63,185,80,0.2);">'
      + '<span id="conway-toggle" style="cursor:pointer;text-decoration:underline;opacity:0.8">> Start</span>'
      + '<span style="opacity:0.3">|</span>'
      + '<span id="conway-step" style="cursor:pointer;text-decoration:underline;opacity:0.6">Step</span>'
      + '<span style="opacity:0.3">|</span>'
      + '<span id="conway-reset" style="cursor:pointer;text-decoration:underline;opacity:0.6">Reset</span>'
      + '<span style="opacity:0.3">|</span>'
      + '<span id="conway-slower" style="cursor:pointer;opacity:0.6">&#9664; Slower</span>'
      + '<span id="conway-speed-display" style="opacity:0.8;min-width:48px;text-align:center">' + speed + 'ms</span>'
      + '<span id="conway-faster" style="cursor:pointer;opacity:0.6">Faster &#9654;</span>'
      + '</div>';

    var cd = document.createElement('div'); cd.innerHTML = controlsHtml; out.appendChild(cd);

    setTimeout(function() {
      var t = document.getElementById('conway-toggle'),
          rs = document.getElementById('conway-reset'),
          st = document.getElementById('conway-step'),
          sl = document.getElementById('conway-slower'),
          fa = document.getElementById('conway-faster'),
          sp = document.getElementById('conway-speed-display');
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
    }, 50);

    this._conwayCleanup = function() { running = false; if (interval) clearInterval(interval); };
    this._dprint('[Conway Game of Life. Speed controls: Slower / Faster]');
  };

})();
