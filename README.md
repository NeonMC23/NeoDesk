# 🚀 NeoDesk v4 ✨

> **v4** — A modern, beautiful new tab dashboard with terminal, weather, search, favorites & settings.

NeoDesk transforms your browser's new tab page into a powerful, customizable productivity dashboard featuring a live clock, weather widget, smart search, quick links, built-in terminal, and a full settings system — all stored locally in your browser via `localStorage`.

**🌐 [Live Demo](https://neonmc23.github.io/NeoDesk/)**

---

## ✨ Features

| Feature | Details |
|--------|---------|
| 🕐 **Live Clock** | Digital clock with seconds, 12h/24h format |
| 🌤️ **Weather** | Real-time weather via OpenWeatherMap (custom city) |
| 🔍 **Smart Search** | Google, DuckDuckGo, Bing, Brave, Yahoo (Tab switch) |
| 💻 **Terminal** | Built-in terminal (`Alt + T`) with 15+ commands |
| ⭐ **Favorites** | Custom quick links grid with edit/delete support |
| 🎨 **Themes** | Dark / Light / System mode |
| 🖼️ **Backgrounds** | Gradient presets + custom image/URL |
| 🌫️ **Blur System** | Adjustable UI blur for readability |
| 🧩 **Widgets Toggle** | Enable/disable weather, quotes, date, favorites |
| 💾 **LocalStorage** | Persistent configuration (no backend) |
| 📱 **Responsive UI** | Fully mobile-friendly layout |
| ⌨️ **Keyboard Shortcuts** | Fast navigation and actions |

---

## 🚀 Quick Start

### 1. Clone & Run

```bash
git clone https://github.com/NeonMC23/NeoDesk.git
cd NeoDesk
open index.html
```

### 2. Use as New Tab Page

**Chrome / Edge:**
Install a New Tab override extension.
Set URL to:
`file:///path/to/NeoDesk/index.html`

💡 *For best experience, use GitHub Pages or a local server.*

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Tab` | Switch search engine |
| `Enter` | Execute search |
| `Alt + T` | Open terminal |
| `Esc` | Close panels |

---

## 💻 Terminal System

Open the terminal with: **`Alt + T`**

### 📌 Commands

| Command | Description |
|---------|-------------|
| `/g <query>` | Google search |
| `/yt <query>` | YouTube search |
| `/img <query>` | Image search |
| `/map <query>` | Google Maps |
| `/wiki <query>` | Wikipedia |
| `/ddg <query>` | DuckDuckGo |
| `/reddit <query>` | Reddit search |
| `/gh <query>` | GitHub search |
| `/s <query>` | Default search engine |
| `/weather <city>` | Set weather city |
| `/theme <mode>` | Set theme (dark/light/system) |
| `/time` | Show current time |
| `/date` | Show current date |
| `/todo` | Open Todoist |
| `/clear` | Clear terminal |
| `/help` | Show all commands |

---

## ⚙️ Settings

All settings are stored locally using `localStorage`.

### 🎨 Appearance
- **Theme:** Dark / Light / System
- **Background:** Gradients or custom image
- **Blur intensity:** 0–20px

### 🔎 Search
**Engine selection:**
- Google
- DuckDuckGo
- Bing
- Brave
- Yahoo

### 🧩 Widgets
- Weather toggle
- Quotes toggle
- Date toggle
- Favorites toggle

### ⚙️ System
- Clock format (12h / 24h)
- Temperature unit (C / F)
- Display name personalization
- Reset to default

---

## 🧱 Tech Stack

- **HTML5** (semantic structure)
- **CSS3** (variables, flexbox, grid, animations)
- **Vanilla JavaScript** (ES6+ OOP)
- **OpenWeatherMap API**
- **Quotable API** (fallback included)
- **localStorage** persistence

> **No frameworks. No dependencies. No build tools.**

---

## 📁 Project Structure

```
NeoDesk/
├── index.html   # UI structure
├── style.css    # Styling, themes, responsiveness
├── main.js      # Application logic
└── README.md
```

---

## 🌐 Deployment

**GitHub Pages:**
1. Push repository to GitHub.
2. Go to **Settings → Pages**.
3. Select branch: `main` (Root folder).

Your app will be available at:
`https://<username>.github.io/NeoDesk/`

---

## 🔒 Privacy

NeoDesk is **fully local-first**:
- ❌ No tracking
- ❌ No analytics
- ❌ No account system
- ❌ No backend
- ✅ **Everything stored in browser**

---

## 📱 Browser Support

- Chrome (recommended)
- Edge
- Brave
- Firefox
- Opera

---

## 🗺 Roadmap

### v4 (current)
- Dashboard system
- Terminal integration
- Weather widget
- Favorites system
- Theme engine

### v5 (planned)
- Plugin system
- Notes widget
- Calendar widget
- Drag & drop layout editor
- Export / import settings
- Multi-profile support

---

## 🤝 Contributing

Contributions are welcome!
You can:
- Report bugs
- Suggest features
- Improve UI/UX
- Add widgets
- Optimize performance

---

## 📄 License

**MIT License** © 2026 NeonMC23

---

## ⭐ Support

If you like this project, consider giving it a **star**!

> Made with **focus, minimalism, and performance** — **NeoDesk v4**
