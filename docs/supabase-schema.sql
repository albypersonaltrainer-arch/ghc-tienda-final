-- GHC Nutrition · esquema de comercio
-- Preparado para aplicarlo en un proyecto Supabase independiente de Academy.
-- Datos accesibles únicamente desde el servidor mediante clave secreta.

create extension if not exists citext;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  first_name text not null,
  last_name text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  owner_customer_id uuid not null references public.customers(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists referral_codes_one_active_per_customer
  on public.referral_codes(owner_customer_id)
  where active = true;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  checkout_reference text not null unique,
  sumup_checkout_id text unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED')),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null check (total_cents > 0),
  coupon_id uuid,
  coupon_code text,
  referral_code text,
  address_line text not null,
  city text not null,
  postal_code text not null,
  state text not null,
  country char(2) not null default 'ES',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_customer_created_idx
  on public.orders(customer_id, created_at desc);
create index if not exists orders_status_idx
  on public.orders(status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  flavor text not null,
  quantity integer not null check (quantity between 1 and 10),
  unit_price_cents integer not null check (unit_price_cents > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx
  on public.order_items(order_id);

create table if not exists public.reward_coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_id uuid not null references public.customers(id) on delete cascade,
  percent integer not null default 10 check (percent between 1 and 50),
  status text not null default 'active'
    check (status in ('active', 'reserved', 'redeemed', 'expired')),
  source text not null default 'referral',
  referred_order_id uuid unique references public.orders(id) on delete set null,
  reserved_order_id uuid references public.orders(id) on delete set null,
  reserved_at timestamptz,
  redeemed_order_id uuid references public.orders(id) on delete set null,
  redeemed_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists reward_coupons_customer_status_idx
  on public.reward_coupons(customer_id, status, expires_at);

alter table public.orders
  drop constraint if exists orders_coupon_id_fkey;
alter table public.orders
  add constraint orders_coupon_id_fkey
  foreign key (coupon_id) references public.reward_coupons(id) on delete set null;

-- Defensa en profundidad: el navegador no lee ni escribe datos personales.
alter table public.customers enable row level security;
alter table public.referral_codes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reward_coupons enable row level security;

revoke all on table public.customers from anon, authenticated;
revoke all on table public.referral_codes from anon, authenticated;
revoke all on table public.orders from anon, authenticated;
revoke all on table public.order_items from anon, authenticated;
revoke all on table public.reward_coupons from anon, authenticated;

grant select, insert, update, delete on table public.customers to service_role;
grant select, insert, update, delete on table public.referral_codes to service_role;
grant select, insert, update, delete on table public.orders to service_role;
grant select, insert, update, delete on table public.order_items to service_role;
grant select, insert, update, delete on table public.reward_coupons to service_role;
