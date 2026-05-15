# Form submissions → Supabase + Google Sheets

Every form on the site (Sell/Rent CTA, Feedback, Partner application) posts to a Supabase Edge Function called **`submit-form`**. That function:

1. Inserts the submission into the `public.leads` Postgres table.
2. Forwards the same payload to a Google Apps Script web-app endpoint, which appends one row to a Google Sheet.

```
Form (browser)
   │  POST  https://owgvrxipqlusepozlujv.supabase.co/functions/v1/submit-form
   ▼
Edge Function `submit-form`
   ├─→ INSERT INTO public.leads (full_name, email, phone, source, raw_data, ...)
   └─→ POST  https://script.google.com/macros/s/<DEPLOY_ID>/exec
              ▼
        Google Apps Script `doPost`
              ▼
        Google Sheet "Leads"  (one row per submission)
```

## Sources used per form

| Form (component)              | `source` field        |
| ----------------------------- | --------------------- |
| Landing → Sell card dialog    | `sell_landing`        |
| Landing → Rent card dialog    | `rent_landing`        |
| Landing → Feedback form       | `feedback`            |
| Landing → Partner application | `partner`             |

The browser also adds: `language`, `page_url`, `utm_source / utm_medium / utm_campaign` (parsed from `?utm_*=` query params).

## 1. Create the Google Sheet + Apps Script

1. Create a new Google Sheet (give it any name — e.g. *Whitewill Leads*).
2. Copy the **spreadsheet ID** from the URL: `…/spreadsheets/d/<ID>/edit`.
3. Open <https://script.google.com> → **New project**.
4. Replace the default `Code.gs` with the contents of `scripts/google-apps-script.gs`.
5. Set `SHEET_ID` to the ID from step 2. (Optionally set `SHARED_SECRET`.)
6. **Deploy → New deployment → Web app**:
   - Description: *Whitewill leads ingest*
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the resulting `…/exec` URL.

The script will create the `Leads` sheet on first run and write a header row.

## 2. Tell the Edge Function where to forward

In the Supabase dashboard for project **`owgvrxipqlusepozlujv`**:

> Project Settings → Edge Functions → `submit-form` → **Secrets**

Add:

| Name                       | Value                                          |
| -------------------------- | ---------------------------------------------- |
| `GOOGLE_SHEET_WEBHOOK_URL` | the `…/exec` URL from step 1.6                 |
| `GOOGLE_SHEET_SECRET`      | (optional) the same string as `SHARED_SECRET`  |

Or via CLI:

```bash
supabase secrets set GOOGLE_SHEET_WEBHOOK_URL='https://script.google.com/macros/s/AKfycb…/exec' \
  --project-ref owgvrxipqlusepozlujv
supabase secrets set GOOGLE_SHEET_SECRET='change-me-long-random' \
  --project-ref owgvrxipqlusepozlujv
```

No redeploy is required — the function reads env vars on each invocation.

## 3. Smoke test

```bash
curl -X POST 'https://owgvrxipqlusepozlujv.supabase.co/functions/v1/submit-form' \
  -H 'Content-Type: application/json' \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -d '{
    "source": "feedback",
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "+96812345678",
    "message": "Smoke test from CLI",
    "rating": 5,
    "language": "en"
  }'
```

You should see:

```json
{ "ok": true, "id": 123, "lead_id": "web_…", "sheet_status": "200" }
```

- `id` → primary key in `public.leads`.
- `sheet_status` → HTTP status returned by the Google Apps Script (`"200"` if the row was appended, `"not_configured"` if the env var is unset, `"failed"` on network error).

## Schema

The `leads` table already exists in this project (no migration required). Each website submission writes:

| column              | source                                             |
| ------------------- | -------------------------------------------------- |
| `lead_id`           | generated `web_<timestamp>_<random>`               |
| `source`            | `sell_landing` / `rent_landing` / `feedback` / `partner` |
| `source_sheet`      | always `website_form`                              |
| `full_name`, `email`, `phone`, `message` | from form fields                |
| `language`          | active i18n language (`en`/`ru`/`ar`)              |
| `property_interest` | LeadCards: `apartment` / `villa` / `penthouse` / `commercial` |
| `utm_source/medium/campaign` | parsed from current URL                  |
| `status`            | `new`                                              |
| `raw_data`          | full payload + `rating`, `page_url`, `ip`, `user_agent` |
| `created_at`        | `now()`                                            |

Querying recent leads in the SQL editor:

```sql
select id, source, full_name, phone, language, created_at, raw_data->>'rating' as rating
from leads
where source_sheet = 'website_form'
order by created_at desc
limit 50;
```
