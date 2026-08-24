-- GHC Nutrition · atribución cruzada dentro del ecosistema GHC
-- Aplicada a producción el 2026-08-24.

alter table public.orders
  add column if not exists source_channel text,
  add column if not exists source_detail text,
  add column if not exists campaign_code text;

create index if not exists orders_source_channel_created_idx
  on public.orders(source_channel, created_at desc)
  where source_channel is not null;
