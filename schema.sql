-- Run in Supabase SQL editor. Use one trailer only.
create extension if not exists pgcrypto;
create table if not exists public.booking_requests (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 customer_name text not null check (char_length(customer_name) between 1 and 120),
 email text not null check (char_length(email) between 3 and 180),
 phone text not null check (char_length(phone) between 1 and 30),
 message text not null default '' check (char_length(message)<=1000),
 start_date date not null,
 end_date date not null,
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 check (end_date>=start_date and end_date-start_date<=90)
);
create table if not exists public.blocked_dates (day date primary key, request_id uuid references public.booking_requests(id) on delete set null);
alter table public.booking_requests enable row level security;
alter table public.blocked_dates enable row level security;
-- Public can only create a request, never read private contact details.
create policy "Public can request" on public.booking_requests for insert to anon with check (status='pending');
-- Public can only see blocked calendar days, not customer details.
create policy "Public can see blocked days" on public.blocked_dates for select to anon using (true);
-- Approvals and date blocking must be done through authenticated Supabase admin dashboard.
-- Run this after setting up a server-side approval workflow or use the SQL below manually.
-- Example approval (replace UUID):
-- begin;
-- insert into public.blocked_dates(day,request_id)
-- select d::date,'REQUEST_UUID'::uuid from generate_series('2026-11-01'::date,'2026-11-03'::date,interval '1 day') d;
-- update public.booking_requests set status='approved' where id='REQUEST_UUID'::uuid;
-- commit;
