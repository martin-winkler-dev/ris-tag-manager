import { buildAppUI, buildDefaultActionsUI } from "./ui.js";
import { DEFAULT_ACTIONS } from "./tags.js";
import { parseFile, deleteTag } from "./ris.js";
import { ALLOWED_EXTENSIONS } from "./config.js";

export function startApp(appContainer) {
    if (!appContainer) {
        throw new Error("Missing app container.");
    }

	const state = {
		loadedFile: null,
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
        refs.btn_openFile.addEventListener("click", async () => {
            await openFile(refs, state);
        });
	}
}

async function openFile(refs, state) {
    const file = await pickFile(ALLOWED_EXTENSIONS);

    if (!file) {
        return;
    }
    if (!hasAllowedExtension(file.name, ALLOWED_EXTENSIONS)) {
        alert("Please select a .ris file.");
        return;
    }

    const fileContent = await file.text();
    const { baseName, extension } = splitFileName(file.name);
    const { paperCount, tags } = parseFile(fileContent);

    state.loadedFile = {
        fullName: file.name,
        baseName,
        extension,
        originalContent: fileContent,
        currentContent: fileContent,
        paperCount,
        tags,
    };
    state.hasChanges = false;

    // update filename
    // update status
    // update tags

    console.log("File loaded", {
        name: state.loadedFile.fullName,
        paperCount,
        uniqueTagCount: tags.size,
    });
}

function pickFile(allowedExtensions) {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = allowedExtensions.map((ext) => `.${ext}`).join(",");

        input.addEventListener(
            "change",
            () => {
                const selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
                resolve(selectedFile);
            },
            { once: true }
        );

        input.click();
    });
}

function hasAllowedExtension(fileName, allowedExtensions) {
    const lowerFileName = fileName.toLowerCase();
    return allowedExtensions.some((extension) => lowerFileName.endsWith(`.${extension.toLowerCase()}`));
}

function splitFileName(fileName) {
    const lastDotIndex = fileName.lastIndexOf(".");

    if (lastDotIndex < 0) {
        return {
            baseName: fileName,
            extension: "",
        };
    }

    return {
        baseName: fileName.slice(0, lastDotIndex),
        extension: fileName.slice(lastDotIndex + 1),
    };
}