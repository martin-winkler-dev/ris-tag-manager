// RIS parsing and tag-delete

export function parseFile(fileContent) {
    if (typeof fileContent !== "string") {
        throw new Error("Missing file content.");
    }

    const normalizedContent = fileContent.replace(/\r\n/g, "\n");
    const paperBlocks = normalizedContent
        .split(/\n\s*\n+/)
        .map((block) => block.trim())
        .filter(Boolean);

    const tags = new Map();

    for (const line of normalizedContent.split("\n")) {
        const match = matchRisTagLine(line);

        if (!match) {
            continue;
        }

        const tag = match[1].toUpperCase();
        const currentCount = tags.get(tag) ?? 0;
        tags.set(tag, currentCount + 1);
    }

    return {
        paperCount: paperBlocks.length,
        uniqueTagCount: tags.size,
        tags,
    };
}

export function deleteTag(fileContent, tag) {
    if (typeof fileContent !== "string") {
        throw new Error("Missing file content.");
    }
    if (typeof tag !== "string" || !tag.trim()) {
        throw new Error("Missing tag.");
    }

    const normalizedTag = tag.trim().toUpperCase();
    const lines = fileContent.replace(/\r\n/g, "\n").split("\n");
    const keptLines = [];
    let skippingCurrentTagBlock = false;

    for (const line of lines) {
        const tagLineMatch = matchRisTagLine(line);

        if (tagLineMatch) {
            const currentTag = tagLineMatch[1].toUpperCase();

            if (currentTag === normalizedTag) {
                skippingCurrentTagBlock = true;
                continue;
            }

            skippingCurrentTagBlock = false;
            keptLines.push(line);
            continue;
        }

        if (skippingCurrentTagBlock) {
            continue;
        }

        keptLines.push(line);
    }

    return keptLines.join("\n").replace(/(?:\n){3,}/g, "\n\n");
}

function matchRisTagLine(line) {
    if (typeof line !== "string") {
        return null;
    }
    
    // Only treat true RIS header lines as tags: they must start at column 1.
    // Continuation lines in the abstract often contain "word - text" and are not tags.
    return line.match(/^([A-Z0-9]{2,5})\s*-\s*(.*)$/);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}