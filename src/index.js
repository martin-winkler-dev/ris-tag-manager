import styles from "./index.css";
import { startApp } from "./js/app.js";
import { APP_META } from "./js/meta.js";

function injectStyles(cssText) {
    const styleElement = document.createElement("style");
    styleElement.id = "app-styles";
    styleElement.textContent = minifyCss(cssText);
    document.head.appendChild(styleElement);
}

document.addEventListener("DOMContentLoaded", () => {
    injectStyles(styles);
    window.appMeta = APP_META;
    window.__APP_META__ = APP_META;
    document.title = `${APP_META.appName} v${APP_META.version}`;

    const appContainer = document.getElementById("app");

    if (!appContainer) {
        throw new Error("Missing #app container.");
    }

    const app = startApp(appContainer);

    window.app = app;
    window.state = app.state;
    window.ui = app.ui;
});

function minifyCss(cssText) {
    return String(cssText)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,>+~])\s*/g, "$1")
        .replace(/;}/g, "}")
        .trim();
}
