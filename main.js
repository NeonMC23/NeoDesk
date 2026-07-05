/* ═══════════════════════════════════════════
   NeoDesk — Main Application
   ═══════════════════════════════════════════ */

'use strict';

class NeoDesk {
  constructor() {
    this.settings = this.loadSettings();
    this.favorites = this.loadFavorites();
    this.terminalActive = false;
    this.editingFavIndex = null;
    this.weatherEditOpen = false;
    this.engineOpen = false;
    
    // Search engine URLs
    this.engines = {
      google:      { url: 'https://www.google.com/search?q=',          icon: '🔍' },
      duckduckgo:  { url: 'https://duckduckgo.com/?q=',                icon: '🦆' },
      bing:        { url: 'https://www.bing.com/search?q=',            icon: '🔎' },
      brave:       { url: 'https://search.brave.com/search?q=',        icon: '🛡️' },
      yahoo:       { url: 'https://search.yahoo.com/search?p=',        icon: '📬' }
    };

    // Terminal commands
    this.terminalCommands = {
      '/help':   () => this.terminalHelp(),
      '/clear':  () => this.terminalClear(),
      '/g':      (q) => this.searchQuery('google', q),
      '/yt':     (q) => { window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/img':    (q) => { window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/map':    (q) => { window.open(`https://www.google.com/maps/search/${encodeURIComponent(q)}`, '_blank'); return true; },
      '/wiki':   (q) => { window.open(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/ddg':    (q) => { window.open(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/reddit': (q) => { window.open(`https://www.reddit.com/search/?q=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/gh':     (q) => { window.open(`https://github.com/search?q=${encodeURIComponent(q)}`, '_blank'); return true; },
      '/s':      (q) => this.searchQuery(this.settings.searchEngine, q),
      '/time':   () => this.terminalPrint(`Current time: ${new Date().toLocaleTimeString()}`, 'info'),
      '/date':   () => this.terminalPrint(`Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 'info'),
      '/weather':(q) => { if (q) { this.setWeatherCity(q); this.terminalPrint(`Weather set to: ${q}`, 'success'); } else { this.terminalPrint('Usage: /weather <city>', 'info'); } return true; },
      '/theme':  (q) => { if (q === 'dark' || q === 'light' || q === 'system') { this.setTheme(q); this.terminalPrint(`Theme changed to: ${q}`, 'success'); } else { this.terminalPrint('Usage: /theme <dark|light|system>', 'info'); } return true; },
      '/todo':   () => { window.open('https://todoist.com', '_blank'); return true; }
    };

    this.init();
  }

  /* ─── Init ─── */
  init() {
    this.cacheDOM();
    this.applySettings();
    this.renderFavorites();
    this.startClock();
    this.updateGreeting();
    this.fetchWeather();
    this.fetchQuote();
    this.bindEvents();
    this.showToast('Welcome to NeoDesk ✨', 2000);
  }

  /* ─── Cache DOM ─── */
  cacheDOM() {
    this.els = {
      // Top bar
      weatherInfo:     document.getElementById('weather-info'),
      weatherIcon:     document.getElementById('weather-icon'),
      weatherTemp:     document.getElementById('weather-temp'),
      weatherCity:     document.getElementById('weather-city'),
      weatherEdit:     document.getElementById('weather-edit'),
      weatherInput:    document.getElementById('weather-input'),
      weatherSave:     document.getElementById('weather-save'),
      liveTime:        document.getElementById('live-time'),
      liveDate:        document.getElementById('live-date'),

      // Main
      greetingText:    document.getElementById('greeting-text'),
      greetingName:    document.getElementById('greeting-name'),
      clockTime:       document.getElementById('clock-time'),
      clockSeconds:    document.getElementById('clock-seconds'),
      quoteText:       document.getElementById('quote-text'),
      quoteAuthor:     document.getElementById('quote-author'),

      // Search
      searchInput:     document.getElementById('search-input'),
      searchBtn:       document.getElementById('search-btn'),
      engineBtn:       document.getElementById('engine-btn'),
      engineIcon:      document.getElementById('engine-icon'),
      engineDropdown:  document.getElementById('engine-dropdown'),

      // Favorites
      favGrid:         document.getElementById('fav-grid'),
      favAddBtn:       document.getElementById('fav-add-btn'),
      favEditor:       document.getElementById('fav-editor'),
      favName:         document.getElementById('fav-name'),
      favUrl:          document.getElementById('fav-url'),
      favColor:        document.getElementById('fav-color'),
      favSave:         document.getElementById('fav-save'),
      favCancel:       document.getElementById('fav-cancel'),
      favDelete:       document.getElementById('fav-delete'),

      // Terminal
      terminal:        document.getElementById('terminal'),
      terminalOutput:  document.getElementById('terminal-output'),
      terminalInput:   document.getElementById('terminal-input'),
      terminalClose:   document.getElementById('terminal-close'),
      terminalLaunch:  document.getElementById('terminal-launch'),

      // Settings
      settingsPanel:   document.getElementById('settings-panel'),
      settingsOverlay: document.getElementById('settings-overlay'),
      settingsOpen:    document.getElementById('settings-open'),
      settingsClose:   document.getElementById('settings-close'),
      userName:        document.getElementById('user-name'),
      searchEngine:    document.getElementById('search-engine'),
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
      bgOverlay:       document.getElementById('bg-overlay'),
      topBar:          document.getElementById('top-bar'),
      mainContent:     document.getElementById('main-content'),

      // Toast
      toastContainer:  document.getElementById('toast-container'),
    };

    // Theme buttons collection
    this.themeBtns = document.querySelectorAll('.theme-btn');
    this.bgPresets = document.querySelectorAll('.bg-preset');
    this.engineOpts = document.querySelectorAll('.engine-opt');
  }

  /* ─── LocalStorage ─── */
  loadSettings() {
    try {
      const saved = localStorage.getItem('neodesk_settings');
      if (saved) return { ...this.defaultSettings(), ...JSON.parse(saved) };
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
      weatherCity: 'Paris'
    };
  }

  saveSettings() {
    try {
      localStorage.setItem('neodesk_settings', JSON.stringify(this.settings));
    } catch (e) { /* ignore */ }
  }

  loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem('neodesk_favorites')) || [];
    } catch (e) { return []; }
  }

  saveFavorites() {
    try {
      localStorage.setItem('neodesk_favorites', JSON.stringify(this.favorites));
    } catch (e) { /* ignore */ }
  }

  /* ─── Apply All Settings ─── */
  applySettings() {
    this.applyTheme();
    this.applyBackground();
    this.applyWidgets();
    this.updateSettingsUI();
    this.updateClockFormat();
    this.updateName();
    this.updateEngineIcon();
  }

  /* ─── Theme ─── */
  applyTheme() {
    const theme = this.settings.theme;
    document.body.classList.remove('dark', 'light');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.body.classList.add(theme);
    }

    this.themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
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

    // Reset
    body.style.backgroundImage = '';
    body.style.backgroundColor = '';
    body.classList.remove('has-bg');

    if (bg === 'none' || bg === 'default') {
      // Default gradient based on theme
      if (bg === 'none') {
        document.body.classList.contains('dark')
          ? body.style.background = '#0d1117'
          : body.style.background = '#ffffff';
      }
      this.updateBgPresetUI(bg);
      return;
    }

    // Gradient presets
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

    // Custom image
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
    this.bgPresets.forEach(p => {
      p.classList.toggle('active', p.dataset.bg === active);
    });
  }

  /* ─── Blur ─── */
  applyBlur() {
    const blur = this.settings.bgBlur || 0;
    document.documentElement.style.setProperty('--blur-amount', `${blur}px`);
    this.els.bgBlur.value = blur;
    this.els.bgBlurValue.textContent = `${blur}px`;
  }

  /* ─── Widgets Visibility ─── */
  applyWidgets() {
    const s = this.settings;
    this.els.weatherInfo.closest('#weather-widget').style.display = s.showWeather ? '' : 'none';
    this.els.liveDate.style.display = s.showDate ? '' : 'none';
    this.els.quoteText.closest('.quote').style.display = s.showQuote ? '' : 'none';
    this.els.favGrid.closest('#favorites-section').style.display = s.showFavorites ? '' : 'none';
    
    // Checkboxes
    this.els.showWeather.checked = s.showWeather;
    this.els.showDate.checked = s.showDate;
    this.els.showFavorites.checked = s.showFavorites;
    this.els.showQuote.checked = s.showQuote;
  }

  /* ─── Settings UI ─── */
  updateSettingsUI() {
    this.els.userName.value = this.settings.userName || '';
    this.els.searchEngine.value = this.settings.searchEngine;
    this.els.bgUrl.value = '';
    
    const isCelsius = this.settings.tempUnit === 'celsius';
    this.els.tempC.classList.toggle('active', isCelsius);
    this.els.tempF.classList.toggle('active', !isCelsius);
    
    const is24h = this.settings.clock24h;
    this.els.clock24h.classList.toggle('active', is24h);
    this.els.clock12h.classList.toggle('active', !is24h);

    this.applyBlur();
  }

  updateClockFormat() {
    // Will be applied in startClock
  }

  updateName() {
    const name = this.settings.userName?.trim();
    this.els.greetingName.textContent = name ? `, ${name}` : '';
  }

  updateEngineIcon() {
    const engine = this.settings.searchEngine;
    const info = this.engines[engine] || this.engines.google;
    this.els.engineIcon.textContent = info.icon;
  }

  /* ─── Clock ─── */
  startClock() {
    const update = () => {
      const now = new Date();
      const is24h = this.settings.clock24h;
      
      let timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24h
      });

      const seconds = String(now.getSeconds()).padStart(2, '0');
      const month = now.toLocaleDateString('en-US', { month: 'short' });
      const day = now.getDate();
      const year = now.getFullYear();

      this.els.clockTime.textContent = timeStr;
      this.els.clockSeconds.textContent = seconds;
      this.els.liveTime.textContent = timeStr;
      this.els.liveDate.textContent = `${month} ${day}, ${year}`;
    };

    update();
    setInterval(update, 1000);
  }

  /* ─── Greeting ─── */
  updateGreeting() {
    const hour = new Date().getHours();
    let greet = 'Good evening';
    if (hour < 12) greet = 'Good morning';
    else if (hour < 17) greet = 'Good afternoon';
    
    this.els.greetingText.textContent = greet;
    
    // Update greeting periodically (every minute)
    setInterval(() => {
      const h = new Date().getHours();
      let g = 'Good evening';
      if (h < 12) g = 'Good morning';
      else if (h < 17) g = 'Good afternoon';
      this.els.greetingText.textContent = g;
    }, 60000);
  }

  /* ─── Quote ─── */
  async fetchQuote() {
    const quotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
      { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
      { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
      { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
      { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
      { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
      { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
      { text: "Get busy living or get busy dying.", author: "Stephen King" },
      { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
      { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    ];

    // Try API first
    try {
      const res = await fetch('https://api.quotable.io/random');
      if (res.ok) {
        const data = await res.json();
        this.els.quoteText.textContent = `"${data.content}"`;
        this.els.quoteAuthor.textContent = `— ${data.author}`;
        return;
      }
    } catch (e) { /* fallback */ }

    // Fallback: daily deterministic quote
    const today = new Date().toDateString();
    const index = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % quotes.length;
    const q = quotes[index];
    this.els.quoteText.textContent = `"${q.text}"`;
    this.els.quoteAuthor.textContent = `— ${q.author}`;
  }

  /* ─── Search ─── */
  searchQuery(engine, query) {
    const eng = this.engines[engine] || this.engines.google;
    window.open(eng.url + encodeURIComponent(query), '_blank');
  }

  handleSearch() {
    const query = this.els.searchInput.value.trim();
    if (!query) return;
    this.searchQuery(this.settings.searchEngine, query);
    this.els.searchInput.value = '';
  }

  /* ─── Weather ─── */
  async fetchWeather() {
    const city = this.settings.weatherCity || 'Paris';
    const apiKey = 'a968437efd031f23e6085207a6c4c552';
    const isCelsius = this.settings.tempUnit === 'celsius';

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`
      );
      const data = await res.json();

      if (data.cod !== 200) throw new Error(data.message);

      this.els.weatherCity.textContent = data.name;
      const temp = Math.round(data.main.temp);
      this.els.weatherTemp.textContent = `${temp}°${isCelsius ? 'C' : 'F'}`;
      this.els.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      this.els.weatherIcon.alt = data.weather[0].description || 'Weather';
    } catch (err) {
      this.els.weatherCity.textContent = city;
      this.els.weatherTemp.textContent = '--°';
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
      this.els.favGrid.innerHTML = `
        <div class="fav-empty" style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-muted); font-size: 14px;">
          No links yet. Click <strong>+ Add</strong> to add your first!
        </div>
      `;
      return;
    }

    this.favorites.forEach((fav, i) => {
      const item = document.createElement('a');
      item.className = 'fav-item';
      item.href = fav.url || '#';
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
      item.style.setProperty('--fav-color', fav.color || '#4CAF50');

      const initial = (fav.name || '?').charAt(0).toUpperCase();

      item.innerHTML = `
        <div class="fav-icon-wrapper" style="background: ${fav.color || '#4CAF50'}">${initial}</div>
        <span class="fav-item-name">${fav.name || 'Link'}</span>
        <div class="fav-item-actions">
          <button class="fav-item-action edit-fav" data-index="${i}" title="Edit">✎</button>
          <button class="fav-item-action del-fav" data-index="${i}" title="Delete">✕</button>
        </div>
      `;

      // Prevent nav on action clicks
      item.querySelector('.edit-fav').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.editFavorite(i);
      });

      item.querySelector('.del-fav').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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
    this.els.favEditor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  closeFavEditor() {
    this.els.favEditor.classList.add('hidden');
    this.editingFavIndex = null;
  }

  saveFavEditor() {
    const name = this.els.favName.value.trim() || 'Link';
    const url = this.els.favUrl.value.trim();
    const color = this.els.favColor.value;

    if (!url) {
      this.showToast('Please enter a URL', 2000);
      return;
    }

    // Auto-prepend https://
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }

    const fav = { name, url: finalUrl, color };

    if (this.editingFavIndex !== null) {
      this.favorites[this.editingFavIndex] = fav;
      this.showToast('Link updated ✏️', 1500);
    } else {
      this.favorites.push(fav);
      this.showToast('Link added ✨', 1500);
    }

    this.saveFavorites();
    this.renderFavorites();
    this.closeFavEditor();
  }

  editFavorite(index) {
    const fav = this.favorites[index];
    this.openFavEditor(fav, index);
  }

  deleteFavorite(index) {
    const name = this.favorites[index]?.name || 'this link';
    if (!confirm(`Delete "${name}"?`)) return;
    this.favorites.splice(index, 1);
    this.saveFavorites();
    this.renderFavorites();
    this.closeFavEditor();
    this.showToast('Link deleted 🗑️', 1500);
  }

  /* ─── Terminal ─── */
  terminalOpen() {
    this.terminalActive = true;
    this.els.terminal.classList.add('active');
    setTimeout(() => this.els.terminalInput.focus(), 150);
  }

  terminalClose() {
    this.terminalActive = false;
    this.els.terminal.classList.remove('active');
  }

  terminalPrint(text, type = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    this.els.terminalOutput.appendChild(line);
    this.els.terminalOutput.scrollTop = this.els.terminalOutput.scrollHeight;
  }

  terminalClear() {
    this.els.terminalOutput.innerHTML = '';
    this.terminalPrint('NeoDesk Terminal v2.0 — Type /help for commands', 'info');
  }

  terminalHelp() {
    this.terminalClear();
    this.terminalPrint('╔══════════════════════════════════╗', 'info');
    this.terminalPrint('║      NeoDesk Terminal Commands   ║', 'info');
    this.terminalPrint('╚══════════════════════════════════╝', 'info');
    this.terminalPrint('');
    this.terminalPrint('  /g <query>     →  Google Search', 'info');
    this.terminalPrint('  /yt <query>    →  YouTube Search', 'info');
    this.terminalPrint('  /img <query>   →  Google Images', 'info');
    this.terminalPrint('  /map <query>   →  Google Maps', 'info');
    this.terminalPrint('  /wiki <query>  →  Wikipedia', 'info');
    this.terminalPrint('  /ddg <query>   →  DuckDuckGo', 'info');
    this.terminalPrint('  /reddit <q>    →  Reddit', 'info');
    this.terminalPrint('  /gh <query>    →  GitHub', 'info');
    this.terminalPrint('  /s <query>     →  Default Search', 'info');
    this.terminalPrint('  /weather <city>→  Set weather city', 'info');
    this.terminalPrint('  /theme <mode>  →  dark|light|system', 'info');
    this.terminalPrint('  /time          →  Show current time', 'info');
    this.terminalPrint('  /date          →  Show current date', 'info');
    this.terminalPrint('  /todo          →  Open Todoist', 'info');
    this.terminalPrint('  /clear         →  Clear terminal', 'info');
    this.terminalPrint('  /help          →  Show this message', 'info');
    this.terminalPrint('');
    this.terminalPrint('  Tip: Just type anything to search!', 'info');
  }

  terminalExecute(input) {
    const trimmed = input.trim();
    if (!trimmed) return;

    this.terminalPrint(`❯ ${trimmed}`, 'input');

    const [cmd, ...args] = trimmed.split(' ');
    const query = args.join(' ');

    if (this.terminalCommands[cmd]) {
      const result = this.terminalCommands[cmd](query);
      if (result === true) {
        // command handled, nothing extra
      }
    } else if (cmd.startsWith('/')) {
      this.terminalPrint(`Unknown command: ${cmd}. Type /help`, 'error');
    } else {
      // Default: search
      this.searchQuery(this.settings.searchEngine, trimmed);
      this.terminalPrint(`Searching: ${trimmed}`, 'success');
    }
  }

  /* ─── Toast ─── */
  showToast(message, duration = 2500) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    this.els.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  /* ─── Event Binding ─── */
  bindEvents() {
    // ── Theme ──
    this.themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTheme(btn.dataset.theme);
        this.showToast(`Theme: ${btn.dataset.theme}`, 1500);
      });
    });

    // ── Settings ──
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

    // ── User Name ──
    this.els.userName.addEventListener('input', () => {
      this.settings.userName = this.els.userName.value;
      this.updateName();
      this.saveSettings();
    });

    // ── Search Engine ──
    this.els.searchEngine.addEventListener('change', () => {
      this.settings.searchEngine = this.els.searchEngine.value;
      this.updateEngineIcon();
      this.saveSettings();
      this.showToast(`Engine: ${this.els.searchEngine.value}`, 1500);
    });

    // ── Engine button dropdown ──
    this.els.engineBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.els.engineDropdown.classList.toggle('hidden');
    });

