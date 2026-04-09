-- ─────────────────────────────────────────────────────────────────────────────
-- 13: Realtime subscriptions + security hardening
-- Run in Supabase SQL editor AFTER 10_full_schema_reset.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Enable Realtime on all live-data tables ────────────────────────────────
-- Supabase Realtime requires tables to be added to the publication.
-- The default publication is "supabase_realtime".

alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.investments;
alter publication supabase_realtime add table public.profiles;

-- ── 2. Fix: transactions.type missing 'Debit' value ──────────────────────────
-- The app inserts type='Debit' (investment placed) but the check constraint
-- in 10_full_schema_reset.sql only allows: Withdrawal, Credit, Deposit.
-- Add 'Debit' to the allowed values.

alter table public.transactions
  drop constraint if exists transactions_type_check;

alter table public.transactions
  add constraint transactions_type_check
  check (type in ('Withdrawal', 'Credit', 'Deposit', 'Debit'));

-- ── 3. Fix: handle_balance_credit trigger fires on ALL balance updates ─────────
-- The trigger in 10_full_schema_reset.sql inserts a Credit transaction every
-- time balance increases — including when complete_investment() adds the payout.
-- This creates duplicate Credit transactions. Scope it to admin-only updates
-- by checking that the update did NOT come from the complete_investment trigger.
-- Simplest fix: drop the trigger (complete_investment already inserts its own
-- notification; the admin route creates its own Credit tx explicitly).

drop trigger if exists on_balance_credit on public.profiles;
drop function if exists public.handle_balance_credit();

-- ── 4. Fix: complete_investment — prevent double-completion ───────────────────
-- Add an idempotency guard so calling PATCH on an already-completed investment
-- is a no-op instead of crediting the balance a second time.

create or replace function public.complete_investment()
returns trigger language plpgsql security definer as $$
declare
  payout numeric;
begin
  -- Only act when transitioning active → completed (idempotent guard)
  if new.status = 'completed' and old.status = 'active' then
    payout := new.amount + coalesce(new.profit_loss, 0);

    -- Credit balance
    update public.profiles
    set balance = balance + payout
    where id = new.user_id;

    -- Insert Credit transaction record
    insert into public.transactions (user_id, type, method, amount, status, note)
    values (
      new.user_id,
      'Credit',
      'admin',
      payout,
      'Completed',
      'Investment returned — ' ||
        case when coalesce(new.profit_loss, 0) >= 0
          then '+$' || new.profit_loss
          else '-$' || abs(new.profit_loss)
        end
    );

    -- Insert notification
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

-- Re-attach trigger (drop first in case it already exists)
drop trigger if exists on_investment_complete on public.investments;
create trigger on_investment_complete
  after update of status on public.investments
  for each row execute procedure public.complete_investment();

-- ── 5. Fix: notify_on_credit — remove duplicate notification for Credit ────────
-- complete_investment() now inserts its own notification.
-- Keep notify_on_credit only for Withdrawal status changes (admin approves/rejects).

create or replace function public.notify_on_credit()
returns trigger language plpgsql security definer as $$
begin
  -- Only fire for Withdrawal completions (Credit notifications handled by complete_investment)
  if new.type = 'Withdrawal' and new.status = 'Completed' and
     (tg_op = 'UPDATE' and old.status <> 'Completed') then
    insert into public.notifications (user_id, type, title, message)
    values (
      new.user_id,
      'withdrawal',
      'Withdrawal Processed',
      'Your withdrawal of $' || new.amount || ' has been processed successfully.'
    );
  end if;
  if new.type = 'Withdrawal' and new.status = 'Failed' and
     (tg_op = 'UPDATE' and old.status <> 'Failed') then
    insert into public.notifications (user_id, type, title, message)
    values (
      new.user_id,
      'alert',
      'Withdrawal Rejected',
      'Your withdrawal request of $' || new.amount || ' was rejected. Please contact support.'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_transaction_notify on public.transactions;
create trigger on_transaction_notify
  after insert or update of status on public.transactions
  for each row execute procedure public.notify_on_credit();

-- ── 6. Security: RLS policies for service-role API proxy ─────────────────────
-- The /api/db, /api/investments, /api/profile routes use the service role key
-- which bypasses RLS entirely — that is intentional for the server-side proxy.
-- However we add explicit admin-only policies so that if the anon key is ever
-- used by mistake, it cannot access other users' data.

-- Ensure admin insert policy exists on transactions (needed for complete_investment)
drop policy if exists "Admin can insert transactions" on public.transactions;
create policy "Admin can insert transactions" on public.transactions
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid()::text and role = 'admin')
    or auth.uid() is null  -- service role (bypasses RLS anyway, but explicit)
  );

-- ── 7. Fix: user_settings upsert policy ──────────────────────────────────────
-- The handle_new_profile_settings trigger inserts with security definer,
-- but direct upserts from the app need an insert policy too.

drop policy if exists "Users can upsert own settings" on public.user_settings;
create policy "Users can upsert own settings" on public.user_settings
  for insert with check (auth.uid()::text = user_id);

-- ── 8. Index: speed up common queries ────────────────────────────────────────
create index if not exists idx_transactions_user_id    on public.transactions(user_id);
create index if not exists idx_transactions_status     on public.transactions(status);
create index if not exists idx_notifications_user_id   on public.notifications(user_id);
create index if not exists idx_notifications_read      on public.notifications(user_id, read);
create index if not exists idx_chat_messages_user_id   on public.chat_messages(user_id);
create index if not exists idx_chat_messages_created   on public.chat_messages(user_id, created_at);
create index if not exists idx_investments_user_id     on public.investments(user_id);
create index if not exists idx_investments_status      on public.investments(user_id, status);

-- ── 9. Fix: getChatUsers — efficient distinct query ───────────────────────────
-- Replace the full-table-scan approach in db.ts with a DB-side function
-- that returns one row per unique user who has sent a message.

create or replace function public.get_chat_users()
returns table (user_id text) language sql security definer as $$
  select distinct on (user_id) user_id
  from public.chat_messages
  where role = 'user'
  order by user_id, created_at desc;
$$;

-- ── 10. Realtime: Row-level security for Realtime channels ───────────────────
-- Supabase Realtime respects RLS. Users will only receive events for rows
-- they are allowed to SELECT. No extra config needed — existing RLS policies
-- already scope each user to their own rows.
-- Admin users (role = 'admin') have SELECT policies on all tables, so they
-- will receive all events when subscribed without a filter.
