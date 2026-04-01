-- 11: Investment system (5-hour plans with profit/loss)

-- Drop old investments table and recreate with full schema
drop table if exists public.investments cascade;

create table public.investments (
  id          text primary key default 'INV-' || upper(substr(md5(random()::text), 1, 8)),
  user_id     text not null references public.profiles(id) on delete cascade,
  amount      numeric(18,2) not null,
  profit_loss numeric(18,2),
  status      text not null default 'active' check (status in ('active', 'completed')),
  start_time  timestamptz not null default now(),
  end_time    timestamptz not null default now() + interval '5 hours',
  created_at  timestamptz not null default now()
);

-- Prevent negative balance on investment deduction
create or replace function public.check_balance_before_invest()
returns trigger language plpgsql as $$
begin
  if (select balance from public.profiles where id = new.user_id) < new.amount then
    raise exception 'Insufficient balance';
  end if;
  -- Deduct balance immediately
  update public.profiles set balance = balance - new.amount where id = new.user_id;
  return new;
end;
$$;

create trigger before_investment_insert
  before insert on public.investments
  for each row execute procedure public.check_balance_before_invest();

-- On completion: return amount + profit_loss to balance and notify
create or replace function public.complete_investment()
returns trigger language plpgsql security definer as $$
declare
  payout numeric;
begin
  if new.status = 'completed' and old.status = 'active' then
    payout := new.amount + coalesce(new.profit_loss, 0);
    update public.profiles set balance = balance + payout where id = new.user_id;
    insert into public.notifications (user_id, type, title, message)
    values (
      new.user_id,
      case when coalesce(new.profit_loss, 0) >= 0 then 'dividend' else 'alert' end,
      case when coalesce(new.profit_loss, 0) >= 0 then 'Investment Profit!' else 'Investment Loss' end,
      'Your $' || new.amount || ' investment completed. ' ||
      case when coalesce(new.profit_loss, 0) >= 0
        then 'Profit: +$' || new.profit_loss
        else 'Loss: -$' || abs(new.profit_loss)
      end || '. Returned: $' || payout
    );
  end if;
  return new;
end;
$$;

create trigger on_investment_complete
  after update of status on public.investments
  for each row execute procedure public.complete_investment();

-- RLS
alter table public.investments enable row level security;
create policy "Users can view own investments"   on public.investments for select using (auth.uid()::text = user_id);
create policy "Users can insert own investments" on public.investments for insert with check (auth.uid()::text = user_id);
create policy "Users can update own investments" on public.investments for update using (auth.uid()::text = user_id);
create policy "Admin can view all investments"   on public.investments for select using (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);
create policy "Admin can update all investments" on public.investments for update using (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);
