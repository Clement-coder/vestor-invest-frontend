-- 02: Transactions (withdrawals + credits)
create table if not exists public.transactions (
  id           text primary key default 'VTX-' || upper(substr(md5(random()::text), 1, 8)),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  type         text not null check (type in ('Withdrawal', 'Credit', 'Deposit')),
  method       text check (method in ('bank', 'crypto', 'admin')),
  amount       numeric(18,2) not null,
  status       text not null default 'Pending' check (status in ('Pending', 'Completed', 'Failed')),
  -- bank fields
  beneficiary_name  text,
  bank_name         text,
  swift             text,
  iban              text,
  routing           text,
  -- crypto fields
  network      text,
  address      text,
  -- meta
  note         text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists transactions_updated_at on public.transactions;
create trigger transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.set_updated_at();

-- When admin credits a user, auto-create a Credit transaction
create or replace function public.handle_balance_credit()
returns trigger language plpgsql security definer as $$
begin
  if new.balance > old.balance then
    insert into public.transactions (user_id, type, method, amount, status, note)
    values (new.id, 'Credit', 'admin', new.balance - old.balance, 'Completed', 'Admin credit');
  end if;
  return new;
end;
$$;

drop trigger if exists on_balance_credit on public.profiles;
create trigger on_balance_credit
  after update of balance on public.profiles
  for each row execute procedure public.handle_balance_credit();

-- RLS
alter table public.transactions enable row level security;
create policy "Users can view own transactions"   on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Admin can view all transactions"   on public.transactions for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can update all transactions" on public.transactions for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
