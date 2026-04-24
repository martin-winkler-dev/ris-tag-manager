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
            tag: "h1",
            content: "RIS File",
        },
        {
            tag: "div", // file selection container
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
            children: [
                {
                    tag: "h2",
                    content: "2. Delete tags",
                },
                {
                    tag: "div", // text container
                    children: [
                        {
                            tag: "span",
                            content: "No file loaded.",
                        },
                    ],
                    ref: "cont_status",
                },
                {
                    tag: "div", // default actions container
                    ref: "cont_defaultActions",
                },
                {
                    tag: "div", // unknown tags container
                    ref: "cont_unknownTags",
                }
            ],
        },
        {
            tag: "div", // export container
            children: [
                {
                    tag: "h2",
                    content: "3. Select filename and export",
                },
                {
                    tag: "input",
                    attrs: {
                        type: "text",
                        id: "fileNameInput",
                        placeholder: "Export filename...",
                    },
                    ref: "input_fileName",
                },
                {
                    tag: "button",
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