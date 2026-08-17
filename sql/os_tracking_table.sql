-- OPTIONAL: funnel event tracking table for the Top Talents page.
-- Run on Coconut OS (fkhnizxefllzmgnmmjxi) ONLY after Daniel's explicit approval.
-- The /api/track route no-ops safely until this exists.

create table if not exists public.lm_top_talents_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event in ('page_view','scroll_to_gate','form_submit','intro_request')),
  source text,
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.lm_top_talents_events enable row level security;
-- No public policies: only the service role (Vercel API routes) writes/reads.

create index if not exists lm_tt_events_event_idx on public.lm_top_talents_events (event, created_at desc);
create index if not exists lm_tt_events_source_idx on public.lm_top_talents_events (source) where source is not null;

-- The number that tells us whether the gate is set right:
-- select
--   count(*) filter (where event='scroll_to_gate') as reached_gate,
--   count(*) filter (where event='form_submit')    as submitted,
--   round(100.0 * count(*) filter (where event='form_submit')
--     / nullif(count(*) filter (where event='scroll_to_gate'),0), 1) as gate_conversion_pct
-- from lm_top_talents_events
-- where created_at > now() - interval '30 days';
