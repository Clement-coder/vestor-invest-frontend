-- 05: Investments (active plans per user)
create table if not exists public.investments (
  id         bigserial primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  plan       text not null check (plan in ('starter', 'growth', 'premium', 'exclusive')),
  amount     numeric(18,2) not null,
  apy        numeric(5,2) not null,
  status     text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists investments_updated_at on public.investments;
create trigger investments_updated_at
  before update on public.investments
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.investments enable row level security;
create policy "Users can view own investments"   on public.investments for select using (auth.uid() = user_id);
create policy "Users can insert own investments" on public.investments for insert with check (auth.uid() = user_id);
create policy "Admin can view all investments"   on public.investments for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can update all investments" on public.investments for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
