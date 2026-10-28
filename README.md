# Deepstash-style idea feed

A bite-sized learning app: full-screen idea cards from books and articles that you swipe through vertically, a feed built from the topics you follow, and stashes to save the ideas you want to keep.

Built with Expo (React Native + Expo Router), so the same code runs on iOS, Android and the web, with Supabase as the backend.

## What works today

- **Onboarding:** pick at least 3 topics; they decide the order of your feed.
- **For you feed:** full-screen cards that snap one per swipe, each showing its topic and source (book, article, podcast, video).
- **Stashes:** save any idea into "Saved" or your own stashes, create and delete stashes.
- **Explore:** search ideas, sources and authors, filter by topic.
- **Daily streak:** counts consecutive days you open the app.
- **Share:** share an idea through the system share sheet.

Followed topics, stashes and the streak are stored on the device. The ideas come from Supabase when it's configured, otherwise from the bundled `src/data/seed.json`.

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

To add or edit ideas, change `src/data/seed.json` and run `npm run seed:sql` to regenerate `supabase/seed.sql`.

## Project layout

```
src/app/            screens (Expo Router: each file is a route)
  (tabs)/           For you feed, Explore, Stashes
  onboarding.tsx    topic picker
  idea/[id].tsx     idea detail + add to stash
  stash/[id].tsx    ideas in one stash
src/components/     IdeaCard, IdeaRow, TopicChip
src/lib/            store (state + persistence), Supabase client, types, theme
src/data/seed.json  starter topics, sources and ideas
supabase/           database schema and seed
```

## Next steps

- Sign-in with Supabase Auth, syncing followed topics and stashes to the `user_topics`, `stashes` and `stash_items` tables
- Public stashes and following other readers
- Turning an article link into idea cards with AI
- Offline reading and a paid tier
