import { Component, onMounted, useState, Toast } from "nodexui";
import { ui } from "../../static/store.js";

// One corner message (error, warning); it opens itself on arrival and removes itself when it fades out.
export class Notice extends Component {
  static template = "app.Notice";
  static components = { Toast };
  static props = ["notice"];

  setup() {
    this.state = useState({ open: false });
    onMounted(() => {
      this.state.open = true;
    });
  }

  // Follows the toast opening or closing; a closed toast is dropped from the screen.
  onOpenChange(open) {
    this.state.open = open;
    if (!open) ui.dismissNotice(this.props.notice.id);
  }
}
