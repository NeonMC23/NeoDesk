/* ═══════════════════════════════════════════
   NeoDesk v4 — Distract Terminal
   Full-screen mini programs: Glitch, Matrix, Lava, Conway
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── Open Distract Terminal ───
  NeoDesk.prototype._openDistract = function() {
    this._distractActive = true;
    this._distractAnimId = null;
    this._distractRunning = false;
    var el = document.getElementById('distract-terminal');
    el.classList.add('active');
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    this._dprint('<span class="hl2">NeoDesk Distract Terminal</span>');
    this._dprint('Commands: glitch, matrix, lava, conway, exit');
    document.getElementById('distract-input').focus();
  };

  // ─── Print to Distract Output ───
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

  // ─── Close Distract Terminal ───
  NeoDesk.prototype._closeDistract = function() {
    this._distractActive = false;
    if (this._distractAnimId) {
      clearTimeout(this._distractAnimId);
      this._distractAnimId = null;
    }
    this._distractRunning = false;
    document.getElementById('distract-terminal').classList.remove('active');
    if (this._conwayCleanup) {
      this._conwayCleanup();
      this._conwayCleanup = null;
    }
  };

  // ─── Execute Distract Command ───
  NeoDesk.prototype._distractExec = function(input) {
    var trimmed = input.trim().toLowerCase();
    if (!trimmed) return;
    this._dprint('> ' + trimmed, 'input');
    if (trimmed === 'exit') { this._closeDistract(); }
    else if (trimmed === 'glitch') { this._launchGlitch(); }
    else if (trimmed === 'matrix') { this._launchMatrix(); }
    else if (trimmed === 'lava') { this._launchLava(); }
    else if (trimmed === 'conway') { this._launchConway(); }
    else { this._dprint('Unknown: ' + trimmed + '. Try: glitch, matrix, lava, conway, exit', 'error'); }
  };

  // ═══════════════════════════════════════════
  //  1. TERMINAL GLITCH
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchGlitch = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
    var L = 30, C = 60;
    var grid = [];
    for (var i = 0; i < L; i++) {
      var row = '';
      for (var j = 0; j < C; j++) row += chars[Math.floor(Math.random() * chars.length)];
      grid.push(row);
    }
    var self = this;
    var anim = function() {
      if (!self._distractRunning) return;
      var html = '';
      for (var i = 0; i < L; i++) {
        var row = '';
        for (var j = 0; j < C; j++) {
          var r = Math.random();
          if (r < 0.05) row += '<span style="color:' + (Math.random() > 0.5 ? '#f85149' : '#d29922') + '">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
          else if (r < 0.08) row += '<span style="opacity:0">' + grid[i][j] + '</span>';
          else if (r < 0.11) row += '<span style="color:#fff;opacity:' + (0.5 + Math.random() * 0.5) + '">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
          else row += '<span style="opacity:' + (0.3 + Math.random() * 0.7) + '">' + grid[i][j] + '</span>';
        }
        if (Math.random() < 0.02) html += '<div style="transform:translateX(' + (Math.floor(Math.random() * 5) - 2) + 'px)">' + row + '</div>';
        else html += '<div>' + row + '</div>';
      }
      out.innerHTML = html;
      self._distractAnimId = setTimeout(anim, 80 + Math.random() * 40);
    };
    anim();
    this._dprint('[Glitch running. Type "exit" to stop.]');
  };

  // ═══════════════════════════════════════════
  //  2. MATRIX RAIN
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchMatrix = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var cols = 70, rows = 35;
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.floor(Math.random() * -rows);
    var self = this;
    var anim = function() {
      if (!self._distractRunning) return;
      var html = '';
      for (var r = 0; r < rows; r++) {
        var row = '';
        for (var c = 0; c < cols; c++) {
          var dp = drops[c], dist = r - dp;
          if (dist >= 0 && dist < 12) {
            if (dist === 0) row += '<span style="color:#fff;font-weight:600">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
            else if (dist < 3) row += '<span style="color:#3fb950;opacity:' + (0.9 - dist * 0.2) + '">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
            else { var op = 0.5 - (dist - 3) * 0.05; if (op > 0) row += '<span style="color:#2ea043;opacity:' + op + '">' + chars[Math.floor(Math.random() * chars.length)] + '</span>'; else row += '&nbsp;'; }
          } else row += '&nbsp;';
        }
        html += '<div style="line-height:1.2">' + row + '</div>';
      }
      out.innerHTML = html;
      for (var i = 0; i < cols; i++) { if (drops[i] >= rows) drops[i] = Math.floor(Math.random() * -8); else drops[i] += 0.5 + Math.random() * 1.5; }
      self._distractAnimId = setTimeout(anim, 90);
    };
    anim();
    this._dprint('[Matrix running. Type "exit" to stop.]');
  };

  // ═══════════════════════════════════════════
  //  3. LAVA BUBBLE
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchLava = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    var cols = 70, rows = 32;
    var bubbles = [];
    for (var i = 0; i < 10; i++) bubbles.push({ x: Math.random() * cols, y: rows + Math.random() * 5, r: 1.5 + Math.random() * 3, sp: 0.2 + Math.random() * 0.4, w: Math.random() * 6.28, ws: 0.02 + Math.random() * 0.03 });
    var colors = ['#ff6b35', '#f7931e', '#ffc107', '#ff4444'];
    var self = this;
    var anim = function() {
      if (!self._distractRunning) return;
      for (var b = 0; b < bubbles.length; b++) {
        bubbles[b].y -= bubbles[b].sp;
        bubbles[b].w += bubbles[b].ws;
        bubbles[b].x += Math.sin(bubbles[b].w) * 0.3;
        if (bubbles[b].x < bubbles[b].r) bubbles[b].x = bubbles[b].r;
        if (bubbles[b].x > cols - bubbles[b].r) bubbles[b].x = cols - bubbles[b].r;
      }
      bubbles = bubbles.filter(function(b) { return b.y + b.r > 0; });
      if (bubbles.length < 14 && Math.random() < 0.15) bubbles.push({ x: Math.random() * cols, y: rows + Math.random() * 3, r: 1.5 + Math.random() * 3, sp: 0.2 + Math.random() * 0.4, w: Math.random() * 6.28, ws: 0.02 + Math.random() * 0.03 });
      var grid = []; for (var r = 0; r < rows; r++) { grid[r] = []; for (var c = 0; c < cols; c++) grid[r][c] = ' '; }
      for (var b = 0; b < bubbles.length; b++) {
        var cx = Math.round(bubbles[b].x), cy = Math.round(bubbles[b].y), r = Math.round(bubbles[b].r);
        for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
          var d = Math.sqrt(dx*dx + dy*dy);
          if (d <= r) { var row = cy + dy, col = cx + dx; if (row >= 0 && row < rows && col >= 0 && col < cols) { var int = 1 - d / r; grid[row][col] = int > 0.7 ? '@' : int > 0.4 ? '#' : int > 0.2 ? '*' : '.'; } }
        }
      }
      var html = ''; for (var r = 0; r < rows; r++) { var row = ''; for (var c = 0; c < cols; c++) { var ch = grid[r][c]; row += ch !== ' ' ? '<span style="color:' + colors[Math.floor(Math.random() * colors.length)] + '">' + ch + '</span>' : '&nbsp;'; } html += '<div style="line-height:1.2">' + row + '</div>'; }
      out.innerHTML = html;
      self._distractAnimId = setTimeout(anim, 110);
    };
    anim();
    this._dprint('[Lava Bubble running. Type "exit" to stop.]');
  };

  // ═══════════════════════════════════════════
  //  4. CONWAY'S GAME OF LIFE
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchConway = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    var COLS = 50, ROWS = 28;
    var grid = [], running = false, interval = null;
    var self = this;

    var rand = function() {
      grid = [];
      for (var r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (var c = 0; c < COLS; c++) grid[r][c] = Math.random() > 0.7 ? 1 : 0;
      }
    };

    var neigh = function(r, c) {
      var n = 0;
      for (var dr = -1; dr <= 1; dr++)
        for (var dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          n += grid[(r + dr + ROWS) % ROWS][(c + dc + COLS) % COLS];
        }
      return n;
    };

    var next = function() {
      var ng = [];
      for (var r = 0; r < ROWS; r++) {
        ng[r] = [];
        for (var c = 0; c < COLS; c++) {
          var n = neigh(r, c);
          ng[r][c] = grid[r][c] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
        }
      }
      grid = ng;
    };

    rand();

    var render = function() {
      var html = '<pre style="background:#000;color:var(--green);font-size:16px;line-height:1.1;margin:10px auto;text-align:center">';
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) html += grid[r][c] ? '<span style="color:#3fb950">&#9632;</span>' : '<span style="color:#1a1a2e;opacity:0.3">&#9632;</span>';
        html += '\n';
      }
      html += '</pre><div class="conway-controls"><span id="conway-toggle">' + (running ? '|| Pause' : '> Start') + '</span><span id="conway-reset">* Reset</span><span id="conway-step">>| Step</span></div>';
      out.innerHTML = html;

      var t = document.getElementById('conway-toggle');
      var rs = document.getElementById('conway-reset');
      var st = document.getElementById('conway-step');

      if (t) t.onclick = function(e) {
        e.stopPropagation();
        running = !running;
        if (running) {
          t.innerHTML = '|| Pause';
          if (interval) clearInterval(interval);
          interval = setInterval(function() { next(); render(); }, 200);
        } else {
          t.innerHTML = '> Start';
          if (interval) clearInterval(interval);
        }
      };
      if (rs) rs.onclick = function(e) {
        e.stopPropagation();
        running = false;
        if (interval) clearInterval(interval);
        rand(); render();
      };
      if (st) st.onclick = function(e) {
        e.stopPropagation();
        next(); render();
      };
    };

    render();
    this._conwayCleanup = function() { running = false; if (interval) clearInterval(interval); };
  };

})();
