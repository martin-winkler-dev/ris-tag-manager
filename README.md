# RIS Tag Manager

A browser-based RIS file tag manager for deleting unwanted tags, especially keywords.

This tool loads a `.ris` file, shows all tags, and lets you delete selected tags before exporting the cleaned file.

## How to Use

1. Download `build/index.html`.
2. Open `index.html` in a browser.
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

1. Rename all tags that should be kept to start with "#" (eg "KW" -> "#KW")
2. Zotero ► `Tools` ► `Developer` ► `Run JavaScript`
3. Paste code from below.
4. `run`
5. Wait for response.

```
var items = await Zotero.Items.getAll(Zotero.Libraries.userLibraryID, true, false);
var count = 0;

for (let item of items) {
    if (!item.isRegularItem() || item.deleted) continue;
    
    let tags = item.getTags();
    let tagsChanged = false;

    for (let tagObj of tags) {
        let tagName = tagObj.tag;
        
        if (!tagName.trim().startsWith('#')) {
            item.removeTag(tagName);
            tagsChanged = true;
            count++;
        }
    }
    
    if (tagsChanged) {
        item.saveTx();
    }
}
return count + " tags deleted.";
```

## Development

Requires [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) to build the project.

### Bun

```bash
bun install
bun run build
```

### Node.js

```
npm install
node build.mjs
```

The compiled artifact will be generated at `build/index.html`.

---

by [Martin Winkler](https://github.com/martin-winkler-dev)