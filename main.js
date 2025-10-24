document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("theme-toggle");
  const terminal = document.getElementById("terminal");
  const terminalInput = document.getElementById("terminal-input");
  const terminalOutput = document.getElementById("terminal-output");
  const container = document.querySelector(".container");
  const footer = document.querySelector("footer");

  /* === THEME HANDLING === */
  const savedTheme = localStorage.getItem("theme") || "dark";
  body.classList.add(savedTheme);
  toggle.textContent = savedTheme === "dark" ? "🌤" : "☀";

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    body.classList.toggle("light");
    const currentTheme = body.classList.contains("dark") ? "dark" : "light";
    toggle.textContent = currentTheme === "dark" ? "🌤" : "☀";
    localStorage.setItem("theme", currentTheme);
  });

  /* === DATE === */
  const dateElement = document.getElementById("date");
  dateElement.textContent = new Date().toLocaleDateString("en-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  /* === TERMINAL === */
  let terminalActive = false;

  // Fonction d’affichage
  const printLine = (text) => {
    const line = document.createElement("div");
    line.textContent = text;
    line.classList.add("terminal-line");
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  const clearTerminal = () => {
    terminalOutput.innerHTML = "";
  };

  const showHelp = () => {
    clearTerminal();
    printLine("=== Available Commands ===");
    printLine("/g [text]    → Google Search (default)");
    printLine("/yt [text]   → YouTube Search");
    printLine("/img [text]  → Google Images");
    printLine("/map [text]  → Google Maps");
    printLine("/wiki [text] → Wikipedia");
    printLine("/ddg [text]  → DuckDuckGo");
    printLine("/clear       → Clear terminal");
    printLine("/help        → Show this help message");
    printLine("--------------------------");
  };

  // Commandes personnalisées
  const commands = {
    "/g": (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    "/yt": (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
    "/img": (q) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`,
    "/map": (q) => `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
    "/wiki": (q) => `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`,
    "/ddg": (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  };

  document.addEventListener("keydown", (e) => {
    // Ouvre / ferme le terminal avec Alt + T
    if (e.altKey && e.key.toLowerCase() === "t") {
      terminalActive = !terminalActive;
      [terminal, container, footer, toggle].forEach(el => el.classList.toggle("hidden"));
      if (terminalActive) setTimeout(() => terminalInput.focus(), 100);
    }

    // Entrée : exécuter la commande
    if (terminalActive && e.key === "Enter") {
      const input = terminalInput.value.trim();
      if (!input) return;

      printLine("> " + input);
      terminalInput.value = "";

      const [command, ...args] = input.split(" ");
      const query = args.join(" ");

      switch (command) {
        case "/help":
          showHelp();
          break;
        case "/clear":
          clearTerminal();
          break;
        default:
          const action = commands[command] || commands["/g"];
          window.location.href = action(query || input);
          break;
      }
    }
  });

  /* === WEATHER WIDGET === */
const weatherDisplay = document.getElementById("weather-display");
const weatherSettings = document.getElementById("weather-settings");
const weatherCity = document.getElementById("weather-city");
const weatherTemp = document.getElementById("weather-temp");
const weatherIcon = document.getElementById("weather-icon");
const weatherInput = document.getElementById("weather-input");
const weatherSave = document.getElementById("weather-save");

// 🔑 Ta clé API OpenWeatherMap (gratuite à créer sur https://openweathermap.org/)
const API_KEY = "a968437efd031f23e6085207a6c4c552";

let currentCity = localStorage.getItem("weatherCity") || "Paris";

// Fonction pour récupérer la météo
async function fetchWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;
    const res = await fetch(url);
    const data = await res.json();
    

    if (data.cod !== 200) throw new Error(data.message);

    weatherCity.textContent = data.name;
    weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
    const icon = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;
  } catch (err) {
    weatherCity.textContent = "City not found";
    weatherTemp.textContent = "";
    weatherIcon.src = "";
  }
}

// Charger la météo au démarrage
fetchWeather(currentCity);

// Cliquer sur la carte → ouvrir/fermer le menu
weatherDisplay.addEventListener("click", () => {
  const open = weatherSettings.classList.toggle("show");
  weatherSettings.classList.toggle("hidden", !open);
  weatherInput.value = currentCity;
  if (open) weatherInput.focus();
});


// Sauvegarder la ville
weatherSave.addEventListener("click", () => {
  const newCity = weatherInput.value.trim();
  if (!newCity) return;
  currentCity = newCity;
  localStorage.setItem("weatherCity", newCity);
  fetchWeather(newCity);
  weatherSettings.classList.add("hidden");
});

});

/* === BACKGROUND WIDGET === */
const bgToggle = document.getElementById("bg-toggle");
const bgMenu = document.getElementById("bg-menu");
const bgUpload = document.getElementById("bg-upload");
const bgUrl = document.getElementById("bg-url");
const bgApply = document.getElementById("bg-apply");
const bgReset = document.getElementById("bg-reset");

const savedBg = localStorage.getItem("customBackground");

// Si un fond personnalisé est sauvegardé, on l’applique
if (savedBg) {
  document.body.style.backgroundImage = `url('${savedBg}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

// Ouvre/ferme le menu
bgToggle.addEventListener("click", () => {
  bgMenu.classList.toggle("hidden");
});

// Appliquer le fond choisi
bgApply.addEventListener("click", () => {
  const url = bgUrl.value.trim();
  if (url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    localStorage.setItem("customBackground", url);
    bgMenu.classList.add("hidden");
    return;
  }

  const file = bgUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgURL = e.target.result;
      document.body.style.backgroundImage = `url('${imgURL}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      localStorage.setItem("customBackground", imgURL);
      bgMenu.classList.add("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// Réinitialiser le fond
bgReset.addEventListener("click", () => {
  document.body.style.backgroundImage = "";
  localStorage.removeItem("customBackground");
  bgMenu.classList.add("hidden");
});

// Fermer le menu si on clique ailleurs
document.addEventListener("click", (e) => {
  if (!bgWidget.contains(e.target) && !bgMenu.classList.contains("hidden")) {
    bgMenu.classList.add("hidden");
  }
});

/* === FAVORITES WIDGET === */
const favToggle = document.getElementById("fav-toggle");
const favPanel = document.getElementById("fav-panel");
const favAdd = document.getElementById("fav-add");
const favList = document.getElementById("fav-list");
const favEditor = document.getElementById("fav-editor");
const favName = document.getElementById("fav-name");
const favUrl = document.getElementById("fav-url");
const favColor = document.getElementById("fav-color");
const favSave = document.getElementById("fav-save");
const favCancel = document.getElementById("fav-cancel");

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let editingIndex = null;

// 🔄 Afficher la liste
function renderFavorites() {
  favList.innerHTML = "";
  favorites.forEach((fav, i) => {
    const item = document.createElement("div");
    item.className = "fav-item";
    item.innerHTML = `
      <div class="info">
        <div class="fav-color-dot" style="background: ${fav.color}"></div>
        <span class="name">${fav.name}</span>
      </div>
      <div class="fav-actions">
        <button class="edit">✎</button>
        <button class="delete">🗑</button>
      </div>
    `;
    item.querySelector(".info").addEventListener("click", () => {
      window.open(fav.url, "_blank");
    });
    item.querySelector(".edit").addEventListener("click", () => editFavorite(i));
    item.querySelector(".delete").addEventListener("click", () => deleteFavorite(i));
    favList.appendChild(item);
  });
}

renderFavorites();

// ⭐ Toggle panneau
favToggle.addEventListener("click", () => {
  favPanel.classList.toggle("hidden");
});

// ➕ Ajouter un favori
favAdd.addEventListener("click", () => {
  editingIndex = null;
  favName.value = "";
  favUrl.value = "";
  favColor.value = "#4CAF50";
  favEditor.classList.remove("hidden");
});

// 💾 Sauvegarder
favSave.addEventListener("click", () => {
  const newFav = {
    name: favName.value.trim() || "Unnamed",
    url: favUrl.value.trim() || "#",
    color: favColor.value
  };
  if (editingIndex !== null) favorites[editingIndex] = newFav;
  else favorites.push(newFav);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  favEditor.classList.add("hidden");
  renderFavorites();
});

// ❌ Annuler
favCancel.addEventListener("click", () => {
  favEditor.classList.add("hidden");
});

// ✏️ Modifier
function editFavorite(index) {
  const fav = favorites[index];
  editingIndex = index;
  favName.value = fav.name;
  favUrl.value = fav.url;
  favColor.value = fav.color;
  favEditor.classList.remove("hidden");
}

// 🗑 Supprimer
function deleteFavorite(index) {
  if (confirm("Delete this favorite?")) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}
