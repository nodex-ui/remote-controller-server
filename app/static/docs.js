import { state } from "./store.js";

const DOCS_ROUTE = "#/docs";

// Turns "/docs/a/b.md" style text after the hash into a docs-relative file path ("" when none).
function docPathFromHash(hash) {
  return decodeURIComponent(hash.slice(DOCS_ROUTE.length + 1));
}

// Loads the list of documents once; the folder has no directory listing, so docs/index.json names them.
async function loadDocList() {
  if (state.docs.list.length) return;
  try {
    const response = await fetch("docs/index.json");
    state.docs.list = response.ok ? await response.json() : [];
  } catch {
    state.docs.list = [];
  }
}

// Rewrites a link or image path so it is read from the docs folder, whichever page the markdown is shown on.
function rewritePath(path, docPaths) {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(path)) return path;
  const base = new URL("docs/", location.href);
  const url = new URL(path, base);
  const file = decodeURIComponent(url.pathname.slice(base.pathname.length));
  if (docPaths.includes(file)) return `${DOCS_ROUTE}/${file}`;
  return `docs/${file}${url.search}${url.hash}`;
}

// Points every relative link/image in a markdown text at app/docs, leaving fenced code untouched.
export function rewriteMarkdown(markdown, docPaths) {
  const fix = (match, head, path, tail) => head + rewritePath(path, docPaths) + tail;
  return markdown
    .split(/(^```[\s\S]*?^```)/m)
    .map((part, i) =>
      i % 2
        ? part
        : part
            .replace(/(\]\(\s*<?)([^)\s>]+)(>?(?:\s+"[^"]*")?\s*\))/g, fix)
            .replace(/(\s(?:src|href)=")([^"]+)(")/g, fix)
    )
    .join("");
}

// Fetches the chosen document (or the first one) and stores its rewritten text for the Markdown component.
async function showDoc(path) {
  await loadDocList();
  const docs = state.docs;
  const file = path || docs.list[0]?.path || "";
  docs.path = file;
  if (!file) {
    docs.status = "empty";
    return;
  }
  docs.status = "loading";
  try {
    const response = await fetch(`docs/${file}`);
    if (!response.ok) throw new Error(response.statusText);
    const text = await response.text();
    if (docs.path !== file) return;
    docs.content = rewriteMarkdown(text, docs.list.map((doc) => doc.path));
    docs.status = "ready";
  } catch {
    if (docs.path === file) docs.status = "error";
  }
}

// Shows the page named by the address hash: #/docs[/file.md] is the documents page, anything else the console.
function onHashChange() {
  const hash = location.hash;
  const isDocs = hash === DOCS_ROUTE || hash.startsWith(`${DOCS_ROUTE}/`);
  state.page = isDocs ? "docs" : "console";
  if (isDocs) showDoc(docPathFromHash(hash));
}

// Starts following the address hash so the documents page and the console switch without reloading.
export function initRouter() {
  window.addEventListener("hashchange", onHashChange);
  onHashChange();
}
