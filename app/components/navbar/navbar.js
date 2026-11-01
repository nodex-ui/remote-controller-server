import { Component, useState, Button } from "nodexui";
import { currentLanguage, loadCatalog, setLanguage, t } from "../../static/i18n.js";
import { state, ui } from "../../static/store.js";
import { toggleTheme } from "../../static/theme.js";

await loadCatalog(import.meta.url);

// Top bar: brand, page links, device name, and the disconnect / language / theme buttons.
export class Navbar extends Component {
  static template = "app.Navbar";
  static components = { Button };

  setup() {
    this.state = useState(state);
    this.lang = currentLanguage();
  }

  // Looks a text up in the page language.
  t(text) {
    return t(text);
  }

  // Switches between English and Vietnamese (the page reloads in the new language).
  toggleLang() {
    setLanguage(this.lang === "en" ? "vi" : "en");
  }

  // Switches between the light and dark theme.
  toggleTheme() {
    toggleTheme();
  }

  // Disconnects from the phone.
  disconnect() {
    ui.emit("Session.Disconnect");
  }
}
