-- 08: Allow Firebase-authenticated users to upsert their own profile
-- (Since we use Firebase auth, not Supabase auth, we allow insert/upsert by matching id)
-- Run this in Supabase SQL editor

-- Allow anyone to upsert a profile (the app controls this via Firebase UID)
create policy "Allow profile upsert on signup"
  on public.profiles for insert
  with check (true);

-- Also set the admin user
update public.profiles
set role = 'admin'
where email = 'vestorinvest017@gmail.com';
