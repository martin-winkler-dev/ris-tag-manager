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

export function buildAppUI(appContainer) {
    const { root, refs } = buildUI([
        {
            tag: "h1",
            content: "RIS File",
        }
    ]);

    return { root, refs };
}
