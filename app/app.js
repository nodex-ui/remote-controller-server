import { mount } from "nodexui";
import { currentLanguage, translateHead } from "./static/i18n.js";
import { initRouter } from "./static/docs.js";
import { initTheme } from "./static/theme.js";
import { initVersionCheck } from "./static/version.js";
import { Root, templateUrls } from "./components/index.js";

// Removes the outer <templates> tag so several template files can be merged under a single root.
const stripTemplatesWrapper = (xml) => xml.replace(/^\s*<templates[^>]*>/, "").replace(/<\/templates>\s*$/, "");

// Downloads one template file as text.
const fetchText = (url) => fetch(url).then((response) => response.text());

const files = await Promise.all([fetchText(import.meta.resolve("nodexui/templates")), ...templateUrls.map(fetchText)]);
const templates = `<templates>${files.map(stripTemplatesWrapper).join("")}</templates>`;

initVersionCheck();
document.documentElement.lang = currentLanguage();
translateHead();
initTheme();
initRouter();
await mount(Root, document.getElementById("app"), { templates });
