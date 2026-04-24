import { startApp } from "./js/app.js";

document.addEventListener("DOMContentLoaded", () => {
	const appContainer = document.getElementById("app");

	if (!appContainer) {
		throw new Error("Missing #app container.");
	}
    
	const app = startApp(appContainer);

	window.app = app;
	window.state = app.state;
	window.ui = app.ui;
});
