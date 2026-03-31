-- 04: Chat messages (contact agent)
create table if not exists public.chat_messages (
  id         bigserial primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       text not null check (role in ('user', 'agent')),
  text       text,
  image_url  text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.chat_messages enable row level security;
create policy "Users can view own messages"   on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own messages" on public.chat_messages for insert with check (auth.uid() = user_id);
create policy "Admin can view all messages"   on public.chat_messages for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can insert as agent"     on public.chat_messages for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
