-- 06: Settings per user
create table if not exists public.user_settings (
  user_id            uuid primary key references public.profiles(id) on delete cascade,
  currency           text not null default 'USD',
  language           text not null default 'en',
  theme              text not null default 'dark',
  notif_email        boolean not null default true,
  notif_push         boolean not null default true,
  notif_sms          boolean not null default false,
  notif_marketing    boolean not null default false,
  security_2fa       boolean not null default false,
  security_login_alerts boolean not null default true,
  security_session_timeout boolean not null default true,
  updated_at         timestamptz not null default now()
);

drop trigger if exists user_settings_updated_at on public.user_settings;
create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute procedure public.set_updated_at();

-- Auto-create settings row on profile creation
create or replace function public.handle_new_profile_settings()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_settings (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_settings on public.profiles;
create trigger on_profile_created_settings
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile_settings();

-- RLS
alter table public.user_settings enable row level security;
create policy "Users can view own settings"   on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can update own settings" on public.user_settings for update using (auth.uid() = user_id);
create policy "Users can insert own settings" on public.user_settings for insert with check (auth.uid() = user_id);
