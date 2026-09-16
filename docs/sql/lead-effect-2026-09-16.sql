-- Effect of the 2026-09-16 conversion changes (article form phone-first + WhatsApp,
-- mid-article card, popup auto-open on property articles). Run against the
-- irfaninvest Supabase project (owgvrxipqlusepozlujv). Cut-over: 2026-09-16 17:00 Muscat.
-- Baseline = the 60 days before the cut-over. Uses inserted_at (created_at is unreliable)
-- and strips the known test rows.
with real as (
  select l.*, regexp_replace(coalesce(raw_data->>'page_url',''), '^https?://[^/]+', '') as path
  from leads l
  where coalesce(source,'') not like 'zz_%' and coalesce(source,'') not like '\_\_%'
    and l::text not ilike '%webhook test%' and l::text not ilike '%python test%' and l::text not ilike '%secret probe%'
    and l::text not ilike '%amir@gmail.com%' and l::text not ilike '%test@gmail.com%'
), tagged as (
  select *,
    case
      when source like 'insight_article%' then 'A. article form'
      when message ilike '%popup%' and path ~ '^/(fa/|ar/|ru/)?insights/' then 'B. popup on article'
      when message ilike '%popup%' then 'C. popup elsewhere'
      when path ~ '^/(fa/|ar/|ru/)?insights/' then 'D. other lead from article'
      else 'E. everything else'
    end as channel,
    case when inserted_at >= timestamptz '2026-09-16 17:00+04' then 'after' else 'before' end as period
  from real
  where inserted_at >= timestamptz '2026-09-16 17:00+04' - interval '60 days'
), days as (
  select 60.0 as before_days, greatest(extract(epoch from (now() - timestamptz '2026-09-16 17:00+04'))/86400.0, 0.01) as after_days
)
select channel,
  count(*) filter (where period='before') as before_60d,
  round(count(*) filter (where period='before') / (select before_days from days), 2) as before_per_day,
  count(*) filter (where period='after') as after_n,
  round((select after_days from days)::numeric, 2) as after_days,
  round(count(*) filter (where period='after') / (select after_days from days), 2) as after_per_day
from tagged group by channel
union all
select 'TOTAL', count(*) filter (where period='before'), round(count(*) filter (where period='before')/(select before_days from days),2),
  count(*) filter (where period='after'), round((select after_days from days)::numeric,2), round(count(*) filter (where period='after')/(select after_days from days),2) from tagged
order by 1;
