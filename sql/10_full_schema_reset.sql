-- 10: Full schema reset — drops and recreates everything with TEXT ids (Firebase UID compatible)
-- Run this once in Supabase SQL editor to overwrite any existing schema.

-- ── Drop existing tables (cascade removes FKs, triggers, policies) ────────────
drop table if exists public.user_settings  cascade;
drop table if exists public.investments    cascade;
drop table if exists public.chat_messages  cascade;
drop table if exists public.notifications  cascade;
drop table if exists public.transactions   cascade;
drop table if exists public.profiles       cascade;
drop view  if exists public.admin_users_view;

-- ── Drop existing functions ───────────────────────────────────────────────────
drop function if exists public.handle_new_user()            cascade;
drop function if exists public.set_updated_at()             cascade;
drop function if exists public.handle_balance_credit()      cascade;
drop function if exists public.notify_on_credit()           cascade;
drop function if exists public.handle_new_profile_settings() cascade;

-- ─────────────────────────────────────────────────────────────────────────────
-- 01: profiles
-- ─────────────────────────────────────────────────────────────────────────────
create table public.profiles (
  id           text primary key,
  email        text unique not null,
  full_name    text,
  avatar_url   text,
  role         text not null default 'user' check (role in ('user', 'admin')),
  balance      numeric(18,2) not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
create policy "Users can view own profile"    on public.profiles for select using (auth.uid()::text = id);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid()::text = id);
create policy "Admin can view all profiles"   on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);
create policy "Admin can update all profiles" on public.profiles for update using (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);
create policy "Allow profile upsert on signup" on public.profiles for insert with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 02: transactions
-- ─────────────────────────────────────────────────────────────────────────────
create table public.transactions (
  id                text primary key default 'VTX-' || upper(substr(md5(random()::text), 1, 8)),
  user_id           text not null references public.profiles(id) on delete cascade,
  type              text not null check (type in ('Withdrawal', 'Credit', 'Deposit')),
  method            text check (method in ('bank', 'crypto', 'admin')),
  amount            numeric(18,2) not null,
  status            text not null default 'Pending' check (status in ('Pending', 'Completed', 'Failed')),
  beneficiary_name  text,
  bank_name         text,
  swift             text,
  iban              text,
  routing           text,
  network           text,
  address           text,
  note              text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.set_updated_at();

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

create trigger on_balance_credit
  after update of balance on public.profiles
  for each row execute procedure public.handle_balance_credit();

alter table public.transactions enable row level security;
create policy "Users can view own transactions"   on public.transactions for select using (auth.uid()::text = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid()::text = user_id);
create policy "Admin can view all transactions"   on public.transactions for select using (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);
create policy "Admin can update all transactions" on public.transactions for update using (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 03: notifications
-- ─────────────────────────────────────────────────────────────────────────────
create table public.notifications (
  id         bigserial primary key,
  user_id    text not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('investment', 'dividend', 'alert', 'info', 'credit', 'withdrawal')),
  title      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "Users can view own notifications"   on public.notifications for select using (auth.uid()::text = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid()::text = user_id);
create policy "System can insert notifications"    on public.notifications for insert with check (true);

create or replace function public.notify_on_credit()
returns trigger language plpgsql security definer as $$
begin
  if new.type = 'Credit' and new.status = 'Completed' then
    insert into public.notifications (user_id, type, title, message)
    values (new.user_id, 'credit', 'Account Credited',
      'Your account has been credited with $' || new.amount::text || '. Your new balance is ready.');
  end if;
  if new.type = 'Withdrawal' and new.status = 'Completed' then
    insert into public.notifications (user_id, type, title, message)
    values (new.user_id, 'withdrawal', 'Withdrawal Processed',
      'Your withdrawal of $' || new.amount::text || ' has been processed successfully.');
  end if;
  return new;
end;
$$;

create trigger on_transaction_notify
  after insert or update of status on public.transactions
  for each row execute procedure public.notify_on_credit();

-- ─────────────────────────────────────────────────────────────────────────────
-- 04: chat_messages
-- ─────────────────────────────────────────────────────────────────────────────
create table public.chat_messages (
  id         bigserial primary key,
  user_id    text not null references public.profiles(id) on delete cascade,
  role       text not null check (role in ('user', 'agent')),
  text       text,
  image_url  text,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;
create policy "Users can view own messages"   on public.chat_messages for select using (auth.uid()::text = user_id);
create policy "Users can insert own messages" on public.chat_messages for insert with check (auth.uid()::text = user_id);
create policy "Admin can view all messages"   on public.chat_messages for select using (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);
create policy "Admin can insert as agent"     on public.chat_messages for insert with check (
  exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 05: investments
-- ─────────────────────────────────────────────────────────────────────────────
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

-- Deduct balance on insert, block if insufficient
create or replace function public.check_balance_before_invest()
returns trigger language plpgsql as $$
begin
  if (select balance from public.profiles where id = new.user_id) < new.amount then
    raise exception 'Insufficient balance';
  end if;
  update public.profiles set balance = balance - new.amount where id = new.user_id;
  return new;
end;
$$;

create trigger before_investment_insert
  before insert on public.investments
  for each row execute procedure public.check_balance_before_invest();

-- Return payout + notify on completion
create or replace function public.complete_investment()
returns trigger language plpgsql security definer as $$
declare payout numeric;
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

alter table public.investments enable row level security;
create policy "Users can view own investments"   on public.investments for select using (auth.uid()::text = user_id);
create policy "Users can insert own investments" on public.investments for insert with check (auth.uid()::text = user_id);
create policy "Users can update own investments" on public.investments for update using (auth.uid()::text = user_id);
create policy "Admin can view all investments"   on public.investments for select using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));
create policy "Admin can update all investments" on public.investments for update using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 06: user_settings
-- ─────────────────────────────────────────────────────────────────────────────
create table public.user_settings (
  user_id                  text primary key references public.profiles(id) on delete cascade,
  currency                 text not null default 'USD',
  language                 text not null default 'en',
  theme                    text not null default 'dark',
  notif_email              boolean not null default true,
  notif_push               boolean not null default true,
  notif_sms                boolean not null default false,
  notif_marketing          boolean not null default false,
  security_2fa             boolean not null default false,
  security_login_alerts    boolean not null default true,
  security_session_timeout boolean not null default true,
  updated_at               timestamptz not null default now()
);

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_profile_settings()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_settings (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_profile_created_settings
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile_settings();

alter table public.user_settings enable row level security;
create policy "Users can view own settings"   on public.user_settings for select using (auth.uid()::text = user_id);
create policy "Users can update own settings" on public.user_settings for update using (auth.uid()::text = user_id);
create policy "Users can insert own settings" on public.user_settings for insert with check (auth.uid()::text = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 07: storage + admin view
-- ─────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict do nothing;

drop policy if exists "Authenticated users can upload chat images" on storage.objects;
drop policy if exists "Anyone can view chat images" on storage.objects;

create policy "Authenticated users can upload chat images"
  on storage.objects for insert
  with check (bucket_id = 'chat-images' and auth.role() = 'authenticated');

create policy "Anyone can view chat images"
  on storage.objects for select
  using (bucket_id = 'chat-images');

create or replace view public.admin_users_view as
select
  p.id, p.email, p.full_name, p.role, p.balance, p.created_at,
  count(t.id) filter (where t.status = 'Pending')  as pending_withdrawals,
  count(t.id) filter (where t.type = 'Withdrawal') as total_withdrawals,
  count(m.id)                                       as total_messages
from public.profiles p
left join public.transactions t  on t.user_id = p.id
left join public.chat_messages m on m.user_id = p.id and m.role = 'user'
group by p.id;

-- ─────────────────────────────────────────────────────────────────────────────
-- 08: Set admin role
-- ─────────────────────────────────────────────────────────────────────────────
update public.profiles set role = 'admin' where email = 'vestorinvest017@gmail.com';
