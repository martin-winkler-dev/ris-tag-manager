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

    if (!ui.refs.cont_defaultActions) {
        throw new Error("Missing defaultActionsContainer ref.");
    }
    ui.refs.cont_defaultActions.appendChild(defaultActionsRoot);

	wireEvents(ui.refs, state);

	return { state, ui };
}

function wireEvents(refs, state) {
	if (refs.btn_openFile) {
		refs.btn_openFile.addEventListener("click", () => {
            // reset state
			// load file
		});
	}
}
