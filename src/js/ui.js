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
                    children: [
                        {
                            tag: "div", // keyword example
                            attrs: {
                                class: "keyword",
                            },
                            children: [
                                {
                                    tag: "span",
                                    attrs: {
                                        class: "keyword__name",
                                    },
                                    content: "KW",
                                },
                                {
                                    tag: "button",
                                    attrs: {
                                        class: "keyword__del",
                                    },
                                    content: "×",
                                }
                            ],
                        },
                        {
                            tag: "div", // keyword example
                            attrs: {
                                class: "keyword",
                            },
                            children: [
                                {
                                    tag: "span",
                                    attrs: {
                                        class: "keyword__name",
                                    },
                                    content: "Keyword",
                                },
                                {
                                    tag: "button",
                                    attrs: {
                                        class: "keyword__del",
                                    },
                                    content: "×",
                                }
                            ],
                        },
                    ],
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