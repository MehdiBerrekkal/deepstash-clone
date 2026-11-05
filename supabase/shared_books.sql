-- DeepStach shared books: when you share one of your own books, its main-idea cards (AI-written summaries, never the
-- book's own text or file) are saved here under a random code, and the link /shared/<code> opens them.
create table if not exists public.shared_books (
  code text primary key check (code ~ '^[A-Za-z0-9]{10,16}$'),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (length(title) between 1 and 300),
  author text not null default '' check (length(author) <= 300),
  lang text check (length(lang) <= 8),
  description text check (length(description) <= 2000),
  sender text check (length(sender) <= 80),
  ideas jsonb not null check (jsonb_typeof(ideas) = 'array' and jsonb_array_length(ideas) between 1 and 40 and length(ideas::text) < 60000),
  created_at timestamptz not null default now()
);

alter table public.shared_books enable row level security;

-- Signed-in people share their own books and can take a share back. Nobody can list the table.
drop policy if exists "shared: insert own" on public.shared_books;
drop policy if exists "shared: read own" on public.shared_books;
drop policy if exists "shared: delete own" on public.shared_books;
create policy "shared: insert own" on public.shared_books for insert to authenticated with check ((select auth.uid()) = owner);
create policy "shared: read own" on public.shared_books for select to authenticated using ((select auth.uid()) = owner);
create policy "shared: delete own" on public.shared_books for delete to authenticated using ((select auth.uid()) = owner);

-- Anyone with the link reads one share by its code.
create or replace function public.get_shared_book(share_code text)
returns table (code text, title text, author text, lang text, description text, sender text, ideas jsonb, created_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select s.code, s.title, s.author, s.lang, s.description, s.sender, s.ideas, s.created_at
  from public.shared_books s where s.code = share_code;
$$;
revoke all on function public.get_shared_book(text) from public;
grant execute on function public.get_shared_book(text) to anon, authenticated;
