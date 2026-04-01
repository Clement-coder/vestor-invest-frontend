-- 01: User profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id           text primary key,
  email        text unique not null,
  full_name    text,
  avatar_url   text,
  role         text not null default 'user' check (role in ('user', 'admin')),
  balance      numeric(18,2) not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile"    on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid() = id);
create policy "Admin can view all profiles"   on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin can update all profiles" on public.profiles for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Set admin role for vestorinvest017@gmail.com (run after first login)
-- update public.profiles set role = 'admin' where email = 'vestorinvest017@gmail.com';
