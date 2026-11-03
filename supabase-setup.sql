-- TPS Notes cloud sync: run this once in Supabase > SQL Editor > New query > Run
create table if not exists public.tps_kv (
  user_id    uuid   not null default auth.uid() references auth.users(id) on delete cascade,
  key        text   not null,
  value      text   not null,
  updated_at bigint not null,
  primary key (user_id, key)
);

alter table public.tps_kv enable row level security;

-- Each signed-in user can only see and change their own rows
create policy "tps own read"   on public.tps_kv for select using (auth.uid() = user_id);
create policy "tps own insert" on public.tps_kv for insert with check (auth.uid() = user_id);
create policy "tps own update" on public.tps_kv for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tps own delete" on public.tps_kv for delete using (auth.uid() = user_id);
