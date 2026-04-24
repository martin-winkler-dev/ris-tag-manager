import { buildAppUI, buildDefaultActionsUI } from "./ui.js";
import { DEFAULT_ACTIONS } from "./tags.js";

export function startApp(appContainer) {
    if (!appContainer) {
        throw new Error("Missing app container.");
    }

	const state = {
		loadedFile: null,
		fileName: "",
		hasChanges: false,
	};

	const ui = buildAppUI();
	appContainer.replaceChildren(ui.root);

    const { root: defaultActionsRoot } = buildDefaultActionsUI(DEFAULT_ACTIONS, (tag) => {
        console.log("Action clicked for tag", tag);
    });

    if (!ui.refs.defaultActionsContainer) {
        throw new Error("Missing defaultActionsContainer ref.");
    }
    ui.refs.defaultActionsContainer.appendChild(defaultActionsRoot);

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
