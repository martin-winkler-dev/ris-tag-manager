// RIS parsing and tag-delete

export function parseFile(fileContent) {
    if (typeof fileContent !== "string") {
        throw new Error("Missing file content.");
    }

    const normalizedContent = fileContent.replace(/\r\n/g, "\n");
    const lines = normalizedContent.split("\n");

    const tags = new Map();
    let paperCount = 0;
    let insideRecord = false;

    for (const line of lines) {
        const match = matchRisTagLine(line);

        if (!match) {
            continue;
        }

        const tag = match[1].toUpperCase();

        if (tag === "TY") {
            insideRecord = true;
            continue;
        }

        if (!insideRecord) {
            continue;
        }

        if (tag === "ER") {
            paperCount += 1;
            insideRecord = false;
            continue;
        }

        const currentCount = tags.get(tag) ?? 0;
        tags.set(tag, currentCount + 1);
    }

    return {
        paperCount,
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

    if (normalizedTag === "TY" || normalizedTag === "ER") {
        return fileContent;
    }

    const lines = fileContent.replace(/\r\n/g, "\n").split("\n");
    const keptLines = [];
    let insideRecord = false;
    let skippingCurrentTagBlock = false;

    for (const line of lines) {
        const tagLineMatch = matchRisTagLine(line);

        if (tagLineMatch) {
            const currentTag = tagLineMatch[1].toUpperCase();

            if (currentTag === "TY") {
                insideRecord = true;
                skippingCurrentTagBlock = false;
                keptLines.push(line);
                continue;
            }

            if (currentTag === "ER") {
                insideRecord = false;
                skippingCurrentTagBlock = false;
                keptLines.push(line);
                continue;
            }

            if (!insideRecord) {
                skippingCurrentTagBlock = false;
                keptLines.push(line);
                continue;
            }

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