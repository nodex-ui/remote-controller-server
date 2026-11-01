export default {
  manifest: { name: "Remote Controller Server", shortName: "Remote Controller", description: "Open source web application to access Android devices remotely (remote support program)", themeColor: "#0f172a" },
  serviceWorker: {
    cacheName: "apuppet-web-admin-v4",
    cdnVersion: "1.3.2",
    appFiles: ["app.css", "app.js", "static/images/favicon.ico"],
  },
};
