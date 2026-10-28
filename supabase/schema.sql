-- Content: readable by everyone, written by admins (service role) only.
create table if not exists topics (
  id text primary key,
  name text not null,
  emoji text not null default '',
  color text not null default '#1A1D24'
);

create table if not exists sources (
  id text primary key,
  title text not null,
  author text not null,
  kind text not null check (kind in ('book', 'article', 'podcast', 'video')),
  url text
);

create table if not exists ideas (
  id text primary key,
  topic_id text not null references topics (id),
  source_id text not null references sources (id),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists ideas_topic_id_idx on ideas (topic_id);

-- Per-user data, for when sign-in is added. Each user only sees their own rows.
create table if not exists user_topics (
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null references topics (id) on delete cascade,
  primary key (user_id, topic_id)
);

create table if not exists stashes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists stash_items (
  stash_id uuid not null references stashes (id) on delete cascade,
  idea_id text not null references ideas (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (stash_id, idea_id)
);

alter table topics enable row level security;
alter table sources enable row level security;
alter table ideas enable row level security;
alter table user_topics enable row level security;
alter table stashes enable row level security;
alter table stash_items enable row level security;

create policy "content is public" on topics for select using (true);
create policy "content is public" on sources for select using (true);
create policy "content is public" on ideas for select using (true);

create policy "own topics" on user_topics for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own or public stashes" on stashes for select
  using (auth.uid() = user_id or is_public);
create policy "own stashes" on stashes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "items of visible stashes" on stash_items for select
  using (exists (select 1 from stashes s where s.id = stash_id and (s.user_id = auth.uid() or s.is_public)));
create policy "items of own stashes" on stash_items for all
  using (exists (select 1 from stashes s where s.id = stash_id and s.user_id = auth.uid()))
  with check (exists (select 1 from stashes s where s.id = stash_id and s.user_id = auth.uid()));
