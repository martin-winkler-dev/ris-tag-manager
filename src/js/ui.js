// minimal ui builder
function buildUI(definition) {
	const refs = {};

	if (Array.isArray(definition)) {
		const fragment = document.createDocumentFragment();

		for (const childDefinition of definition) {
			fragment.appendChild(createNode(childDefinition, refs));
		}

		return { root: fragment, refs };
	}

	return {
		root: createNode(definition, refs),
		refs,
	};

    function createNode(definition, refs) {
        if (!definition || typeof definition !== "object") {
            throw new Error("Definition not an object.");
        }
        
        const {
            tag = "div",
            content = "",
            attrs = {},
            children = [],
            ref,
            on = {},
        } = definition;
        
        const element = document.createElement(tag);
        
        if (content !== "") {
            element.textContent = String(content);
        }
        
        // attributes
        for (const [name, value] of Object.entries(attrs)) {
            if (value === false || value === null || value === undefined) {
                continue;
            }
    
            if (value === true) {
                element.setAttribute(name, "");
                continue;
            }
    
            element.setAttribute(name, String(value));
        }

        // children
        for (const childDefinition of children) {
            element.appendChild(createNode(childDefinition, refs));
        }

        // event listeners
        for (const [event, handler] of Object.entries(on)) {
            element.addEventListener(event, handler);
        }

        // add ref to html element
        if (ref && typeof ref === "string") {
            refs[ref] = element;
        }
        
        return element;
    }
}

export function buildAppUI() {
    const { root, refs } = buildUI([
        {
            tag: "div", // title section container
            attrs: {
                class: "title-container",
            },
            children: [
                {
                    tag: "h1",
                    content: "RIS File",
                },
                {
                    tag: "span",
                    content: "desc...",
                },
            ],
        },
        {
            tag: "div", // file selection container
            attrs: {
                class: "file-container",
            },
            children: [
                {
                    tag: "h2",
                    content: "1. Load RIS file",
                },
                {
                    tag: "label",
                    content: "Select a .ris file to load and edit:",
                },
                {
                    tag: "button",
                    content: "Open RIS file...",
                    ref: "btn_openFile",
                }
            ],
        },
        {
            tag: "div", // tag selection container
            attrs: {
                class: "tags-container",
            },
            children: [
                {
                    tag: "h2",
                    content: "2. Delete tags",
                },
                {
                    tag: "div", // text container
                    attrs: {
                        class: "tags__status",
                    },
                    children: [
                        {
                            tag: "span",
                            content: "placeholder for text...",
                        },
                    ],
                    ref: "cont_status",
                },
                {
                    tag: "div", // default actions container
                    attrs: {
                        class: "tags__defaultActions",
                    },
                    ref: "cont_defaultActions",
                },
                {
                    tag: "div", // tags editor container
                    attrs: {
                        class: "tags__editor",
                    },
                    ref: "cont_tagsEditor",
                }
            ],
        },
        {
            tag: "div", // export container
            attrs: {
                class: "export-container",
            },
            children: [
                {
                    tag: "h2",
                    content: "3. Select filename and export",
                },
                {
                    tag: "input",
                    attrs: {
                        class: "export__filename",
                        type: "text",
                        placeholder: "Export filename...",
                    },
                    ref: "input_fileName",
                },
                {
                    tag: "button",
                    attrs: {
                        class: "export__button",
                    },
                    content: "Export RIS file...",
                    ref: "btn_exportFile",
                },
            ]
        },
    ]);

    return { root, refs };
}

export function buildDefaultActionsUI(defaultActions, callback) {
    if (!Array.isArray(defaultActions)) {
        throw new Error("defaultActions not an array.");
    }
    if (typeof callback !== "function") {
        throw new Error("callback not a function.");
    }

    const { root, refs } = buildUI({
        tag: "div",
        attrs: {
            class: "default-actions__container",
        },
    });

    defaultActions.forEach((action) => {
        if (!action || typeof action.name !== "string" || typeof action.tag !== "string") {
            return;
        }

        const { root: actionButton } = buildUI({
            tag: "button",
            content: action.name,
            on: {
                click: () => callback(action.tag),
            },
        });

        root.appendChild(actionButton);
    });

    return { root, refs };
}

