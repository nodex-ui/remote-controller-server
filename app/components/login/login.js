import { Component, useState, Button, Input, Label } from "nodexui";
import { loadCatalog, t } from "../../static/i18n.js";
import { remote, state } from "../../static/store.js";

await loadCatalog(import.meta.url);

// Login form: session id and password shown on the phone.
export class Login extends Component {
  static template = "app.Login";
  static components = { Button, Input, Label };

  setup() {
    this.state = useState(state);
  }

  // Looks a text up in the page language.
  t(text) {
    return t(text);
  }

  // Stores a login field, cutting it to the allowed length.
  onLimitedInput(key, max, value, ev) {
    ev.target.value = value.slice(0, max);
    state[key] = ev.target.value;
  }

  // Connects to the phone when the login form is submitted.
  onLogin() {
    remote.session.login(state.sessionId, state.pin);
  }
}
