/* ═══════════════════════════════════════════
   NeoDesk v4 — Main Application
   ═══════════════════════════════════════════ */

'use strict';

class NeoDesk {
  constructor() {
    this.settings = this._makeAutoSave(this.loadSettings());
    this.favorites = this.loadFavorites();
    this.terminalActive = false;
    this.editingFavIndex = null;
    this.weatherEditOpen = false;
    this.engineOpen = false;
    this.isRecordingShortcut = false;

    // Search engine configs with SVG icons
    this.engines = {
      google: {
        url: 'https://www.google.com/search?q=',
        modes: {
          default: '',
          img: '&tbm=isch',
          video: '&tbm=vid',
          news: '&tbm=nws',
          maps: ''
        },
        modeUrl: (q, mode) => {
          if (mode === 'maps') return `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
          return `https://www.google.com/search?q=${encodeURIComponent(q)}${mode === 'default' ? '' : mode}`;
        }
      },
      duckduckgo: {
        url: 'https://duckduckgo.com/?q=',
        modes: {
          default: '',
          img: '&iax=images&ia=images',
          video: '&iax=videos&ia=videos',
          news: '&iar=news',
          maps: ''
        },
        modeUrl: (q, mode) => {
          if (mode === 'maps') return `https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=maps&ia=maps`;
          return `https://duckduckgo.com/?q=${encodeURIComponent(q)}${mode === 'default' ? '' : mode}`;
        }
      },
      bing: {
        url: 'https://www.bing.com/search?q=',
        modes: {
          default: '',
          img: '&qft=+filterui:photo-photo',
          video: '&qft=+filterui:video-video',
          news: '&qft=+filterui:news-news',
          maps: ''
        },
        modeUrl: (q, mode) => {
          if (mode === 'maps') return `https://www.bing.com/maps?q=${encodeURIComponent(q)}`;
          return `https://www.bing.com/search?q=${encodeURIComponent(q)}${mode === 'default' ? '' : mode}`;
        }
      },
      brave: {
        url: 'https://search.brave.com/search?q=',
        modes: {
          default: '',
          img: '&source=images',
          video: '&source=videos',
          news: '&source=news',
          maps: ''
        },
        modeUrl: (q, mode) => {
          if (mode === 'maps') return `https://search.brave.com/maps?q=${encodeURIComponent(q)}`;
          return `https://search.brave.com/search?q=${encodeURIComponent(q)}${mode === 'default' ? '' : '&source=' + mode}`;
        }
      },
      yahoo: {
        url: 'https://search.yahoo.com/search?p=',
        modes: {
          default: '',
          img: '',
          video: '',
          news: '',
          maps: ''
        },
        modeUrl: (q, mode) => {
          return `https://search.yahoo.com/search?p=${encodeURIComponent(q)}`;
        }
      },
      startpage: {
        url: 'https://www.startpage.com/do/dsearch?query=',
        modes: {
          default: '',
          img: '',
          video: '',
          news: '',
          maps: ''
        },
        modeUrl: (q, mode) => {
          return 'https://www.startpage.com/do/dsearch?query=' + encodeURIComponent(q);
        }
      }
    };

    // Terminal commands
    this.terminalCommands = {
      '/help':   () => this.terminalHelp(),
      '/clear':  () => this.terminalClear(),
      '/g':      (q) => this.searchQuery('google', q, 'default'),
      '/yt':     (q) => { window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/img':    (q) => this.searchQuery(this.settings.searchEngine, q, 'img'),
      '/map':    (q) => this.searchQuery(this.settings.searchEngine, q, 'maps'),
      '/wiki':   (q) => { window.open(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/ddg':    (q) => { window.open(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/reddit': (q) => { window.open(`https://www.reddit.com/search/?q=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/gh':     (q) => { window.open(`https://github.com/search?q=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/s':      (q) => this.searchQuery(this.settings.searchEngine, q, 'default'),
      '/time':   () => this.terminalPrint(`Current time: ${new Date().toLocaleTimeString()}`, 'info'),
      '/date':   () => this.terminalPrint(`Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 'info'),
      '/weather':(q) => { if (q) { this.setWeatherCity(q); this.terminalPrint(`Weather set to: ${q}`, 'success'); } else { this.terminalPrint('Usage: /weather <city>', 'info'); } return true; },
      '/theme':  (q) => { if (['dark','light','system'].includes(q)) { this.setTheme(q); this.terminalPrint(`Theme: ${q}`, 'success'); } else { this.terminalPrint('Usage: /theme <dark|light|system>', 'info'); } return true; },
      '/todo':   () => { window.open('https://todoist.com', '_blank'); return true; },
      '/distract':() => { this._openDistract(); return true; }
    };

    this.init();
  }

  /* ─── Init ─── */

  /* ─── Auto-save Proxy ─── */
  _makeAutoSave(obj) {
    var saveTimer = null;
    var self = this;
    return new Proxy(obj, {
      set: function(target, key, value) {
        target[key] = value;
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function() {
          try {
            // Stocker bgImage séparément pour éviter les problèmes de quota
            if (key === 'bgImage') {
              var toSave = {};
              for (var k in target) {
                if (k !== 'bgImage') toSave[k] = target[k];
              }
              localStorage.setItem('neodesk_settings', JSON.stringify(toSave));
              localStorage.setItem('neodesk_bgimage', value || '');
            } else {
              // Si on change un preset, on garde aussi bgImage qui était déjà stocké
              var bgImg = localStorage.getItem('neodesk_bgimage');
              var toSave = {};
              for (var k in target) {
                if (k !== 'bgImage') toSave[k] = target[k];
              }
              localStorage.setItem('neodesk_settings', JSON.stringify(toSave));
            }
          } catch(e) {}
        }, 50);
        return true;
      },
      deleteProperty: function(target, key) {
        delete target[key];
        if (key === 'bgImage') {
          try { localStorage.removeItem('neodesk_bgimage'); } catch(e) {}
        }
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function() {
          try {
            var toSave = {};
            for (var k in target) {
              if (k !== 'bgImage') toSave[k] = target[k];
            }
            localStorage.setItem('neodesk_settings', JSON.stringify(toSave));
          } catch(e) {}
        }, 50);
        return true;
      }
    });
  }

  init() {
    this.cacheDOM();
    this.updateShortcutTip();
    this.applySettings();
    this.renderFavorites();
    this.startClock();
    this.updateGreeting();
    this.fetchWeather();
    this.fetchQuote();
    this.bindEvents();
  }

  /* ─── Cache DOM ─── */
  cacheDOM() {
    this.els = {
      weatherInfo:     document.getElementById('weather-info'),
      weatherIcon:     document.getElementById('weather-icon'),
      weatherTemp:     document.getElementById('weather-temp'),
      weatherCity:     document.getElementById('weather-city'),
      weatherEdit:     document.getElementById('weather-edit'),
      weatherInput:    document.getElementById('weather-input'),
      weatherSave:     document.getElementById('weather-save'),
      liveTime:        document.getElementById('live-time'),
      liveDate:        document.getElementById('live-date'),
      greetingText:    document.getElementById('greeting-text'),
      greetingName:    document.getElementById('greeting-name'),
      clockTime:       document.getElementById('clock-time'),
      clockSeconds:    document.getElementById('clock-seconds'),
      quoteText:       document.getElementById('quote-text'),
      quoteAuthor:     document.getElementById('quote-author'),
      searchInput:     document.getElementById('search-input'),
      searchBtn:       document.getElementById('search-btn'),
      engineBtn:       document.getElementById('engine-btn'),
      engineSvg:       document.getElementById('engine-svg'),
      engineDropdown:  document.getElementById('engine-dropdown'),
      favGrid:         document.getElementById('fav-grid'),
      favAddBtn:       document.getElementById('fav-add-btn'),
      favMenuBtn:      document.getElementById('fav-menu-btn'),
      favMenuDrop:     document.getElementById('fav-menu-dropdown'),
      favEditor:       document.getElementById('fav-editor'),
      favName:         document.getElementById('fav-name'),
      favUrl:          document.getElementById('fav-url'),
      favColor:        document.getElementById('fav-color'),
      favSave:         document.getElementById('fav-save'),
      favCancel:       document.getElementById('fav-cancel'),
      favDelete:       document.getElementById('fav-delete'),
      terminal:        document.getElementById('terminal'),
      terminalOutput:  document.getElementById('terminal-output'),
      terminalInput:   document.getElementById('terminal-input'),
      terminalClose:   document.getElementById('terminal-close'),
      terminalLaunch:  document.getElementById('terminal-launch'),
      settingsPanel:   document.getElementById('settings-panel'),
      settingsOverlay: document.getElementById('settings-overlay'),
      settingsOpen:    document.getElementById('settings-open'),
      settingsClose:   document.getElementById('settings-close'),
      userName:        document.getElementById('user-name'),
      engineLabel:     document.getElementById('engine-select-label'),
      engineDDrop:     document.getElementById('engine-select-dropdown'),
      engineTrigger:   document.getElementById('engine-select-trigger'),
      tempC:           document.getElementById('temp-c'),
      tempF:           document.getElementById('temp-f'),
      clock24h:        document.getElementById('clock-24h'),
      clock12h:        document.getElementById('clock-12h'),
      bgUpload:        document.getElementById('bg-upload'),
      bgUrl:           document.getElementById('bg-url'),
      bgApplyUrl:      document.getElementById('bg-apply-url'),
      bgBlur:          document.getElementById('bg-blur'),
      bgBlurValue:     document.getElementById('bg-blur-value'),
      showWeather:     document.getElementById('show-weather'),
      showDate:        document.getElementById('show-date'),
      showFavorites:   document.getElementById('show-favorites'),
      showQuote:       document.getElementById('show-quote'),
      resetSettings:   document.getElementById('reset-settings'),
      shortcutDisplay: document.getElementById('shortcut-display'),
      shortcutReset:   document.getElementById('shortcut-reset'),
      shortcutTip:     document.getElementById('shortcut-tip'),
      showTips:        document.getElementById('show-tips'),
      searchSug:       document.getElementById('search-suggestions'),
      accentPicker:    document.getElementById('accent-picker'),
      accentHex:       document.getElementById('accent-hex'),
      clockPicker:     document.getElementById('clock-picker'),
      clockHex:        document.getElementById('clock-hex'),
      gradientStart:   document.getElementById('gradient-start'),
      gradientEnd:     document.getElementById('gradient-end'),
      gradientStartHex: document.getElementById('gradient-start-hex'),
      gradientEndHex:  document.getElementById('gradient-end-hex'),
      gradientApply:   document.getElementById('gradient-apply'),
      toastContainer:  document.getElementById('toast-container'),
    };

    this.themeBtns = document.querySelectorAll('.theme-btn');
    this.bgPresets = document.querySelectorAll('.bg-preset');
    this.engineOpts = document.querySelectorAll('.engine-opt');
    this.searchChips = document.querySelectorAll('.search-chip');
    this.fontBtns = document.querySelectorAll('.font-btn');
    this.fontToggle = document.getElementById('font-toggle-btn');
    this.fontAdvanced = document.getElementById('font-advanced');
    this.accentPresets = document.querySelectorAll('#accent-presets .color-preset');
    this.clockPresets = document.querySelectorAll('#clock-presets .color-preset');
    this.customOpts = document.querySelectorAll('.custom-select-opt');
  }

  /* ─── Settings ─── */
  loadSettings() {
    try {
      const saved = localStorage.getItem('neodesk_settings');
      var s = saved ? { ...this.defaultSettings(), ...JSON.parse(saved) } : { ...this.defaultSettings() };
      // Restaurer l'image de fond depuis sa clé dédiée
      try {
        var bg = localStorage.getItem('neodesk_bgimage');
        if (bg) s.bgImage = bg;
      } catch(e) {}
      return s;
    } catch (e) { /* ignore */ }
    return this.defaultSettings();
  }

  defaultSettings() {
    return {
      theme: 'dark',
      searchEngine: 'google',
      tempUnit: 'celsius',
      clock24h: true,
      userName: '',
      background: 'default',
      bgBlur: 0,
      bgImage: '',
      showWeather: true,
      showDate: true,
      showFavorites: true,
      showQuote: true,
      showTips: true,
      accentColor: '#2ea043',
      clockColor: 'gradient',
      gradientStart: '#f0f6fc',
      gradientEnd: '#2ea043',
      fontFamily: "'Inter', sans-serif",
      weatherCity: 'Paris',
      shortcutKey: 't',
      shortcutMod: 'alt'
    };
  }

  saveSettings() {
    try { localStorage.setItem('neodesk_settings', JSON.stringify(this.settings)); } catch (e) {}
  }

  loadFavorites() {
    try { return JSON.parse(localStorage.getItem('neodesk_favorites')) || []; } catch (e) { return []; }
  }

  saveFavorites() {
    try { localStorage.setItem('neodesk_favorites', JSON.stringify(this.favorites)); } catch (e) {}
  }

  /* ─── Apply All ─── */
  applySettings() {
    this.applyTheme();
    this.applyBackground();
    this.applyWidgets();
    this.updateSettingsUI();
    this.updateName();
    this._applyAccent();
    this._applyFont();
    this._applyClockColor();
    this.updateEngineSvg();
    this.updateShortcutUI();
    this._updateEngineIcon();
  }

  /* ─── Theme ─── */
  applyTheme() {
    const theme = this.settings.theme;
    document.body.classList.remove('dark', 'light');
    if (theme === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(dark ? 'dark' : 'light');
    } else {
      document.body.classList.add(theme);
    }
    this.themeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  }

  setTheme(theme) {
    this.settings.theme = theme;
    this.applyTheme();
    this.saveSettings();
  }

  /* ─── Background ─── */
  applyBackground() {
    const bg = this.settings.background;
    const body = document.body;
    body.style.background = '';
    body.style.backgroundImage = '';
    body.classList.remove('has-bg');

    if (bg === 'none' || bg === 'default') {
      this.updateBgPresetUI(bg);
      return;
    }

    const gradients = {
      wave:    'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      sunset:  'linear-gradient(135deg, #f12711, #f5af19)',
      ocean:   'linear-gradient(135deg, #00b4db, #0083b0)',
      forest:  'linear-gradient(135deg, #134e5e, #71b280)',
      cherry:  'linear-gradient(135deg, #e35d6a, #c7475b)',
      midnight:'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    };

    if (gradients[bg]) {
      body.style.background = gradients[bg];
      body.classList.add('has-bg');
      this.updateBgPresetUI(bg);
      return;
    }

    if (this.settings.bgImage) {
      body.style.backgroundImage = `url('${this.settings.bgImage}')`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundAttachment = 'fixed';
      body.classList.add('has-bg');
    }
    this.updateBgPresetUI(bg);
  }

  updateBgPresetUI(active) {
    this.bgPresets.forEach(p => p.classList.toggle('active', p.dataset.bg === active));
  }

  /* ─── Blur ─── */
  applyBlur() {
    const blur = this.settings.bgBlur || 0;
    document.documentElement.style.setProperty('--blur-amount', `${blur}px`);
    this.els.bgBlur.value = blur;
    this.els.bgBlurValue.textContent = `${blur}px`;
  }

  /* ─── Widgets ─── */
  applyWidgets() {
    const s = this.settings;
    document.getElementById('weather-widget').style.display = s.showWeather ? '' : 'none';
    this.els.liveDate.style.display = s.showDate ? '' : 'none';
    document.querySelector('.quote').style.display = s.showQuote ? '' : 'none';
    document.getElementById('favorites-section').style.display = s.showFavorites ? '' : 'none';
    this.els.showWeather.checked = s.showWeather;
    this.els.showDate.checked = s.showDate;
    this.els.showFavorites.checked = s.showFavorites;
    this.els.showQuote.checked = s.showQuote;
    if (this.els.showTips) {
      document.querySelector('.search-tips').style.display = s.showTips ? '' : 'none';
      this.els.showTips.checked = s.showTips;
    }
  }

  /* ─── Settings UI ─── */
  updateSettingsUI() {
    this.els.userName.value = this.settings.userName || '';
    if (this.els.engineLabel) this.els.engineLabel.textContent = this.settings.searchEngine.charAt(0).toUpperCase() + this.settings.searchEngine.slice(1);
    this.els.bgUrl.value = '';
    this.els.tempC.classList.toggle('active', this.settings.tempUnit === 'celsius');
    this.els.tempF.classList.toggle('active', this.settings.tempUnit !== 'celsius');
    this.els.clock24h.classList.toggle('active', this.settings.clock24h);
    this.els.clock12h.classList.toggle('active', !this.settings.clock24h);
    this.applyBlur();
  }

  updateName() {
    const name = this.settings.userName?.trim();
    this.els.greetingName.textContent = name ? `, ${name}` : '';
  }

  /* ─── Engine SVG ─── */
  
  /* ─── Accent Color ─── */
  _applyAccent() {
    const c = this.settings.accentColor || '#2ea043';
    const r = parseInt(c.slice(1,3), 16), g = parseInt(c.slice(3,5), 16), b = parseInt(c.slice(5,7), 16);
    document.documentElement.style.setProperty('--accent', c);
    document.documentElement.style.setProperty('--accent-hover', this._lighten(c, 15));
    document.documentElement.style.setProperty('--accent-rgb', `${r},${g},${b}`);
    if (this.accentPresets) this.accentPresets.forEach(p => p.classList.toggle('active', p.dataset.color === c));
    if (this.els.accentPicker) { this.els.accentPicker.value = c; this.els.accentHex.textContent = c; }
  }

  _lighten(hex, amt) {
    let r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
    r = Math.min(255, r+amt); g = Math.min(255, g+amt); b = Math.min(255, b+amt);
    return '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
  }

  _applyFont() {
    const f = this.settings.fontFamily || "'Inter', sans-serif";
    document.documentElement.style.setProperty('--font', f);
    if (this.fontBtns) this.fontBtns.forEach(b => b.classList.toggle('active', b.dataset.font === f));
  }

  _applyClockColor() {
    const c = this.settings.clockColor;
    const ct = this.els.clockTime;
    if (!c || c === 'gradient') {
      ct.classList.remove('solid'); ct.classList.add('gradient');
      const gs = this.settings.gradientStart || '#f0f6fc';
      const ge = this.settings.gradientEnd || '#2ea043';
      document.documentElement.style.setProperty('--clock-color-start', gs);
      document.documentElement.style.setProperty('--clock-color-end', ge);
      if (this.els.clockHex) this.els.clockHex.textContent = 'Gradient';
      if (this.els.gradientStart) this.els.gradientStart.value = gs;
      if (this.els.gradientEnd) this.els.gradientEnd.value = ge;
      if (this.els.gradientStartHex) this.els.gradientStartHex.textContent = gs;
      if (this.els.gradientEndHex) this.els.gradientEndHex.textContent = ge;
    } else {
      ct.classList.remove('gradient'); ct.classList.add('solid');
      document.documentElement.style.setProperty('--clock-solid', c);
      if (this.els.clockHex) this.els.clockHex.textContent = c;
    }
    if (this.clockPresets) this.clockPresets.forEach(p => p.classList.toggle('active', p.dataset.color === c));
  }

  /* ─── Search Suggestions ─── */
  _suggestionsList = [
    {label:'Google', url:'https://google.com'},
    {label:'YouTube', url:'https://youtube.com'},
    {label:'GitHub', url:'https://github.com'},
    {label:'Reddit', url:'https://reddit.com'},
    {label:'Wikipedia', url:'https://wikipedia.org'},
    {label:'Stack Overflow', url:'https://stackoverflow.com'},
    {label:'Amazon', url:'https://amazon.com'},
  ];

  _showSuggestions() {
    const q = this.els.searchInput.value.trim().toLowerCase();
    const sug = this.els.searchSug;
    if (!q || document.activeElement !== this.els.searchInput) { sug.classList.add('hidden'); return; }
    const matches = this._suggestionsList.filter(s => s.label.toLowerCase().includes(q)).slice(0, 5);
    if (!matches.length) { sug.classList.add('hidden'); return; }
    sug.innerHTML = matches.map(s =>
      '<div class="search-suggestion-item" data-url="' + s.url + '">' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<span>' + s.label + '</span></div>'
    ).join('');
    sug.classList.remove('hidden');
  }

  
  /* ─── Engine icons ─── */
    _engineSvgs = {
    google: '<img class="engine-icon" src="icon/google.png" alt="Google" width="18" height="18">',
    duckduckgo: '<img class="engine-icon" src="icon/duckduckgo.png" alt="DuckDuckGo" width="18" height="18">',
    bing: '<img class="engine-icon" src="icon/bing.png" alt="Bing" width="18" height="18">',
    brave: '<img class="engine-icon" src="icon/brave.png" alt="Brave" width="18" height="18">',
    yahoo: '<img class="engine-icon" src="icon/yahoo.png" alt="Yahoo" width="18" height="18">',
    startpage: '<img class="engine-icon" src="icon/startpage.png" alt="Startpage" width="18" height="18">',
  };

  _updateEngineIcon() {
    const eng = this.settings.searchEngine;
    const wrap = document.getElementById('engine-icon-wrap');
    if (wrap && this._engineSvgs[eng]) {
      wrap.innerHTML = this._engineSvgs[eng];
    }
  }

  updateEngineSvg() {
    this._updateEngineIcon();
  }

  updateShortcutUI() {
    const mod = this.settings.shortcutMod || 'alt';
    const key = (this.settings.shortcutKey || 't').toUpperCase();
    const modLabel = mod.charAt(0).toUpperCase() + mod.slice(1);
    const display = this.els.shortcutDisplay;
    display.innerHTML = `<span class="mod-key">${modLabel}</span><span class="plus">+</span><span class="char-key">${key}</span>`;
    this.updateShortcutTip();
  }

  updateShortcutTip() {
    const mod = this.settings.shortcutMod || 'alt';
    const key = (this.settings.shortcutKey || 't').toUpperCase();
    const modLabel = mod.charAt(0).toUpperCase() + mod.slice(1);
    this.els.shortcutTip.textContent = `${modLabel}+${key}`;
  }

  /* ─── Clock ─── */
  startClock() {
    const update = () => {
      const now = new Date();
      const is24h = this.settings.clock24h;
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: !is24h });
      const secStr = String(now.getSeconds()).padStart(2, '0');
      const month = now.toLocaleDateString('en-US', { month: 'short' });
      this.els.clockTime.textContent = timeStr;
      this.els.clockSeconds.textContent = secStr;
      this.els.liveTime.textContent = timeStr;
      this.els.liveDate.textContent = `${month} ${now.getDate()}, ${now.getFullYear()}`;
    };
    update();
    setInterval(update, 1000);
  }

  /* ─── Greeting ─── */
  updateGreeting() {
    const set = () => {
      const h = new Date().getHours();
      let g = 'Good evening';
      if (h < 12) g = 'Good morning';
      else if (h < 17) g = 'Good afternoon';
      this.els.greetingText.textContent = g;
    };
    set();
    setInterval(set, 60000);
  }

  /* ─── Quote ─── */
  async fetchQuote() {
    const fallback = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
      { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
      { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
      { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
      { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
      { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
      { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
      { text: "Get busy living or get busy dying.", author: "Stephen King" },
    ];

    try {
      const res = await fetch('https://api.quotable.io/random');
      if (res.ok) {
        const data = await res.json();
        this.els.quoteText.textContent = `"${data.content}"`;
        this.els.quoteAuthor.textContent = `\u2014 ${data.author}`;
        return;
      }
    } catch (e) {}

    const idx = new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0) % fallback.length;
    const q = fallback[idx];
    this.els.quoteText.textContent = `"${q.text}"`;
    this.els.quoteAuthor.textContent = `\u2014 ${q.author}`;
  }

  /* ─── Search ─── */
  searchQuery(engine, query, mode = 'default') {
    const eng = this.engines[engine] || this.engines.google;
    const url = eng.modeUrl(query, mode);
    window.open(url, '_blank');
  }

  handleSearch(mode = 'default') {
    const query = this.els.searchInput.value.trim();
    if (!query) return;
    this.searchQuery(this.settings.searchEngine, query, mode);
    this.els.searchInput.value = '';
  }

  /* ─── Weather ─── */
  async fetchWeather() {
    const city = this.settings.weatherCity || 'Paris';
    const apiKey = 'a968437efd031f23e6085207a6c4c552';
    const isCelsius = this.settings.tempUnit === 'celsius';
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`);
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      this.els.weatherCity.textContent = data.name;
      this.els.weatherTemp.textContent = `${Math.round(data.main.temp)}\u00B0${isCelsius ? 'C' : 'F'}`;
      this.els.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      this.els.weatherIcon.alt = data.weather[0].description || 'Weather';
    } catch (err) {
      this.els.weatherCity.textContent = city;
      this.els.weatherTemp.textContent = '--\u00B0';
      this.els.weatherIcon.src = '';
    }
  }

  setWeatherCity(city) {
    this.settings.weatherCity = city;
    this.saveSettings();
    this.fetchWeather();
  }

  toggleWeatherEdit(show) {
    this.weatherEditOpen = show !== undefined ? show : !this.weatherEditOpen;
    this.els.weatherEdit.classList.toggle('hidden', !this.weatherEditOpen);
    if (this.weatherEditOpen) {
      this.els.weatherInput.value = this.settings.weatherCity;
      setTimeout(() => this.els.weatherInput.focus(), 100);
    }
  }

  /* ─── Favorites ─── */
  renderFavorites() {
    this.els.favGrid.innerHTML = '';
    if (this.favorites.length === 0) {
      this.els.favGrid.innerHTML = '<div class="fav-item-empty">No links yet. Click <strong>+ Add</strong> to add your first!</div>';
      return;
    }
    this.favorites.forEach((fav, i) => {
      const item = document.createElement('a');
      item.className = 'fav-item';
      item.href = fav.url || '#';
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
      const initial = (fav.name || '?').charAt(0).toUpperCase();
      item.innerHTML = `
        <div class="fav-icon-wrapper" style="background:${fav.color || '#4CAF50'}">${initial}</div>
        <span class="fav-item-name">${fav.name || 'Link'}</span>
        <div class="fav-item-actions">
          <button class="fav-item-action edit-fav" data-index="${i}" title="Edit">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="fav-item-action del-fav" data-index="${i}" title="Delete">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;
      item.querySelector('.edit-fav').addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        this.editFavorite(i);
      });
      item.querySelector('.del-fav').addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        this.deleteFavorite(i);
      });
      this.els.favGrid.appendChild(item);
    });
  }

  openFavEditor(fav = null, index = null) {
    this.editingFavIndex = index;
    this.els.favEditor.classList.remove('hidden');
    if (fav) {
      this.els.favName.value = fav.name || '';
      this.els.favUrl.value = fav.url || '';
      this.els.favColor.value = fav.color || '#4CAF50';
      this.els.favDelete.classList.remove('hidden');
    } else {
      this.els.favName.value = '';
      this.els.favUrl.value = '';
      this.els.favColor.value = '#4CAF50';
      this.els.favDelete.classList.add('hidden');
    }
    setTimeout(() => this.els.favName.focus(), 100);
  }

  closeFavEditor() {
    this.els.favEditor.classList.add('hidden');
    this.editingFavIndex = null;
  }

  saveFavEditor() {
    const name = this.els.favName.value.trim() || 'Link';
    let url = this.els.favUrl.value.trim();
    const color = this.els.favColor.value;
    if (!url) { this.toast('Please enter a URL'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    const fav = { name, url, color };
    if (this.editingFavIndex !== null) {
      this.favorites[this.editingFavIndex] = fav;
      this.toast('Link updated');
    } else {
      this.favorites.push(fav);
      this.toast('Link added');
    }
    this.saveFavorites();
    this.renderFavorites();
    this.closeFavEditor();
  }

  editFavorite(index) { this.openFavEditor(this.favorites[index], index); }

  deleteFavorite(index) {
    if (!confirm(`Delete "${this.favorites[index]?.name || 'this link'}"?`)) return;
    this.favorites.splice(index, 1);
    this.saveFavorites();
    this.renderFavorites();
    this.closeFavEditor();
    this.toast('Link deleted');
  }

  /* ─── Terminal ─── */
  terminalOpen() {
    this.terminalActive = true;
    this.els.terminal.classList.add('active');
    setTimeout(() => this.els.terminalInput.focus(), 120);
  }

  terminalClose() {
    this.terminalActive = false;
    this.els.terminal.classList.remove('active');
  }

  terminalPrint(text, type = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.innerHTML = text;
    this.els.terminalOutput.appendChild(line);
    this.els.terminalOutput.scrollTop = this.els.terminalOutput.scrollHeight;
  }

  terminalClear() {
    this.els.terminalOutput.innerHTML = '';
    this.terminalPrint('NeoDesk Terminal v3.0 -- Type /help for commands, /distract for mini programs', 'info');
  }

  terminalHelp() {
    this.terminalClear();
    this.terminalPrint('NeoDesk Terminal Commands:', 'info');
    this.terminalPrint('');
    const cmds = [['/g &lt;query&gt;','Google Search'],['/yt &lt;query&gt;','YouTube Search'],['/img &lt;query&gt;','Image Search'],['/map &lt;query&gt;','Maps Search'],['/wiki &lt;query&gt;','Wikipedia'],['/ddg &lt;query&gt;','DuckDuckGo'],['/reddit &lt;q&gt;','Reddit Search'],['/gh &lt;query&gt;','GitHub Search'],['/s &lt;query&gt;','Default Search'],['/weather &lt;city&gt;','Set weather city'],['/theme &lt;mode&gt;','dark|light|system'],['/time','Show time'],['/date','Show date'],['/todo','Open Todoist'],['/distract','Mini programs'],['/clear','Clear terminal'],['/help','Show this help']];
    cmds.forEach(([c,d]) => { this.terminalPrint('  <span class="hl">' + c + '</span>  ' + d); });
    this.terminalPrint('');
    this.terminalPrint('  Tip: Just type anything to search!');
  }

  terminalExecute(input) {
    const trimmed = input.trim();
    if (!trimmed) return;
    this.terminalPrint(`> ${trimmed}`, 'input');
    const [cmd, ...args] = trimmed.split(' ');
    const query = args.join(' ');
    if (this.terminalCommands[cmd]) {
      this.terminalCommands[cmd](query);
    } else if (cmd.startsWith('/')) {
      this.terminalPrint(`Unknown: ${cmd}. Type /help`, 'error');
    } else {
      this.searchQuery(this.settings.searchEngine, trimmed, 'default');
      this.terminalPrint('Searching...', 'success');
    }
  }

  /* ─── Toast ─── */
  toast(message, duration = 2200) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = message;
    this.els.toastContainer.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 200); }, duration);
  }

  /* ─── Shortcut Recording ─── */
  startShortcutRecording() {
    if (this.isRecordingShortcut) return;
    this.isRecordingShortcut = true;
    this.els.shortcutDisplay.classList.add('recording');
    this.els.shortcutDisplay.innerHTML = '<span style="color:var(--accent);font-size:11px;">Press keys...</span>';

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      let mod = null;
      let key = null;

      if (e.ctrlKey || e.metaKey) {
        // Accept Ctrl/Cmd but we'll use alt by default
      }
      if (e.altKey) mod = 'alt';
      else if (e.ctrlKey) mod = 'ctrl';
      else if (e.metaKey) mod = 'meta';

      if (e.key && !['Control', 'Alt', 'Meta', 'Shift', 'Tab', 'Escape'].includes(e.key)) {
        key = e.key.toLowerCase();
      }

      if (mod && key && key.length === 1 && /^[a-z0-9]$/i.test(key)) {
        this.settings.shortcutMod = mod;
        this.settings.shortcutKey = key;
        this.saveSettings();
        this.updateShortcutUI();
        this.isRecordingShortcut = false;
        this.els.shortcutDisplay.classList.remove('recording');
        document.removeEventListener('keydown', handler);
        this.toast(`Shortcut set to ${mod.charAt(0).toUpperCase() + mod.slice(1)}+${key.toUpperCase()}`);
      } else if (e.key === 'Escape') {
        this.isRecordingShortcut = false;
        this.els.shortcutDisplay.classList.remove('recording');
        this.updateShortcutUI();
        document.removeEventListener('keydown', handler);
      }
    };

    // Small delay to avoid capturing the click key
    setTimeout(() => {
      document.addEventListener('keydown', handler);
    }, 50);
  }

  /* ─── Event Binding ─── */
  bindEvents() {
    // Theme
    this.themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTheme(btn.dataset.theme);
        this.toast(`Theme: ${btn.dataset.theme}`);
      });
    });

    // Settings
    this.els.settingsOpen.addEventListener('click', () => {
      this.els.settingsPanel.classList.add('open');
      this.els.settingsOverlay.classList.add('open');
    });
    const closeSettings = () => {
      this.els.settingsPanel.classList.remove('open');
      this.els.settingsOverlay.classList.remove('open');
    };
    this.els.settingsClose.addEventListener('click', closeSettings);
    this.els.settingsOverlay.addEventListener('click', closeSettings);

    
    
    // Font toggle (show more)
    if (this.fontToggle && this.fontAdvanced) {
      this.fontToggle.addEventListener('click', () => {
        const hidden = this.fontAdvanced.classList.toggle('hidden');
        this.fontToggle.textContent = hidden ? 'Show more fonts' : 'Show less';
      });
    }

    // Accent color presets
    if (this.accentPresets) {
      this.accentPresets.forEach(p => {
        p.addEventListener('click', () => {
          this.settings.accentColor = p.dataset.color;
          this._applyAccent(); this.saveSettings(); this.toast('Accent color updated');
        });
      });
    }
    if (this.els.accentPicker) {
      this.els.accentPicker.addEventListener('input', () => {
        this.settings.accentColor = this.els.accentPicker.value;
        this._applyAccent(); this.saveSettings();
      });
    }

    // Clock color presets
    if (this.clockPresets) {
      this.clockPresets.forEach(p => {
        p.addEventListener('click', () => {
          this.settings.clockColor = p.dataset.color;
          this._applyClockColor(); this.saveSettings();
        });
      });
    }
    
    // Gradient custom start/end
    if (this.els.gradientStart) {
      this.els.gradientStart.addEventListener('input', () => {
        this.els.gradientStartHex.textContent = this.els.gradientStart.value;
      });
    }
    if (this.els.gradientEnd) {
      this.els.gradientEnd.addEventListener('input', () => {
        this.els.gradientEndHex.textContent = this.els.gradientEnd.value;
      });
    }
    if (this.els.gradientApply) {
      this.els.gradientApply.addEventListener('click', () => {
        this.settings.clockColor = 'gradient';
        this.settings.gradientStart = this.els.gradientStart.value;
        this.settings.gradientEnd = this.els.gradientEnd.value;
        this._applyClockColor();
        this.saveSettings();
        this.toast('Clock gradient updated');
      });
    }

    if (this.els.clockPicker) {
      this.els.clockPicker.addEventListener('input', () => {
        this.settings.clockColor = this.els.clockPicker.value;
        this._applyClockColor(); this.saveSettings();
      });
    }

    // Font family
    if (this.fontBtns) {
      this.fontBtns.forEach(b => {
        b.addEventListener('click', () => {
          this.settings.fontFamily = b.dataset.font;
          this._applyFont(); this.saveSettings();
          this.toast('Font: ' + b.textContent);
        });
      });
    }

    // Username
    this.els.userName.addEventListener('input', () => {
      this.settings.userName = this.els.userName.value;
      this.updateName();
      this.saveSettings();
    });

    // Custom search engine select
    if (this.els.engineTrigger) {
      this.els.engineTrigger.addEventListener('click', (e) => { e.stopPropagation(); this.els.engineDDrop.classList.toggle('hidden'); });
      this.customOpts.forEach(o => {
        o.addEventListener('click', () => {
          const v = o.dataset.value;
          this.settings.searchEngine = v;
          this.els.engineLabel.textContent = v.charAt(0).toUpperCase() + v.slice(1);
          this.saveSettings();
          this._updateEngineIcon();
          this.els.engineDDrop.classList.add('hidden');
          this.toast('Engine: ' + v);
        });
      });
      document.addEventListener('click', () => { if (this.els.engineDDrop) this.els.engineDDrop.classList.add('hidden'); });
    }

    // Engine dropdown
    this.els.engineBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.els.engineDropdown.classList.toggle('hidden');
    });
    this.engineOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const eng = opt.dataset.engine;
        this.settings.searchEngine = eng;
        this.saveSettings();
        this._updateEngineIcon();
        this.els.engineDropdown.classList.add('hidden');
        this.toast('Engine: ' + eng);
      });
    });
    document.addEventListener('click', () => this.els.engineDropdown.classList.add('hidden'));

    // Search suggestions
    if (this.els.searchSug) {
      this.els.searchInput.addEventListener('input', () => this._showSuggestions());
      this.els.searchInput.addEventListener('focus', () => this._showSuggestions());
      this.els.searchInput.addEventListener('blur', () => setTimeout(() => { if (this.els.searchSug) this.els.searchSug.classList.add('hidden'); }, 150));
      this.els.searchSug.addEventListener('click', (e) => {
        const item = e.target.closest('.search-suggestion-item');
        if (item) { window.open(item.dataset.url, '_blank'); if (this.els.searchSug) this.els.searchSug.classList.add('hidden'); }
      });
    }

    // Search
    this.els.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSearch('default');
      if (e.key === 'Tab') {
        e.preventDefault();
        const keys = Object.keys(this.engines);
        const cur = keys.indexOf(this.settings.searchEngine);
        const nxt = (cur + 1) % keys.length;
        this.settings.searchEngine = keys[nxt];
        this.saveSettings();
        this._updateEngineIcon();
        if (this.els.engineLabel) this.els.engineLabel.textContent = keys[nxt].charAt(0).toUpperCase() + keys[nxt].slice(1);
        this.toast('Engine: ' + keys[nxt]);
      }
    });
    this.els.searchBtn.addEventListener('click', () => this.handleSearch('default'));

    // Search chips
    this.searchChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const mode = chip.dataset.mode;
        this.handleSearch(mode);
      });
    });

    // Temperature
    this.els.tempC.addEventListener('click', () => {
      this.settings.tempUnit = 'celsius';
      this.els.tempC.classList.add('active');
      this.els.tempF.classList.remove('active');
      this.saveSettings();
      this.fetchWeather();
    });
    this.els.tempF.addEventListener('click', () => {
      this.settings.tempUnit = 'fahrenheit';
      this.els.tempF.classList.add('active');
      this.els.tempC.classList.remove('active');
      this.saveSettings();
      this.fetchWeather();
    });

    // Clock format
    this.els.clock24h.addEventListener('click', () => {
      this.settings.clock24h = true;
      this.els.clock24h.classList.add('active');
      this.els.clock12h.classList.remove('active');
      this.saveSettings();
    });
    this.els.clock12h.addEventListener('click', () => {
      this.settings.clock24h = false;
      this.els.clock12h.classList.add('active');
      this.els.clock24h.classList.remove('active');
      this.saveSettings();
    });

    // Background presets
    this.bgPresets.forEach(p => {
      p.addEventListener('click', () => {
        this.settings.background = p.dataset.bg;
        this.settings.bgImage = '';
        this.applyBackground();
        this.saveSettings();
        this.toast(`Background: ${p.dataset.bg}`);
      });
    });

    // Background upload
    this.els.bgUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.settings.background = 'custom';
        this.settings.bgImage = ev.target.result;
        this.applyBackground();
        this.saveSettings();
        this.toast('Background updated');
      };
      reader.readAsDataURL(file);
    });

    this.els.bgApplyUrl.addEventListener('click', () => {
      const url = this.els.bgUrl.value.trim();
      if (!url) return;
      this.settings.background = 'custom';
      this.settings.bgImage = url;
      this.applyBackground();
      this.saveSettings();
      this.els.bgUrl.value = '';
      this.toast('Background updated');
    });

    // Blur
    this.els.bgBlur.addEventListener('input', () => {
      const v = parseInt(this.els.bgBlur.value);
      this.settings.bgBlur = v;
      this.applyBlur();
      this.saveSettings();
    });

    // Widget checkboxes
    ['showWeather','showDate','showFavorites','showQuote','showTips'].forEach(id => {
      this.els[id].addEventListener('change', () => {
        this.settings[id] = this.els[id].checked;
        this.applyWidgets();
        this.saveSettings();
      });
    });

    // Reset
    this.els.resetSettings.addEventListener('click', () => {
      if (!confirm('Reset all settings to default?')) return;
      localStorage.removeItem('neodesk_settings');
      localStorage.removeItem('neodesk_favorites');
      localStorage.removeItem('neodesk_bgimage');
      this.settings = this.defaultSettings();
      this.favorites = [];
      this.applySettings();
      this.renderFavorites();
      this.fetchWeather();
      this.toast('All settings reset');
    });

    // Shortcut recorder
    this.els.shortcutDisplay.addEventListener('click', () => this.startShortcutRecording());
    this.els.shortcutReset.addEventListener('click', () => {
      this.settings.shortcutMod = 'alt';
      this.settings.shortcutKey = 't';
      this.saveSettings();
      this.updateShortcutUI();
      this.toast('Shortcut reset to Alt+T');
    });

    // Weather
    this.els.weatherInfo.addEventListener('click', () => this.toggleWeatherEdit());
    this.els.weatherSave.addEventListener('click', () => {
      const city = this.els.weatherInput.value.trim();
      if (!city) return;
      this.setWeatherCity(city);
      this.toggleWeatherEdit(false);
      this.toast(`Weather: ${city}`);
    });
    this.els.weatherInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.els.weatherSave.click();
      if (e.key === 'Escape') this.toggleWeatherEdit(false);
    });

    // Favorites
    // Favorites three-dot menu
    if (this.els.favMenuBtn) {
      this.els.favMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.els.favMenuDrop) this.els.favMenuDrop.classList.toggle('hidden');
      });
      document.addEventListener('click', () => { if (this.els.favMenuDrop) this.els.favMenuDrop.classList.add('hidden'); });
    }
    if (this.els.favAddBtn) this.els.favAddBtn.addEventListener('click', () => { this.openFavEditor(); if (this.els.favMenuDrop) this.els.favMenuDrop.classList.add('hidden'); });
    this.els.favSave.addEventListener('click', () => this.saveFavEditor());
    this.els.favCancel.addEventListener('click', () => this.closeFavEditor());
    this.els.favDelete.addEventListener('click', () => {
      if (this.editingFavIndex !== null) this.deleteFavorite(this.editingFavIndex);
    });

    // Favorites editor keyboard: Enter to save
    const favKeyHandler = (e) => {
      if (e.key === 'Enter' && !this.els.favEditor.classList.contains('hidden')) {
        this.saveFavEditor();
      }
      if (e.key === 'Escape' && !this.els.favEditor.classList.contains('hidden')) {
        this.closeFavEditor();
      }
    };
    this.els.favName.addEventListener('keydown', favKeyHandler);
    this.els.favUrl.addEventListener('keydown', favKeyHandler);

    // Terminal
    this.els.terminalLaunch.addEventListener('click', () => this.terminalOpen());
    this.els.terminalClose.addEventListener('click', () => this.terminalClose());

    this.els.terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = this.els.terminalInput.value;
        this.els.terminalInput.value = '';
        this.terminalExecute(val);
      }
    });

    // Distract terminal input
    const dInput = document.getElementById('distract-input');
    if (dInput) {
      dInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = dInput.value;
          dInput.value = '';
          this._distractExec(val);
        }
      });
    }

    // Global keyboard
    document.addEventListener('keydown', (e) => {
      // Skip if recording shortcut
      if (this.isRecordingShortcut) return;

      const mod = this.settings.shortcutMod || 'alt';
      const key = (this.settings.shortcutKey || 't').toLowerCase();
      let modPressed = false;
      if (mod === 'alt') modPressed = e.altKey;
      else if (mod === 'ctrl') modPressed = e.ctrlKey;
      else if (mod === 'meta') modPressed = e.metaKey;

      if (modPressed && e.key.toLowerCase() === key) {
        e.preventDefault();
        if (this.terminalActive) this.terminalClose();
        else this.terminalOpen();
        return;
      }

      if (e.key === 'Escape') {
        if (this.terminalActive) { this.terminalClose(); return; }
        if (this.els.settingsPanel.classList.contains('open')) {
          this.els.settingsPanel.classList.remove('open');
          this.els.settingsOverlay.classList.remove('open');
          return;
        }
        if (this.weatherEditOpen) { this.toggleWeatherEdit(false); return; }
        if (!this.els.favEditor.classList.contains('hidden')) { this.closeFavEditor(); return; }
      }

      if (!this.terminalActive && e.key === '/' && !['INPUT','TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        this.els.searchInput.focus();
      }
    });

    // System theme listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.settings.theme === 'system') this.applyTheme();
    });

    // ═══ Aggressive focus: grab focus from browser URL bar ═══
    // Strategy: autofocus on load, retry every 200ms for 4 seconds,
    // and also focus on first user interaction with the page.
    
    // ═══ Minimal focus — autofocus HTML attribute handles it ═══
    // No JS focus logic to avoid stealing user's cursor.
  }

}


/* ─── Bootstrap ─── */
document.addEventListener('DOMContentLoaded', () => {
  window.neoDesk = new NeoDesk();
});
