-- DeepStach family library: share your own books with your family only.
-- A family has an invite code; people join with the link, and only members can see and download its books.
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 80),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  invite_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  family_id uuid not null references public.families (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text check (length(name) <= 80),
  joined_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

create table if not exists public.family_books (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  owner_name text check (length(owner_name) <= 80),
  kind text not null check (kind in ('epub', 'pdf')),
  title text not null check (length(title) between 1 and 300),
  author text not null default '' check (length(author) <= 300),
  lang text check (length(lang) <= 8),
  description text check (length(description) <= 2000),
  ideas jsonb,
  ideas_by text check (ideas_by in ('ai', 'picked')),
  path text not null check (length(path) <= 200),
  size bigint,
  created_at timestamptz not null default now()
);

-- Is the signed-in person in this family? (security definer so the policies don't loop on family_members.)
create or replace function public.is_family_member(fid uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.family_members m where m.family_id = fid and m.user_id = auth.uid()); $$;
revoke all on function public.is_family_member(uuid) from public;
grant execute on function public.is_family_member(uuid) to authenticated;

-- Join a family with its invite code; returns the family's id and name.
create or replace function public.join_family(code text, member_name text)
returns table (id uuid, name text) language plpgsql security definer set search_path = ''
as $$
declare f public.families;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  select * into f from public.families where invite_code = code;
  if f.id is null then raise exception 'This invite link is not valid anymore'; end if;
  insert into public.family_members (family_id, user_id, name) values (f.id, auth.uid(), left(member_name, 80))
  on conflict (family_id, user_id) do update set name = excluded.name;
  return query select f.id, f.name;
end;
$$;
revoke all on function public.join_family(text, text) from public;
grant execute on function public.join_family(text, text) to authenticated;

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_books enable row level security;

drop policy if exists "families: members read" on public.families;
drop policy if exists "families: create" on public.families;
drop policy if exists "families: owner edits" on public.families;
drop policy if exists "families: owner deletes" on public.families;
create policy "families: members read" on public.families for select to authenticated using (owner = (select auth.uid()) or public.is_family_member(id));
create policy "families: create" on public.families for insert to authenticated with check (owner = (select auth.uid()));
create policy "families: owner edits" on public.families for update to authenticated using (owner = (select auth.uid()));
create policy "families: owner deletes" on public.families for delete to authenticated using (owner = (select auth.uid()));

drop policy if exists "members: read" on public.family_members;
drop policy if exists "members: owner adds self" on public.family_members;
drop policy if exists "members: leave" on public.family_members;
create policy "members: read" on public.family_members for select to authenticated using (public.is_family_member(family_id));
-- The family's creator adds themselves; everyone else joins through join_family().
create policy "members: owner adds self" on public.family_members for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.families f where f.id = family_id and f.owner = (select auth.uid())));
create policy "members: leave" on public.family_members for delete to authenticated
  using (user_id = (select auth.uid()) or exists (select 1 from public.families f where f.id = family_id and f.owner = (select auth.uid())));

drop policy if exists "books: members read" on public.family_books;
drop policy if exists "books: members share" on public.family_books;
drop policy if exists "books: owner removes" on public.family_books;
create policy "books: members read" on public.family_books for select to authenticated using (public.is_family_member(family_id));
create policy "books: members share" on public.family_books for insert to authenticated with check (owner = (select auth.uid()) and public.is_family_member(family_id));
create policy "books: owner removes" on public.family_books for delete to authenticated using (owner = (select auth.uid()));

-- The files: a private bucket, one folder per family; only that family's members can read or add files.
insert into storage.buckets (id, name, public, file_size_limit)
values ('family-books', 'family-books', false, 52428800)
on conflict (id) do update set public = false, file_size_limit = 52428800;

drop policy if exists "family files: members read" on storage.objects;
drop policy if exists "family files: members upload" on storage.objects;
drop policy if exists "family files: owner deletes" on storage.objects;
create policy "family files: members read" on storage.objects for select to authenticated
  using (bucket_id = 'family-books' and public.is_family_member(((storage.foldername(name))[1])::uuid));
create policy "family files: members upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'family-books' and public.is_family_member(((storage.foldername(name))[1])::uuid));
create policy "family files: owner deletes" on storage.objects for delete to authenticated
  using (bucket_id = 'family-books' and owner = (select auth.uid()));
