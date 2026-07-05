/* ═══════════════════════════════════════════
   NeoDesk V4 — Distract Terminal
   Full-screen mini programs: Glitch, Matrix, Lava, Conway
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── Screen dimension helpers ───
  function getCols() { return Math.floor((window.innerWidth - 20) / 10); }
  function getRows() { return Math.floor((window.innerHeight - 80) / 18); }

  // ─── Kill any running animation before starting a new one ───
  NeoDesk.prototype._stopDistract = function() {
    this._distractRunning = false;
    if (this._distractAnimId) {
      clearTimeout(this._distractAnimId);
      this._distractAnimId = null;
    }
    if (this._conwayCleanup) {
      this._conwayCleanup();
      this._conwayCleanup = null;
    }
  };

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
    this._stopDistract();
    this._distractActive = false;
    document.getElementById('distract-terminal').classList.remove('active');
  };

  // ─── Execute Distract Command ───
  NeoDesk.prototype._distractExec = function(input) {
    var trimmed = input.trim().toLowerCase();
    if (!trimmed) return;
    this._dprint('> ' + trimmed, 'input');

    // Stop any currently running program before starting a new one
    this._stopDistract();
    // Small delay to ensure cleanup completes
    var self = this;
    setTimeout(function() {
      if (trimmed === 'exit') { self._closeDistract(); }
      else if (trimmed === 'glitch') { self._launchGlitch(); }
      else if (trimmed === 'matrix') { self._launchMatrix(); }
      else if (trimmed === 'lava') { self._launchLava(); }
      else if (trimmed === 'conway') { self._launchConway(); }
      else { self._dprint('Unknown: ' + trimmed + '. Try: glitch, matrix, lava, conway, exit', 'error'); }
    }, 50);
  };

  // ═══════════════════════════════════════════
  //  1. TERMINAL GLITCH — Full-screen
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchGlitch = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;';
    out.style.fontSize = '12px';
    out.style.lineHeight = '1.2';

    var cols = getCols(), rows = getRows();
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/æøåñçßΩπ∑∆√∫≈≠≤≥∞';
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
    var frame = 0;
    var anim = function() {
      if (!self._distractRunning) return;
      var html = '';
      frame++;

      for (var i = 0; i < rows; i++) {
        var rowHtml = '';
        for (var j = 0; j < cols; j++) {
          var cell = grid[i][j];
          var r = Math.random();

          if (r < 0.03) {
            // Completely replace char and color
            cell.char = chars[Math.floor(Math.random() * chars.length)];
            cell.color = palette[Math.floor(Math.random() * palette.length)];
            cell.opacity = 0.5 + Math.random() * 0.5;
            rowHtml += '<span style="color:' + cell.color + ';opacity:' + cell.opacity + '">' + cell.char + '</span>';
          } else if (r < 0.06) {
            // Bright flash
            rowHtml += '<span style="color:#fff;opacity:' + (0.7 + Math.random() * 0.3) + ';font-weight:600">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
          } else if (r < 0.09) {
            // Corruption color
            rowHtml += '<span style="color:' + palette[Math.floor(Math.random() * palette.length)] + ';opacity:0.9">' + chars[Math.floor(Math.random() * chars.length)] + '</span>';
          } else if (r < 0.11) {
            // Hidden character
            rowHtml += '<span style="opacity:0">' + cell.char + '</span>';
          } else {
            // Slight opacity flicker
            cell.opacity = Math.max(0.2, Math.min(1, cell.opacity + (Math.random() - 0.5) * 0.2));
            rowHtml += '<span style="color:' + cell.color + ';opacity:' + cell.opacity + '">' + cell.char + '</span>';
          }
        }
        // Random line shift / glitch lines
        if (Math.random() < 0.015) {
          var shift = Math.floor(Math.random() * 7) - 3;
          html += '<div style="transform:translateX(' + shift + 'px);margin:0">' + rowHtml + '</div>';
        } else {
          html += '<div style="margin:0">' + rowHtml + '</div>';
        }
      }

      // Occasional full-frame glitch
      if (Math.random() < 0.005) {
        html = '<div style="background:' + palette[Math.floor(Math.random() * palette.length)] + ';opacity:0.15;position:absolute;inset:0"></div>' + html;
      }

      out.innerHTML = html;
      self._distractAnimId = setTimeout(anim, 70 + Math.random() * 30);
    };
    anim();
    this._dprint('[Glitch running. Type "exit" to stop.]');
  };

  // ═══════════════════════════════════════════
  //  2. MATRIX RAIN — Full-screen
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchMatrix = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;';
    out.style.fontSize = '12px';
    out.style.lineHeight = '1.2';

    var cols = Math.floor(window.innerWidth / 9);
    var rows = Math.floor((window.innerHeight - 60) / 16);
    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    var drops = [];
    var speeds = [];
    for (var i = 0; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * -rows * 2);
      speeds[i] = 0.5 + Math.random() * 2.5;
    }

    var self = this;
    var anim = function() {
      if (!self._distractRunning) return;
      var html = '';

      for (var r = 0; r < rows; r++) {
        var row = '';
        for (var c = 0; c < cols; c++) {
          var dp = drops[c];
          var dist = r - dp;

          if (dist >= 0 && dist < 20) {
            var ch = chars[Math.floor(Math.random() * chars.length)];
            if (dist === 0) {
              row += '<span style="color:#fff;font-weight:600">' + ch + '</span>';
            } else if (dist < 3) {
              row += '<span style="color:#7ee787;opacity:' + (1 - dist * 0.2) + '">' + ch + '</span>';
            } else if (dist < 8) {
              row += '<span style="color:#3fb950;opacity:' + (0.8 - (dist - 3) * 0.1) + '">' + ch + '</span>';
            } else {
              var op = Math.max(0.05, 0.4 - (dist - 8) * 0.03);
              row += '<span style="color:#2ea043;opacity:' + op + '">' + ch + '</span>';
            }
          } else {
            row += '<span style="opacity:0">&#x200B;</span>';
          }
        }
        html += '<div style="line-height:1.2;margin:0">' + row + '</div>';
      }

      out.innerHTML = html;

      for (var i = 0; i < cols; i++) {
        drops[i] += speeds[i];
        if (drops[i] >= rows + 5) {
          drops[i] = Math.floor(Math.random() * -10);
          speeds[i] = 0.5 + Math.random() * 2.5;
        }
      }

      self._distractAnimId = setTimeout(anim, 80);
    };
    anim();
    this._dprint('[Matrix running. Type "exit" to stop.]');
  };

  // ═══════════════════════════════════════════
  //  3. LAVA BUBBLE — Full-screen fluid
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchLava = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;';

    // Use a canvas for smooth lava rendering
    var canvas = document.createElement('canvas');
    canvas.id = 'lava-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    out.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    // Resize handler
    var resize = function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Bubble physics
    var bubbles = [];
    var maxBubbles = 25;

    function createBubble() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20 + Math.random() * 40,
        radius: 15 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.3 + Math.random() * 0.8),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseAmp: 0.03 + Math.random() * 0.05,
        hue: 5 + Math.random() * 25,          // red-orange range
        sat: 80 + Math.random() * 20,
        light: 40 + Math.random() * 30,
      };
    }

    for (var i = 0; i < 12; i++) bubbles.push(createBubble());

    var self = this;
    var anim = function() {
      if (!self._distractRunning) {
        window.removeEventListener('resize', resize);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update bubbles
      for (var b = 0; b < bubbles.length; b++) {
        var bubble = bubbles[b];
        bubble.y += bubble.vy;
        bubble.x += bubble.vx + Math.sin(bubble.phase) * 0.2;
        bubble.phase += bubble.pulseSpeed;

        // Slight wobble
        bubble.vy += (Math.random() - 0.5) * 0.02;
        bubble.vy = Math.max(-1.2, Math.min(-0.1, bubble.vy));

        // Horizontal bounds with smooth bounce
        if (bubble.x < bubble.radius) { bubble.x = bubble.radius; bubble.vx *= -0.5; }
        if (bubble.x > canvas.width - bubble.radius) { bubble.x = canvas.width - bubble.radius; bubble.vx *= -0.5; }

        // Pulse radius
        var pulseR = bubble.radius * (1 + Math.sin(bubble.phase) * bubble.pulseAmp);
        var r = Math.max(5, pulseR);

        // Draw glow
        var grad = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, r * 2);
        grad.addColorStop(0, 'hsla(' + bubble.hue + ',' + bubble.sat + '%,' + (bubble.light + 20) + '%,0.9)');
        grad.addColorStop(0.3, 'hsla(' + (bubble.hue + 5) + ',' + bubble.sat + '%,' + bubble.light + '%,0.7)');
        grad.addColorStop(0.6, 'hsla(' + (bubble.hue + 10) + ',' + (bubble.sat - 10) + '%,' + (bubble.light - 10) + '%,0.4)');
        grad.addColorStop(0.85, 'hsla(' + (bubble.hue + 15) + ',' + (bubble.sat - 20) + '%,' + (bubble.light - 20) + '%,0.15)');
        grad.addColorStop(1, 'hsla(' + (bubble.hue + 20) + ',' + (bubble.sat - 30) + '%,' + (bubble.light - 30) + '%,0)');

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Draw core
        var coreGrad = ctx.createRadialGradient(bubble.x - r * 0.2, bubble.y - r * 0.2, 0, bubble.x, bubble.y, r);
        coreGrad.addColorStop(0, 'hsla(' + (bubble.hue - 5) + ',100%,' + (bubble.light + 30) + '%,1)');
        coreGrad.addColorStop(0.4, 'hsla(' + bubble.hue + ',100%,' + (bubble.light + 10) + '%,0.9)');
        coreGrad.addColorStop(0.7, 'hsla(' + (bubble.hue + 5) + ',90%,' + bubble.light + '%,0.6)');
        coreGrad.addColorStop(1, 'hsla(' + (bubble.hue + 10) + ',80%,' + (bubble.light - 15) + '%,0)');

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, r, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Subtle highlight
        ctx.beginPath();
        ctx.arc(bubble.x - r * 0.25, bubble.y - r * 0.25, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(0,0%,100%,0.15)';
        ctx.fill();
      }

      // Remove bubbles that went off top
      bubbles = bubbles.filter(function(b) { return b.y + b.radius * 2 > -20; });

      // Add new bubbles at bottom
      if (bubbles.length < maxBubbles && Math.random() < 0.08) {
        bubbles.push(createBubble());
      }

      self._distractAnimId = setTimeout(anim, 30); // ~33fps for smooth fluid
    };
    anim();
    this._dprint('[Lava Bubble running. Type "exit" to stop.]');
  };

  // ═══════════════════════════════════════════
  //  4. CONWAY'S GAME OF LIFE — Full-screen square cells
  // ═══════════════════════════════════════════
  NeoDesk.prototype._launchConway = function() {
    this._distractRunning = true;
    var out = document.getElementById('distract-output');
    out.innerHTML = '';
    out.style.cssText = 'overflow:hidden;background:#000;text-align:center;';

    // Use a canvas for proper square cells
    var canvas = document.createElement('canvas');
    canvas.id = 'conway-canvas';
    canvas.style.cssText = 'display:block;margin:0 auto;background:#000;';
    out.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    // Calculate cell size to fit screen with perfect squares
    var padding = 10;
    var maxW = window.innerWidth - padding * 2;
    var maxH = window.innerHeight - 100; // room for controls

    // Determine cell size so grid is as large as possible with square cells
    var cellSize = 8; // minimum
    var COLS = Math.floor(maxW / cellSize);
    var ROWS = Math.floor(maxH / cellSize);

    // Adjust to make them fit evenly
    canvas.width = COLS * cellSize;
    canvas.height = ROWS * cellSize;

    var grid = [];
    var running = false;
    var interval = null;
    var self = this;
    var editing = false;

    function randomize() {
      grid = [];
      for (var r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (var c = 0; c < COLS; c++) {
          grid[r][c] = Math.random() > 0.7 ? 1 : 0;
        }
      }
    }

    function countNeighbors(r, c) {
      var n = 0;
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          n += grid[(r + dr + ROWS) % ROWS][(c + dc + COLS) % COLS];
        }
      }
      return n;
    }

    function nextGen() {
      var ng = [];
      for (var r = 0; r < ROWS; r++) {
        ng[r] = [];
        for (var c = 0; c < COLS; c++) {
          var n = countNeighbors(r, c);
          ng[r][c] = grid[r][c] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
        }
      }
      grid = ng;
    }

    function render() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cells as perfect squares with 1px gap
      var gap = 1;
      var size = cellSize - gap;

      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          if (grid[r][c]) {
            // Alive cell - use accent color with slight variation based on neighbors
            var n = countNeighbors(r, c);
            var brightness = 120 + n * 25;
            ctx.fillStyle = 'hsl(140,70%,' + Math.min(70, brightness / 5) + '%)';
            ctx.fillRect(c * cellSize + gap/2, r * cellSize + gap/2, size, size);
          }
          // Dead cells are just black (no fill needed)
        }
      }

      // Draw grid lines (faint)
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (var r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellSize);
        ctx.lineTo(canvas.width, r * cellSize);
        ctx.stroke();
      }
      for (var c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellSize, 0);
        ctx.lineTo(c * cellSize, canvas.height);
        ctx.stroke();
      }

      // Update controls
      var toggleEl = document.getElementById('conway-toggle');
      if (toggleEl) toggleEl.textContent = running ? '|| Pause' : '> Start';
    }

    // Controls HTML
    var controlsHtml = '<div class="conway-controls" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:16px;z-index:10;font-family:var(--font-mono);font-size:13px;color:var(--green);">'
      + '<span id="conway-toggle" style="cursor:pointer;text-decoration:underline;text-underline-offset:3px;opacity:0.7;transition:opacity 0.15s">> Start</span>'
      + '<span id="conway-reset" style="cursor:pointer;text-decoration:underline;text-underline-offset:3px;opacity:0.7;transition:opacity 0.15s">* Reset</span>'
      + '<span id="conway-step" style="cursor:pointer;text-decoration:underline;text-underline-offset:3px;opacity:0.7;transition:opacity 0.15s">>| Step</span>'
      + '<span id="conway-edit" style="cursor:pointer;text-decoration:underline;text-underline-offset:3px;opacity:0.7;transition:opacity 0.15s">[ ] Edit</span>'
      + '</div>';

    // Append controls to output
    var controlsDiv = document.createElement('div');
    controlsDiv.innerHTML = controlsHtml;
    out.appendChild(controlsDiv);

    // Handle canvas click for editing
    canvas.addEventListener('click', function(e) {
      if (!editing && !running) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var col = Math.floor(x / cellSize);
        var row = Math.floor(y / cellSize);
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
          grid[row][col] = grid[row][col] ? 0 : 1;
          render();
        }
      }
    });

    // Canvas mouse move for drawing
    canvas.addEventListener('mousemove', function(e) {
      if (editing && !running) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var col = Math.floor(x / cellSize);
        var row = Math.floor(y / cellSize);
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
          grid[row][col] = 1;
          render();
        }
      }
    });

    randomize();
    render();

    // Attach control events
    setTimeout(function() {
      var toggleEl = document.getElementById('conway-toggle');
      var resetEl = document.getElementById('conway-reset');
      var stepEl = document.getElementById('conway-step');
      var editEl = document.getElementById('conway-edit');

      if (toggleEl) toggleEl.onclick = function(e) {
        e.stopPropagation();
        editing = false;
        running = !running;
        if (editEl) editEl.textContent = '[ ] Edit';
        if (running) {
          if (interval) clearInterval(interval);
          interval = setInterval(function() { nextGen(); render(); }, 150);
        } else {
          if (interval) clearInterval(interval);
        }
        render();
      };

      if (resetEl) resetEl.onclick = function(e) {
        e.stopPropagation();
        running = false;
        editing = false;
        if (interval) clearInterval(interval);
        if (editEl) editEl.textContent = '[ ] Edit';
        randomize();
        render();
      };

      if (stepEl) stepEl.onclick = function(e) {
        e.stopPropagation();
        if (!running) { nextGen(); render(); }
      };

      if (editEl) editEl.onclick = function(e) {
        e.stopPropagation();
        if (!running) {
          editing = !editing;
          editEl.textContent = editing ? '[X] Edit' : '[ ] Edit';
        }
      };
    }, 50);

    this._conwayCleanup = function() {
      running = false;
      editing = false;
      if (interval) clearInterval(interval);
    };

    this._dprint('[Conway\'s Game of Life. Click cells to toggle, use Edit mode to draw.]');
  };

})();
