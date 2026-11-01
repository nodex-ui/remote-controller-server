import { Component, useState, AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter } from "nodexui";
import { state, ui } from "../../static/store.js";

// Modal that shows one error message and its OK button (with a countdown when it ends in an automatic action).
export class ErrorDialog extends Component {
  static template = "app.ErrorDialog";
  static components = { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter };

  setup() {
    this.state = useState(state);
    this.ui = ui;
  }

  // Follows the dialog being dismissed.
  onOpenChange(open) {
    if (!open) ui.closeDialog();
  }
}
