import { Component, useEffect, useRef, useState, Badge, Button, Card, CardFooter, CardHeader, Input } from "nodexui";
import { loadCatalog, t } from "../../static/i18n.js";
import { remote, state } from "../../static/store.js";

await loadCatalog(import.meta.url);

// Hidden debug panel: connection status, the message log and a box to send chat messages.
export class Debug extends Component {
  static template = "app.Debug";
  static components = { Badge, Button, Card, CardFooter, CardHeader, Input };

  setup() {
    this.state = useState(state);
    this.chatRef = useRef("chat");
    useEffect(
      () => this.scrollChatToEnd(),
      () => [state.messages.length]
    );
  }

  // Looks a text up in the page language.
  t(text) {
    return t(text);
  }

  // Keeps the newest chat line in view; returns nothing because useEffect would treat a result as cleanup code.
  scrollChatToEnd() {
    const el = this.chatRef.el;
    if (el) el.scrollTop = el.scrollHeight;
  }

  // Sends the typed chat message to the phone.
  onChatSubmit() {
    remote.session.chat.sendData(state.chatInput);
  }

  // Closes the debug panel.
  closeDebug() {
    remote.session.debugUtils.disable();
  }
}
