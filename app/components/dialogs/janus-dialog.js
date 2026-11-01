import { Component, useState, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Button, Input, Label } from "nodexui";
import { loadCatalog, t } from "../../static/i18n.js";
import { state, ui } from "../../static/store.js";

await loadCatalog(import.meta.url);

// Popup for choosing the Janus server address and API secret.
export class JanusDialog extends Component {
  static template = "app.JanusDialog";
  static components = { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Button, Input, Label };

  setup() {
    this.state = useState(state);
    this.ui = ui;
  }

  // Looks a text up in the page language.
  t(text) {
    return t(text);
  }
}
