-- 03: Notifications
create table if not exists public.notifications (
  id         bigserial primary key,
  user_id    text not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('investment', 'dividend', 'alert', 'info', 'credit', 'withdrawal')),
  title      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.notifications enable row level security;
create policy "Users can view own notifications"   on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Admin can insert notifications"     on public.notifications for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "System can insert notifications"    on public.notifications for insert with check (true);

-- Auto-notify on credit
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

drop trigger if exists on_transaction_notify on public.transactions;
create trigger on_transaction_notify
  after insert or update of status on public.transactions
  for each row execute procedure public.notify_on_credit();
