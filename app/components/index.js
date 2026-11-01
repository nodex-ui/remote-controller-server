export { Root } from "./root/root.js";

// Every component folder holds <name>.xml next to <name>.js; the app merges them all into one template set.
export const templateUrls = ["root/root", "navbar/navbar", "docs/docs", "login/login", "device/device", "debug/debug", "notice/notice", "dialogs/error-dialog", "dialogs/janus-dialog"].map((path) => new URL(`./${path}.xml`, import.meta.url));