    this.engineOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const engine = opt.dataset.engine;
        this.settings.searchEngine = engine;
        this.updateEngineIcon();
        this.saveSettings();
        this.els.engineDropdown.classList.add('hidden');
        this.showToast(`Engine: ${engine}`, 1000);
      });
    });

    document.addEventListener('click', () => {
      this.els.engineDropdown.classList.add('hidden');
    });

    // ── Search ──
    this.els.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSearch();
      if (e.key === 'Tab') {
        e.preventDefault();
        // Cycle through engines
        const engines = Object.keys(this.engines);
        const current = engines.indexOf(this.settings.searchEngine);
        const next = (current + 1) % engines.length;
        this.settings.searchEngine = engines[next];
        this.updateEngineIcon();
        this.saveSettings();
        this.showToast(`Engine: ${engines[next]}`, 1000);
      }
    });

    this.els.searchBtn.addEventListener('click', () => this.handleSearch());

    // ── Temperature ──
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

    // ── Clock format ──
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

    // ── Background presets ──
    this.bgPresets.forEach(preset => {
      preset.addEventListener('click', () => {
        this.settings.background = preset.dataset.bg;
        this.settings.bgImage = '';
        this.applyBackground();
        this.saveSettings();
        this.showToast(`Background: ${preset.dataset.bg}`, 1000);
      });
    });

    // ── Background upload ──
    this.els.bgUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.settings.background = 'custom';
        this.settings.bgImage = ev.target.result;
        this.applyBackground();
        this.saveSettings();
        this.showToast('Background updated 📸', 1500);
      };
      reader.readAsDataURL(file);
    });

    // ── Background URL ──
    this.els.bgApplyUrl.addEventListener('click', () => {
      const url = this.els.bgUrl.value.trim();
      if (!url) return;
      this.settings.background = 'custom';
      this.settings.bgImage = url;
      this.applyBackground();
      this.saveSettings();
      this.els.bgUrl.value = '';
      this.showToast('Background updated 🖼️', 1500);
    });

    // ── Background Blur ──
    this.els.bgBlur.addEventListener('input', () => {
      const val = parseInt(this.els.bgBlur.value);
      this.settings.bgBlur = val;
      this.applyBlur();
      this.saveSettings();
    });

    // ── Widget checkboxes ──
    this.els.showWeather.addEventListener('change', () => {
      this.settings.showWeather = this.els.showWeather.checked;
      this.applyWidgets();
      this.saveSettings();
    });

    this.els.showDate.addEventListener('change', () => {
      this.settings.showDate = this.els.showDate.checked;
      this.applyWidgets();
      this.saveSettings();
    });

    this.els.showFavorites.addEventListener('change', () => {
      this.settings.showFavorites = this.els.showFavorites.checked;
      this.applyWidgets();
      this.saveSettings();
    });

    this.els.showQuote.addEventListener('change', () => {
      this.settings.showQuote = this.els.showQuote.checked;
      this.applyWidgets();
      this.saveSettings();
    });

    // ── Reset Settings ──
    this.els.resetSettings.addEventListener('click', () => {
      if (!confirm('Reset all settings to default? This cannot be undone.')) return;
      localStorage.removeItem('neodesk_settings');
      localStorage.removeItem('neodesk_favorites');
      localStorage.removeItem('weatherCity');
      this.settings = this.defaultSettings();
      this.favorites = [];
      this.applySettings();
      this.renderFavorites();
      this.fetchWeather();
      this.showToast('All settings reset 🔄', 2000);
    });

    // ── Weather ──
    this.els.weatherInfo.addEventListener('click', () => this.toggleWeatherEdit());

    this.els.weatherSave.addEventListener('click', () => {
      const city = this.els.weatherInput.value.trim();
      if (!city) return;
      this.setWeatherCity(city);
      this.toggleWeatherEdit(false);
      this.showToast(`Weather: ${city}`, 1500);
    });

    this.els.weatherInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.els.weatherSave.click();
      if (e.key === 'Escape') this.toggleWeatherEdit(false);
    });

    // ── Favorites ──
    this.els.favAddBtn.addEventListener('click', () => this.openFavEditor());
    this.els.favSave.addEventListener('click', () => this.saveFavEditor());
    this.els.favCancel.addEventListener('click', () => this.closeFavEditor());
    this.els.favDelete.addEventListener('click', () => {
      if (this.editingFavIndex !== null) this.deleteFavorite(this.editingFavIndex);
    });

    // ── Terminal ──
    this.els.terminalLaunch.addEventListener('click', () => this.terminalOpen());
    this.els.terminalClose.addEventListener('click', () => this.terminalClose());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt+T toggle terminal
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        if (this.terminalActive) this.terminalClose();
        else this.terminalOpen();
        return;
      }

      // Escape closes everything
      if (e.key === 'Escape') {
        if (this.terminalActive) {
          this.terminalClose();
          return;
        }
        if (this.els.settingsPanel.classList.contains('open')) {
          this.els.settingsPanel.classList.remove('open');
          this.els.settingsOverlay.classList.remove('open');
          return;
        }
        if (this.weatherEditOpen) {
          this.toggleWeatherEdit(false);
          return;
        }
        if (!this.els.favEditor.classList.contains('hidden')) {
          this.closeFavEditor();
          return;
        }
      }

      // Focus search with /
      if (!this.terminalActive && e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        this.els.searchInput.focus();
      }
    });

    // Terminal input
    this.els.terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const input = this.els.terminalInput.value;
        this.els.terminalInput.value = '';
        this.terminalExecute(input);
      }
    });

    // ── System theme change listener ──
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.settings.theme === 'system') this.applyTheme();
    });

    // ── Initial focus ──
    // Focus search on load (but not on mobile to avoid keyboard popup)
    if (window.innerWidth > 768) {
      setTimeout(() => this.els.searchInput.focus(), 500);
    }
  }
}

/* ─── Bootstrap ─── */
document.addEventListener('DOMContentLoaded', () => {
  window.neoDesk = new NeoDesk();
});
