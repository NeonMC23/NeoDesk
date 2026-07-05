# NeoDesk v3 ✨

> **NeoDesk** transforms your browser's new tab into a powerful, beautiful, and deeply customizable dashboard — with a live clock, real-time weather, quick links, a built-in terminal, and a full settings panel. Everything is saved to `localStorage`.

**[🌐 Live Demo](https://neonmc23.github.io/NeoDesk/)**

---

## ✨ Features (v3)

| Category | Details |
|----------|---------|
| 🕐 **Live Clock** | Gradient or solid color, customizable start/end gradient colors, 12h/24h, seconds toggle |
| 🌤️ **Weather** | Real-time from OpenWeatherMap, °C/°F, city search |
| 🔍 **Smart Search** | Google, DuckDuckGo, Bing, Brave, Yahoo, **Startpage** — switch via `Tab` or click, search chips for Images/Videos/News/Maps |
| 💻 **Terminal** | Full-featured with 15+ commands (`/help`, `/weather`, `/theme`, `/g`, `/yt`, `/gh`, `/reddit`, `/todo`, `/map`, `/wiki`, `/time`, `/date`, `/clear`), customizable shortcut |
| 🔗 **Quick Links** | Add/edit/delete with color picker, discreet ⋮ menu |
| 🎨 **Themes** | Dark, Light, System (follows OS) |
| 🖼️ **Backgrounds** | 7 gradient presets + custom image upload/URL + adjustable blur |
| 🎛️ **Customization** | 16+ fonts, accent color (7 presets + picker), clock color (8 presets + custom gradient), interface colors (bg, card, text), font toggle for more options |
| 💾 **Persistent** | All settings saved to `localStorage` |
| 📱 **Responsive** | Fully mobile-friendly |
| ⌨️ **Keyboard** | `/` focus search, `Tab` cycle engines, `Alt+T` (customizable) terminal, `Esc` close |

---

## 🚀 Quick Start

```bash
git clone https://github.com/NeonMC23/NeoDesk.git
cd NeoDesk
open index.html
```

Set as browser new tab page using a new tab extension pointing to `index.html`.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `Tab` | Cycle search engine |
| `Enter` | Execute search |
| `Alt+T` (configurable) | Toggle terminal |
| `Esc` | Close panels / terminal |

---

## 💻 Terminal Commands

| Command | Description |
|---------|-------------|
| `/g <query>` | Google Search |
| `/yt <query>` | YouTube Search |
| `/img <query>` | Image Search |
| `/map <query>` | Maps Search |
| `/wiki <query>` | Wikipedia |
| `/ddg <query>` | DuckDuckGo |
| `/reddit <q>` | Reddit Search |
| `/gh <query>` | GitHub Search |
| `/s <query>` | Default Engine Search |
| `/weather <city>` | Set weather city |
| `/theme <mode>` | dark / light / system |
| `/time` | Show current time |
| `/date` | Show current date |
| `/todo` | Open Todoist |
| `/clear` | Clear terminal |
| `/help` | Show all commands |

Just type anything (no `/`) to directly search with your default engine.

---

## ⚙️ Settings (Full Customization)

### Theme & Colors
- **Theme**: Dark / Light / System
- **Accent Color**: 7 presets (Forest, Blue, Purple, Coral, Gold, Pink, Teal) + custom picker
- **Clock Color**: 8 presets + custom solid color + **fully customizable gradient** (pick start + end colors)
- **Interface Colors**: Background, Card, Text — live preview

### Fonts (16 options)
| Basic | Advanced |
|-------|----------|
| Inter, Space Grotesk, Outfit, DM Sans, Plus Jakarta Sans, Manrope | Playfair Display, Fira Code, JetBrains Mono, Syne, Epilogue, Unbounded, Chillax, Cabinet Grotesk, Satoshi, General Sans, Segoe UI |

### Search
- 6 engines: Google, DuckDuckGo, Bing, Brave, Yahoo, **Startpage**
- Search chips for Images, Videos, News, Maps
- Smart mode detection per engine

### Widgets
- Weather, Date, Favorites, Quote, Search Tips — individually toggleable

### Data
- One-click **Reset All Settings**

---

## 📦 Tech Stack

- Vanilla JavaScript (ES6+ class-based)
- CSS3 with custom properties, animations, backdrop-filter
- HTML5 semantic markup
- OpenWeatherMap API
- Google Fonts (16 families)
- localStorage persistence

---

## 📁 Project Structure

```
NeoDesk/
├── index.html       # Main HTML
├── style.css        # All styles (themes, responsive, animations)
├── main.js          # Application logic (OOP, class NeoDesk)
├── README.md        # This file
├── icon.png         # Favicon
└── icon/            # Search engine icons
    ├── google.png
    ├── duckduckgo.png
    ├── bing.png
    ├── brave.png
    ├── yahoo.png
    └── startpage.png
```

---

## 📄 License

MIT © NeonMC23

---

*Made with ❤️ and lots of ☕ — v3.0*
