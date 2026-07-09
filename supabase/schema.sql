-- ============================================================
-- TikLive — schéma de base de données Supabase
-- À exécuter dans le SQL Editor de ton projet Supabase.
-- ============================================================

-- ---------- Profils ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  handle text unique not null check (handle ~ '^[a-z0-9._]{2,24}$'),
  name text not null default 'Utilisateur',
  bio text not null default '',
  gradient int not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Publications ----------
-- id en texte pour rester compatible avec les identifiants de contenu de démo.
create table if not exists public.posts (
  id text primary key default gen_random_uuid()::text,
  author uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('video', 'photo')),
  src text not null,
  poster text,
  caption text not null default '',
  hashtags text[] not null default '{}',
  music text,
  created_at timestamptz not null default now()
);

-- ---------- Commentaires ----------
-- post_id en texte : peut viser une vraie publication OU un contenu de démo (p1, p2…).
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  author uuid not null references public.profiles(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 300),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id);

-- ---------- J'aime ----------
create table if not exists public.likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create index if not exists likes_post_idx on public.likes (post_id);

-- ---------- Favoris ----------
create table if not exists public.saves (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- ---------- Abonnements ----------
-- followee_handle en texte : peut viser un vrai compte OU un créateur de démo.
create table if not exists public.follows (
  follower uuid not null references public.profiles(id) on delete cascade,
  followee_handle text not null,
  created_at timestamptz not null default now(),
  primary key (follower, followee_handle)
);
create index if not exists follows_followee_idx on public.follows (followee_handle);

-- ---------- Messages privés ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null references public.profiles(id) on delete cascade,
  sender_handle text not null,
  recipient_handle text not null,
  text text not null check (char_length(text) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists messages_recipient_idx on public.messages (recipient_handle);
create index if not exists messages_sender_idx on public.messages (sender);

-- ============================================================
-- Sécurité (Row Level Security)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.saves enable row level security;
alter table public.follows enable row level security;
alter table public.messages enable row level security;

-- Profils : lisibles par tous, modifiables par leur propriétaire.
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Publications : lisibles par tous, gérées par leur auteur.
create policy "posts_select" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = author);
create policy "posts_delete" on public.posts for delete using (auth.uid() = author);

-- Commentaires : lisibles par tous, écrits par leur auteur,
-- supprimables par leur auteur.
create policy "comments_select" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = author);
create policy "comments_delete" on public.comments for delete using (auth.uid() = author);

-- J'aime / favoris / abonnements : chacun gère les siens, lecture publique
-- (nécessaire pour afficher les compteurs).
create policy "likes_select" on public.likes for select using (true);
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

create policy "saves_select" on public.saves for select using (auth.uid() = user_id);
create policy "saves_insert" on public.saves for insert with check (auth.uid() = user_id);
create policy "saves_delete" on public.saves for delete using (auth.uid() = user_id);

create policy "follows_select" on public.follows for select using (true);
create policy "follows_insert" on public.follows for insert with check (auth.uid() = follower);
create policy "follows_delete" on public.follows for delete using (auth.uid() = follower);

-- Messages : visibles uniquement par l'expéditeur et le destinataire.
create policy "messages_select" on public.messages for select using (
  sender = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.handle = recipient_handle
  )
);
create policy "messages_insert" on public.messages for insert with check (
  sender = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.handle = sender_handle
  )
);

-- ============================================================
-- Stockage des médias (photos publiées)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_read" on storage.objects for select
  using (bucket_id = 'media');
create policy "media_upload" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "media_delete" on storage.objects for delete
  using (bucket_id = 'media' and auth.uid() = owner);
