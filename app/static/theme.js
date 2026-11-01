import { state } from "./store.js";

const THEME_KEY = "rcs.theme";

// Picks the saved theme, else the one the operating system prefers.
function initialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage can be blocked; fall through to the system preference.
  }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Applies a theme to the whole page (NodexUI and Bootstrap each read their own attribute) and remembers it.
export function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("b-theme", theme);
  document.documentElement.setAttribute("data-bs-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Not remembering the choice is harmless.
  }
}

// Flips between the light and dark theme.
export function toggleTheme() {
  setTheme(state.theme === "light" ? "dark" : "light");
}

// Applies the saved (or system) theme when the app starts.
export function initTheme() {
  setTheme(initialTheme());
}
