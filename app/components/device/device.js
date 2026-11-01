import { Component, onMounted, useRef, useState } from "nodexui";
import { loadCatalog, t } from "../../static/i18n.js";
import { RemoteSession } from "../../static/remote-session.js";
import { remote, state, ui } from "../../static/store.js";

await loadCatalog(import.meta.url);

// Device window: the phone's video, its touch overlay and the back/home/recents buttons; also starts the remote session once the video element exists.
export class Device extends Component {
  static template = "app.Device";

  setup() {
    this.state = useState(state);
    this.videoRef = useRef("video");
    onMounted(() => {
      remote.session = new RemoteSession(this.videoRef.el);
      remote.session.start();
    });
  }

  // Looks a text up in the page language.
  t(text) {
    return t(text);
  }

  // Sends a remote-control command (back, home, recents, notifications) to the phone.
  sendCommand(command) {
    remote.session.chat.sendData(command);
  }

  // Disconnects from the phone.
  disconnect() {
    ui.emit("Session.Disconnect");
  }

  // The video started playing.
  onPlaying() {
    remote.session.video.onPlaying();
  }

  // Finger or mouse pressed on the video overlay.
  onGestureDown(ev) {
    remote.session.gestures.onDown(ev);
  }

  // Finger or mouse released (or the touch was cancelled) on the video overlay.
  onGestureUp(ev) {
    remote.session.gestures.onUp(ev);
  }

  // Finger or mouse moved over the video overlay (two fingers scroll the page).
  onGestureMove(ev) {
    remote.session.gestures.onMove(ev);
  }
}
