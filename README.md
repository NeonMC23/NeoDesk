# NeoDesk v4 ✨

> **v4** — A modern, beautiful new tab dashboard with terminal, weather, search, favorites & settings.

NeoDesk transforms your browser's new tab page into a powerful, customizable dashboard featuring a live clock, weather widget, quick links, a built-in terminal, and a full settings panel — all saved to your browser's localStorage.

**[🌐 Live Demo](https://neonmc23.github.io/NeoDesk/)**

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🕐 **Live Clock** | Analog-style digital clock with seconds, 12h/24h support |
| 🌤️ **Weather** | Real-time weather from OpenWeatherMap, configurable city |
| 🔍 **Smart Search** | Supports Google, DuckDuckGo, Bing, Brave, Yahoo — switch via Tab key |
| 💻 **Terminal** | Press `Alt+T` for a full terminal with 15+ commands |
| 🔗 **Favorites** | Quick links grid with colors, edit/delete, drag-free |
| 🎨 **Themes** | Dark, Light, and System (follows OS preference) |
| 🖼️ **Backgrounds** | 7 gradient presets + custom image upload/URL |
| 🔲 **Background Blur** | Adjustable blur overlay for readability |
| 🧩 **Widget Toggle** | Show/hide weather, date, quotes, favorites |
| 💾 **LocalStorage** | All settings persist across sessions |
| 📱 **Responsive** | Fully mobile-friendly with adaptive layout |
| 🎯 **Keyboard Shortcuts** | `/` focus search, `Tab` cycle engines, `Alt+T` terminal, `Esc` close panels |

---

## 🚀 Quick Start

### 1. Clone & Open

```bash
git clone https://github.com/NeonMC23/NeoDesk.git
cd NeoDesk
open index.html
```

### 2. Set as New Tab Page

**Chrome / Edge:**
1. Install a new tab override extension (e.g. [Custom New Tab](https://chrome.google.com/webstore/detail/new-tab-override/fjcjgmepmojgkcfdhpngbnmjnfhppooh))
2. Point it to: `file:///path/to/NeoDesk/index.html`

> 💡 For a better experience, host the page locally or deploy to GitHub Pages.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Tab` | Cycle search engine |
| `Enter` | Execute search |
| `Alt+T` | Toggle terminal |
| `Esc` | Close panels / terminal |

---


| `/distract` | Open Distract mini-programs terminal |
## 💻 Terminal Commands

| Command | Description |
|---------|-------------|
| `/g <query>` | Google Search |
| `/yt <query>` | YouTube Search |
| `/img <query>` | Google Images |
| `/map <query>` | Google Maps |
| `/wiki <query>` | Wikipedia |
| `/ddg <query>` | DuckDuckGo |
| `/reddit <q>` | Reddit Search |
| `/gh <query>` | GitHub Search |
| `/s <query>` | Default Engine Search |
| `/weather <city>` | Set weather city |
| `/theme <mode>` | Set theme (dark / light / system) |
| `/time` | Show current time |
| `/date` | Show current date |
| `/todo` | Open Todoist |
| `/clear` | Clear terminal |
| `/help` | Show all commands |

---

## ⚙️ Settings

All settings are saved to `localStorage` and persist between sessions.

### Available Settings

- **Theme**: Dark / Light / System
- **Search Engine**: Google, DuckDuckGo, Bing, Brave, Yahoo
- **Temperature**: Celsius / Fahrenheit
- **Clock Format**: 12h / 24h
- **Display Name**: Custom greeting name
- **Background**: 7 gradient presets or custom image
- **Background Blur**: 0–20px
- **Widgets**: Show/hide weather, date, quotes, favorites
- **Reset**: One-click reset to defaults

---

## 🛠️ Tech Stack

- Vanilla JavaScript (ES6+)
- CSS3 with custom properties, animations, backdrop-filter
- HTML5 semantic markup
- OpenWeatherMap API
- Quotable API (with offline fallback)

---

## 📁 Project Structure

```
NeoDesk/
├── index.html    # Main HTML structure
├── style.css     # All styles (variables, themes, responsive)
├── main.js       # Application logic (OOP, ES6 class)
└── README.md     # This file
```

---

## 🌐 Deployment

### GitHub Pages

```bash
git push origin main
```

Then enable GitHub Pages in your repo settings → `main` branch → root folder.

Your page will be live at: `https://<username>.github.io/NeoDesk/`

---

## 📄 License

MIT © NeonMC23

---

*Made with ❤️ and lots of ☕ — v4.0*
