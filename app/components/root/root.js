import { Component, useState } from "nodexui";
import { Debug } from "../debug/debug.js";
import { Device } from "../device/device.js";
import { ErrorDialog } from "../dialogs/error-dialog.js";
import { JanusDialog } from "../dialogs/janus-dialog.js";
import { Docs } from "../docs/docs.js";
import { Login } from "../login/login.js";
import { Navbar } from "../navbar/navbar.js";
import { Notice } from "../notice/notice.js";
import { state } from "../../static/store.js";

// The whole screen: navbar, console (login, device, debug) or documents page, dialogs and corner messages.
export class Root extends Component {
  static template = "app.Root";
  static components = { Debug, Device, Docs, ErrorDialog, JanusDialog, Login, Navbar, Notice };

  setup() {
    this.state = useState(state);
  }
}
