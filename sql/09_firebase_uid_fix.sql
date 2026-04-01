-- 09: Fix all UUID columns to TEXT to support Firebase UIDs
-- Firebase UIDs are alphanumeric strings, not UUIDs.
-- Run this in Supabase SQL editor if tables already exist.

-- ── Drop dependent view ───────────────────────────────────
drop view if exists public.admin_users_view;

-- ── Drop ALL RLS policies that reference id/user_id columns ──
drop policy if exists "Users can view own profile"    on public.profiles;
drop policy if exists "Users can update own profile"  on public.profiles;
drop policy if exists "Admin can view all profiles"   on public.profiles;
drop policy if exists "Admin can update all profiles" on public.profiles;
drop policy if exists "Allow profile upsert on signup" on public.profiles;
drop policy if exists "Admin only"                    on public.profiles;

drop policy if exists "Users can view own transactions"   on public.transactions;
drop policy if exists "Users can insert own transactions" on public.transactions;
drop policy if exists "Admin can view all transactions"   on public.transactions;
drop policy if exists "Admin can update all transactions" on public.transactions;

drop policy if exists "Users can view own notifications"   on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "Admin can insert notifications"     on public.notifications;
drop policy if exists "System can insert notifications"    on public.notifications;

drop policy if exists "Users can view own messages"   on public.chat_messages;
drop policy if exists "Users can insert own messages" on public.chat_messages;
drop policy if exists "Admin can view all messages"   on public.chat_messages;
drop policy if exists "Admin can insert as agent"     on public.chat_messages;

drop policy if exists "Users can view own investments"   on public.investments;
drop policy if exists "Users can insert own investments" on public.investments;
drop policy if exists "Admin can view all investments"   on public.investments;
drop policy if exists "Admin can update all investments" on public.investments;

drop policy if exists "Users can view own settings"   on public.user_settings;
drop policy if exists "Users can update own settings" on public.user_settings;
drop policy if exists "Users can insert own settings" on public.user_settings;

-- ── Drop FK constraints ───────────────────────────────────
alter table public.transactions  drop constraint if exists transactions_user_id_fkey;
alter table public.notifications drop constraint if exists notifications_user_id_fkey;
alter table public.chat_messages drop constraint if exists chat_messages_user_id_fkey;
alter table public.investments   drop constraint if exists investments_user_id_fkey;
alter table public.user_settings drop constraint if exists user_settings_user_id_fkey;
alter table public.user_settings drop constraint if exists user_settings_pkey;
alter table public.profiles      drop constraint if exists profiles_pkey;
alter table public.profiles      drop constraint if exists profiles_id_fkey;

-- ── Change column types ───────────────────────────────────
alter table public.profiles      alter column id      type text using id::text;
alter table public.transactions  alter column user_id type text using user_id::text;
alter table public.notifications alter column user_id type text using user_id::text;
alter table public.chat_messages alter column user_id type text using user_id::text;
alter table public.investments   alter column user_id type text using user_id::text;
alter table public.user_settings alter column user_id type text using user_id::text;

-- ── Re-add primary keys ───────────────────────────────────
alter table public.profiles      add primary key (id);
alter table public.user_settings add primary key (user_id);

-- ── Re-add FK constraints ─────────────────────────────────
alter table public.transactions  add constraint transactions_user_id_fkey  foreign key (user_id) references public.profiles(id) on delete cascade;
alter table public.notifications add constraint notifications_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;
alter table public.chat_messages add constraint chat_messages_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;
alter table public.investments   add constraint investments_user_id_fkey   foreign key (user_id) references public.profiles(id) on delete cascade;
alter table public.user_settings add constraint user_settings_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;

-- ── Recreate RLS policies (auth.uid()::text for Firebase UIDs) ──
create policy "Users can view own profile"     on public.profiles for select using (auth.uid()::text = id);
create policy "Users can update own profile"   on public.profiles for update using (auth.uid()::text = id);
create policy "Admin can view all profiles"    on public.profiles for select using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));
create policy "Admin can update all profiles"  on public.profiles for update using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));
create policy "Allow profile upsert on signup" on public.profiles for insert with check (true);

create policy "Users can view own transactions"   on public.transactions for select using (auth.uid()::text = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid()::text = user_id);
create policy "Admin can view all transactions"   on public.transactions for select using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));
create policy "Admin can update all transactions" on public.transactions for update using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));

create policy "Users can view own notifications"   on public.notifications for select using (auth.uid()::text = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid()::text = user_id);
create policy "System can insert notifications"    on public.notifications for insert with check (true);

create policy "Users can view own messages"   on public.chat_messages for select using (auth.uid()::text = user_id);
create policy "Users can insert own messages" on public.chat_messages for insert with check (auth.uid()::text = user_id);
create policy "Admin can view all messages"   on public.chat_messages for select using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));
create policy "Admin can insert as agent"     on public.chat_messages for insert with check (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));

create policy "Users can view own investments"   on public.investments for select using (auth.uid()::text = user_id);
create policy "Users can insert own investments" on public.investments for insert with check (auth.uid()::text = user_id);
create policy "Admin can view all investments"   on public.investments for select using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));
create policy "Admin can update all investments" on public.investments for update using (exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin'));

create policy "Users can view own settings"   on public.user_settings for select using (auth.uid()::text = user_id);
create policy "Users can update own settings" on public.user_settings for update using (auth.uid()::text = user_id);
create policy "Users can insert own settings" on public.user_settings for insert with check (auth.uid()::text = user_id);

-- ── Drop old auth trigger (not needed with Firebase) ─────
drop trigger if exists on_auth_user_created on auth.users;

-- ── Set admin role ────────────────────────────────────────
update public.profiles set role = 'admin' where email = 'vestorinvest017@gmail.com';

-- ── Recreate admin view ───────────────────────────────────
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
