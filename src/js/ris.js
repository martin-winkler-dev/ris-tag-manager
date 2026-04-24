// RIS parsing and tag-delete

export function parseFile(fileContent) {
    if (!fileContent) {
        throw new Error("Missing file content.");
    }

    const tags = { kw: {count: 3 } };

    return {
        paperCount: 0,
        tags: tags,
    }
}

export function deleteTag(fileContent, tag) {
    if (!fileContent) {
        throw new Error("Missing file content.");
    }
    if (!tag) {
        throw new Error("Missing tag.");
    }

    return fileContent;
}