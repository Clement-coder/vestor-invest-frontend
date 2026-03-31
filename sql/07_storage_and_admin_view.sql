-- 07: Storage bucket for chat images
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict do nothing;

create policy "Authenticated users can upload chat images"
  on storage.objects for insert
  with check (bucket_id = 'chat-images' and auth.role() = 'authenticated');

create policy "Anyone can view chat images"
  on storage.objects for select
  using (bucket_id = 'chat-images');

-- 08: Admin helper view — all users with balance
create or replace view public.admin_users_view as
select
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.balance,
  p.created_at,
  count(t.id) filter (where t.status = 'Pending')   as pending_withdrawals,
  count(t.id) filter (where t.type = 'Withdrawal')  as total_withdrawals,
  count(m.id)                                        as total_messages
from public.profiles p
left join public.transactions t on t.user_id = p.id
left join public.chat_messages m on m.user_id = p.id and m.role = 'user'
group by p.id;

-- Only admin can query this view
create policy "Admin only" on public.profiles for select using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);
