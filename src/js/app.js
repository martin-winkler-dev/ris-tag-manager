import { buildAppUI } from "./ui.js";

export function startApp(appContainer) {
	const state = {
		loadedFile: null,
		fileName: "",
		hasChanges: false,
	};

	const ui = buildAppUI();
	appContainer.replaceChildren(ui.root);

	wireEvents(ui.refs, state);

	return { state, ui };
}

function wireEvents(refs, state) {
	if (refs.openFileButton) {
		refs.openFileButton.addEventListener("click", () => {
			state.hasChanges = true;

			if (refs.statusText) {
				refs.statusText.textContent = "Open dialog will be implemented next.";
			}
		});
	}
}
