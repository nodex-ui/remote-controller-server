import { Component, useState, Markdown } from "nodexui";
import { loadCatalog, t } from "../../static/i18n.js";
import { state } from "../../static/store.js";

await loadCatalog(import.meta.url);

// Documents page: the list of files on the left and the chosen markdown file on the right.
export class Docs extends Component {
  static template = "app.Docs";
  static components = { Markdown };

  setup() {
    this.state = useState(state);
  }

  // Looks a text up in the page language.
  t(text) {
    return t(text);
  }
}
