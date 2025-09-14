
create table if not exists public.nodes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.edges (
  id uuid primary key default gen_random_uuid(),
  from_id uuid references public.nodes(id) on delete cascade,
  to_text text not null,
  reason text,
  safe_level text default 'safe',
  created_at timestamptz default now(),
  unique (from_id, to_text)
);

create table if not exists public.answers_stats (
  id bigserial primary key,
  target_id uuid references public.nodes(id) on delete cascade,
  answer_norm text not null,
  canonical_node_id uuid references public.nodes(id),
  uses bigint default 0,
  last_used_at timestamptz,
  unique (target_id, answer_norm)
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  handle text unique,
  created_at timestamptz default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  mode text default 'endless',
  started_at timestamptz default now(),
  finished_at timestamptz,
  total_score int default 0,
  chain_len int default 0
);

create table if not exists public.moves (
  id bigserial primary key,
  game_id uuid references public.games(id) on delete cascade,
  step int not null,
  target_id uuid references public.nodes(id),
  answer_text text not null,
  is_valid boolean not null,
  score int default 0,
  time_ms int,
  created_at timestamptz default now()
);

create index if not exists idx_ans_stats_target_answer on public.answers_stats(target_id, answer_norm);
create index if not exists idx_edges_from_to on public.edges(from_id, to_text);

alter table public.games enable row level security;
create policy p_games_read on public.games for select using (true);
create policy p_games_insert on public.games for insert with check (true);

alter table public.moves enable row level security;
create policy p_moves_read on public.moves for select using (true);
create policy p_moves_insert on public.moves for insert with check (true);
