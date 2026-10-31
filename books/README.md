# Add your own EPUBs to the app

Books in this folder are turned into full books on the **Free classics** shelf in the Library, so everyone using the app can read them.

> **This repository is public. Anyone can download what's in it.**
> Only add books that are free to share: **public domain** or released under a **Creative Commons** license.
> Never add books you bought (their licenses don't allow sharing copies) or pirated books.
> To read a book you own, use **Library → Your books → Open your own book** in the app instead. The file stays on your device.

Good sources of free-to-share EPUBs:

- [Standard Ebooks](https://standardebooks.org): carefully edited public-domain classics (CC0)
- [Project Gutenberg](https://www.gutenberg.org): tens of thousands of public-domain books
- Authors who release books under Creative Commons, such as Cory Doctorow ([craphound.com](https://craphound.com))

## Steps

1. Download a DRM-free EPUB from one of those sites and put it in this folder, for example `books/meditations-long.epub`. Use a short, lowercase, hyphenated file name: it becomes the book's id.
2. Next to it, create a JSON file with **the same name**, for example `books/meditations-long.json`:

   ```json
   {
     "title": "Meditations",
     "author": "Marcus Aurelius",
     "translator": "George Long",
     "year": 180,
     "topicId": "philosophy",
     "description": "One or two sentences about the book.",
     "license": "Public domain",
     "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
     "source": "https://standardebooks.org/ebooks/marcus-aurelius/meditations/george-long"
   }
   ```

   - `license` is **required**: `"Public domain"`, or the exact Creative Commons license, like `"CC BY-SA 4.0"`.
   - `source` is **required**: the page you downloaded it from.
   - `topicId` is one of: `productivity`, `psychology`, `philosophy`, `mindfulness`, `money`, `health`, `creativity`, `leadership`, `business`, `communication`, `relationships`, `science`, `history`, `career`, `poetry`.
   - `translator`, `licenseUrl` and `year` are optional (use a negative year for BC).

3. In a terminal in the project folder, run:

   ```bash
   npm run books
   ```

   This checks every book, converts it into the app's format in `src/data/classics/`, and looks up a cover on Open Library. A book without a sidecar JSON, a license or a source is refused with an error.

4. Reload the app. The book appears on **Library → Free classics**, with its license shown on its page.
5. Commit and push the `.epub`, the `.json` and the changed files in `src/data/classics/`.

To remove a book, delete its `.epub` and `.json` and run `npm run books` again.

Needs Node.js 22.18 or newer (the script reuses the app's own EPUB reader, `src/lib/epub.ts`).
