# Deepstash-style idea feed

A bite-sized learning app: full-screen idea cards from books and articles that you swipe through vertically, a feed built from the topics you follow, and stashes to save the ideas you want to keep.

Built with Expo (React Native + Expo Router), so the same code runs on iOS, Android and the web, with Supabase as the backend.

## What works today

- **Onboarding:** pick at least 3 of 15 topics; they decide the order of your feed.
- **For you feed:** full-screen cards that snap one per swipe, shuffled daily, with unread cards first. Filter by card type: book ideas, quotes, poems or "Did you know?" knowledge cards.
- **Library:** 82 books and articles on shelves by topic, with real covers from Open Library, search, "Continue reading", "Want to read" and "Finished".
- **Book pages and reader:** each book has a description, its key ideas and a read time. The reader swipes through the ideas with a progress bar, remembers where you stopped and ends with a finish page.
- **Topic pages:** every book and card in a topic, with follow and unfollow.
- **Stashes:** save any card into "Saved" or your own stashes, create and delete stashes.
- **Explore:** search everything (ideas, quotes, poems, books, authors), filter by type, browse topics.
- **You:** daily reading goal, streak, cards read, books finished, likes and stashes.
- **Like and share** any card.

Content: about 370 book and article ideas, 90 quotes, 32 full poems and 66 knowledge cards. Every idea and knowledge card is an original summary. Quotes are short and attributed. All the poems were published before 1929 and are in the public domain.

Followed topics, stashes, likes and reading progress are stored on the device. The book ideas come from Supabase when it's configured, otherwise from the bundled files in `src/data/`.

## Run it

```bash
npm install
npx expo start        # press w for web, or scan the QR code with Expo Go
```

## Connect Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Copy `.env.example` to `.env.local` and fill in your project URL and anon key.
4. Restart `npx expo start`.

To add or edit books, change `src/data/library/<topic>.json` and run `npm run seed:sql` to regenerate `supabase/seed.sql`. Run `node scripts/fetch-covers.js` to look up covers for new books. Quotes, poems and knowledge cards live in `src/data/quotes.json`, `poems.json` and `facts.json`.

## Project layout

```
src/app/            screens (Expo Router: each file is a route)
  (tabs)/           For you, Library, Explore, Stashes, You
  onboarding.tsx    topic picker
  book/[id].tsx     book page: description, key ideas, start/continue
  read/[id].tsx     swipeable book reader with progress
  topic/[id].tsx    books and cards in one topic
  idea/[id].tsx     card detail + add to stash
  stash/[id].tsx    cards in one stash
src/components/     IdeaCard, CardBody, BookCover, Shelf, BookGrid, KindFilter, IdeaRow, TopicChip
src/lib/            store (state + persistence), Supabase client, types, theme
src/data/           library/ (books by topic), quotes, poems, facts, covers, content.ts (loader)
scripts/            seed SQL generator, Open Library cover lookup
supabase/           database schema and seed
```

## Next steps

- Sign-in with Supabase Auth, syncing followed topics and stashes to the `user_topics`, `stashes` and `stash_items` tables
- Public stashes and following other readers
- Turning an article link into idea cards with AI
- Offline reading and a paid tier
