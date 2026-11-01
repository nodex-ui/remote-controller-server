import { init } from "nodexui/i18n";

// One-time setup of the nodexui i18n service; texts in code are English, Vietnamese lives in each component's i18n/vi.po.
init({
  languages: [
    { code: "en", label: "English" },
    { code: "vi", label: "Tiếng Việt" },
  ],
  storageKey: "rcs.lang",
});

export * from "nodexui/i18n";