export function buildTagList(container, tags, tagConfig, deleteCallback) {
    if (!container) {
        throw new Error("Missing container.");
    }
    if (!(tags instanceof Map)) {
        throw new Error("tags not a Map.");
    }
    if (typeof deleteCallback !== "function") {
        throw new Error("deleteCallback not a function.");
    }

    container.replaceChildren();

    // object order
    const normalizedTagConfig = tagConfig && typeof tagConfig === "object" ? tagConfig : {};
    const configOrder = new Map(Object.keys(normalizedTagConfig).map((tag, index) => [tag, index]));

    // find display names
    const displayList = Array.from(tags.entries()).map(([tag, count]) => {
        const config = normalizedTagConfig[tag];
        const configuredName = config?.name?.trim() || tag;
        const displayClass = typeof config?.display === "string" ? config.display.trim() : "";

        return {
            tag,
            count,
            tagName: configuredName ?? tag,
            hasConfiguredName: typeof configuredName === "string",
            displayClass,
        };
    });
    
    // sorting
    displayList.sort((a, b) => {
        // named tags -> ordered by config order
        if (a.hasConfiguredName && b.hasConfiguredName) {
            return (configOrder.get(a.tag) ?? Number.MAX_SAFE_INTEGER) - (configOrder.get(b.tag) ?? Number.MAX_SAFE_INTEGER);
        }
        // named tags first
        if (a.hasConfiguredName) return -1;
        if (b.hasConfiguredName) return 1;
        // order unnamed tags a-z
        return a.tag.localeCompare(b.tag);
    });

    displayList.forEach(({ tag, count, tagName, displayClass }) => {
        const className = displayClass ? `tag ${displayClass}` : "tag";

        const { root: tagUI, refs } = buildUI({
            tag: "div",
            attrs: {
                class: className,
            },
            children: [
                {
                    tag: "span",
                    attrs: {
                        class: "tag__name",
                    },
                    content: `${tagName} (${count})`,
                },
                {
                    tag: "button",
                    attrs: {
                        class: "tag__del",
                    },
                    content: "×",
                    on: {
                        click: (event) => deleteCallback(tag, event),
                    },
                }
            ],
        });

        container.appendChild(tagUI);
    });
}

export function updateUi(refs, state) {
    if (!refs || typeof refs !== "object") {
        throw new Error("Missing refs.");
    }
    if (!state || typeof state !== "object") {
        throw new Error("Missing state.");
    }

    const loadedFile = state.loadedFile && typeof state.loadedFile === "object" ? state.loadedFile : null;
    const hasLoadedFile = !!loadedFile;
    const hasChanges = hasLoadedFile && state.hasChanges === true;

    // btn state - default actions
    if (refs.cont_defaultActions) {
        const defaultActionButtons = refs.cont_defaultActions.querySelectorAll("button");
        defaultActionButtons.forEach((button) => {
            button.disabled = !hasLoadedFile;
        });
    }

    // input state - filename
    if (refs.input_fileName) {
        refs.input_fileName.disabled = !hasLoadedFile;
        refs.input_fileName.value = hasLoadedFile ? String(loadedFile.baseName ?? "") : "";
    }

    // btn state - export
    if (refs.btn_exportFile) {
        refs.btn_exportFile.disabled = !hasChanges;
    }

    if (refs.cont_status) {
        if (hasLoadedFile) {
            const paperCount = Number.isFinite(loadedFile.paperCount) ? loadedFile.paperCount : 0;
            const uniqueTagCount = loadedFile.tags instanceof Map ? loadedFile.tags.size : 0;
            refs.cont_status.innerHTML = `Loaded <strong>${paperCount}</strong> papers and <strong>${uniqueTagCount}</strong> unique tags.`;
        } else {
            refs.cont_status.textContent = "Load a RIS file to view tags.";
        }
    }

    // delete all tags if no file loaded (unloaded)
    if (!hasLoadedFile && refs.cont_tagsEditor) {
        refs.cont_tagsEditor.replaceChildren();
    }
}

export function deleteTagUI(tags, tagName) {
    tags.tagName.ui.parentElement.removeChild(tags.tagName.ui);
}