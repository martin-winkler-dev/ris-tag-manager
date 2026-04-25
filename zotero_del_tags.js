/*
 * Delete all Tags from Zotero items that dont start with "#".
 * Rename all tags that should be kept to start with "#" (eg "KW" -> "#KW")
 * Zotero -> Tool -> Dev -> Run JS
 * Paste js from below; run; wait for response.
 */

var items = await Zotero.Items.getAll(Zotero.Libraries.userLibraryID, true, false);
var count = 0;

for (let item of items) {
    if (!item.isRegularItem()) continue; 
    let tags = item.getTags();
    let tagsChanged = false;

    for (let i = tags.length - 1; i >= 0; i--) {
        let tag = tags[i].tag;
        if (!tag.startsWith('#')) {
            item.removeTag(tag);
            tagsChanged = true;
            count++;
        }
    }
    if (tagsChanged) {
        await item.saveTx();
    }
}
return count + " tags deleted.";