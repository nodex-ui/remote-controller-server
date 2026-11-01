// The deployed version marker, resolved against the worker scope so sub-path hosting works.
const VERSION_URL = new URL("version.json", self.registration.scope);

// Fetches version.json (never from cache) and returns its text, or "" when the network or server fails.
async function fetchVersion() {
  try {
    const response = await fetch(VERSION_URL, { cache: "no-store" });
    return response.ok ? (await response.text()).trim() : "";
  } catch {
    return "";
  }
}

// Sends the freshly fetched version to every open page; each page compares it with its own saved copy and reloads when it differs.
async function broadcastVersion() {
  const version = await fetchVersion();
  if (!version) return;
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((client) => client.postMessage({ type: "version", version }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

// Takes over open pages, deletes every cache left behind by earlier versions of this worker, and checks the version.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(broadcastVersion)
  );
});

// A page asks for a version check (on load and whenever its tab becomes visible again).
self.addEventListener("message", (event) => {
  if (event.data?.type === "check-version") event.waitUntil(broadcastVersion());
});

// Answers a request that could not reach the network with a plain network error, so the page sees a normal failed request.
function failedResponse() {
  return Response.error();
}

// Keeps the app installable without caching anything: forwards every request to the network (needed for installability); each page navigation also triggers a version check, and version.json itself is never checked recursively.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.mode === "navigate") event.waitUntil(broadcastVersion());
  event.respondWith(fetch(request).catch(failedResponse));
});
