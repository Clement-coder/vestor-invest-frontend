-- 12: Add payment_pin to user_settings
alter table public.user_settings add column if not exists payment_pin text;
