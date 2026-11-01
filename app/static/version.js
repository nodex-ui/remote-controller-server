const VERSION_KEY = "rcs.version";

// Reads the version this browser last saw ("" when never stored or storage is blocked).
function storedVersion() {
  try {
    return localStorage.getItem(VERSION_KEY) ?? "";
  } catch {
    return "";
  }
}

// Compares the version the service worker just fetched with the stored one; a change is saved and reloads this page.
function onWorkerMessage(event) {
  if (event.data?.type !== "version") return;
  const version = event.data.version;
  const stored = storedVersion();
  if (version === stored) return;
  try {
    localStorage.setItem(VERSION_KEY, version);
  } catch {
    return;
  }
  if (stored) location.reload();
}

// Other open tabs reload as soon as one tab stores a new version (the storage event fires in every other tab).
function onStorage(event) {
  if (event.key === VERSION_KEY && event.oldValue) location.reload();
}

// Asks the service worker to fetch version.json again and report it.
async function askForVersion() {
  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({ type: "check-version" });
}

// Re-checks whenever the tab comes back into view.
function onVisible() {
  if (document.visibilityState === "visible") askForVersion();
}

// Registers the service worker and wires the version check: on load, on every return to the tab, and via the worker's own navigation checks.
export function initVersionCheck() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("message", onWorkerMessage);
  window.addEventListener("storage", onStorage);
  document.addEventListener("visibilitychange", onVisible);
  navigator.serviceWorker
    .register("./sw.js")
    .then(askForVersion)
    .catch((error) => console.error("Service worker registration failed", error));
}
