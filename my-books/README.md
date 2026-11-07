# My books (private)

Put EPUBs or PDFs you own here, for example DRM-free books you bought, and they show up on a **🔒 My books** shelf in your copy of the app.

**Nothing in this folder is ever committed or pushed.** Git ignores everything here except this README, and the converted text goes to `src/data/my-books/`, which Git also ignores. Your books stay on this computer.

## Steps

1. Copy a DRM-free `.epub` or a `.pdf` into this folder. Any file name works. PDFs keep their original pages and open in the page-turning PDF reader.
2. In a terminal in the project folder, run:

   ```bash
   npm run books
   ```

   The title and author are read from the EPUB itself.
3. Reload the app. The book is on **Library → 🔒 My books**, marked "Personal copy".

Optional: to set the topic or a description, add a `.json` file with the same name as the EPUB:

```json
{ "topicId": "leadership", "description": "One or two sentences about the book." }
```

You can also override `title`, `author` or `year` there.

To remove a book, delete its `.epub` (and `.json`) and run `npm run books` again.

## Good to know

- **DRM-protected books** (most Kindle and Apple Books purchases) can't be opened. The script tells you which ones and skips them.
- **Personal use only:** if you build the app (for example with EAS) while books are in this folder, they're bundled into that build. Only install that build on your own devices, and don't share it.
- To find a cover, the script searches Open Library by title and author. Only the title and author are sent, never the book.
- For a book you only want on your phone, use **Library → Your books → Open your own book** in the app instead.
