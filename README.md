# RIS Tag Sanitizer

A **browser-based RIS citation files sanitizer** — remove unwanted metadata tags.

This tool loads a `.ris` file, shows all tags, and lets you delete selected tags before exporting the sanitized file.

## How to Use

1. Open or Download
    * 🚀 **[Open Web-App↗](https://martin-winkler-dev.github.io/ris-tag-sanitizer/)**.
    * 💾 **[Download latest](https://github.com/martin-winkler-dev/ris-tag-sanitizer/releases/latest/download/index.html)** *(from [release](https://github.com/martin-winkler-dev/ris-tag-sanitizer/releases/latest))* and open `index.html` in a browser.
3. Click **Open RIS file** and select a `.ris` file.
4. Delete unwanted tags.
5. Select an export filename and click **Export RIS file**.

## Why to Use

E.g. Zotero treats all keywords from imported RIS files as manual keywords, ignoring settings for automatic keywords.

### Zotero: Delete Tags

* Will remove all Keyword-Tags that **don't start with '#'** from all items in your Zotero library.
    * Will delete: 'tag'
    * Will NOT delete: '#tag'
    * Will NOT affect deleted items.

1. Rename all tags that should be kept to start with "#" (e.g. "KW" ➩ "#KW")
2. Zotero ► `Tools` ► `Developer` ► `Run JavaScript`
3. Paste code from below.
4. `run`
5. Wait for completion.

```js
// === START ===
// Get all items in Zotero library (asArray=true, includeDeleted=false)
var items = await Zotero.Items.getAll(Zotero.Libraries.userLibraryID, true, false);
var count = 0;

// Iterate through all items
for (let item of items) {
    // Skip non-regular items (notes, attachments...)
    if (!item.isRegularItem()) continue;
    
    // Get all tags for each item
    let tags = item.getTags();
    let tagsChanged = false;

    // Iterate through all tags
    for (let tagObj of tags) {
        let tagName = tagObj.tag;
        
        // Remove tag if it doesn't start with '#'
        if (!tagName.trim().startsWith('#')) {
            item.removeTag(tagName);
            tagsChanged = true;
            count++;
        }
    }
    
    // Save changes if any tags were removed
    if (tagsChanged) {
        item.saveTx();
    }
}

// Print final count of deleted tags
return 'Finished: ' + count + ' tags deleted.';
// === END ===
```

## Development

Requires [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) to build the project.

### Bun

```bash
bun install
bun run build
```

### Node.js

```bash
npm install
node build.mjs
```

The compiled artifact will be generated at `build/index.html`.

---

by [Martin Winkler](https://github.com/martin-winkler-dev)