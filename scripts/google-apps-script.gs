/**
 * Whitewill — website form ingest into Google Sheets.
 *
 * Receives JSON POSTs from the Supabase Edge Function `submit-form`
 * and appends each submission as a new row in the "Leads" sheet.
 *
 * Setup:
 *   1) Open https://script.google.com → New project.
 *   2) Paste this entire file as Code.gs.
 *   3) Replace SHEET_ID below with your spreadsheet ID
 *      (from /spreadsheets/d/<THIS_PART>/edit ).
 *   4) (Optional) set SHARED_SECRET to a long random string.
 *   5) Deploy → New deployment → Type: "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   6) Copy the resulting /exec URL.
 *   7) In Supabase project, set the secrets:
 *        supabase secrets set GOOGLE_SHEET_WEBHOOK_URL=<that-url>
 *        supabase secrets set GOOGLE_SHEET_SECRET=<same-shared-secret>
 *      (or set them in the Supabase dashboard → Functions → submit-form → Secrets)
 *   8) Done. Each website form submit now writes one row to the sheet.
 */

const SHEET_ID = 'PUT-YOUR-GOOGLE-SHEET-ID-HERE';
const SHEET_NAME = 'Leads';
const SHARED_SECRET = ''; // optional; if set, must match Supabase GOOGLE_SHEET_SECRET

const HEADERS = [
  'received_at',
  'lead_id',
  'source',
  'language',
  'full_name',
  'email',
  'phone',
  'message',
  'rating',
  'property_interest',
  'preferred_location',
  'budget',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'page_url',
  'extra_json',
  'supabase_lead_pk'
];

function doPost(e) {
  try {
    // Optional shared-secret guard
    if (SHARED_SECRET) {
      const token = (e && e.parameter && e.parameter.token) || '';
      if (token !== SHARED_SECRET) {
        return _json({ ok: false, error: 'unauthorized' }, 401);
      }
    }

    const body = JSON.parse(e.postData.contents || '{}');
    const sheet = _ensureSheet();

    const row = [
      new Date(),
      body.lead_id || '',
      body.source || '',
      body.language || '',
      body.full_name || '',
      body.email || '',
      body.phone || '',
      body.message || '',
      body.rating == null ? '' : body.rating,
      body.property_interest || '',
      body.preferred_location || '',
      body.budget || '',
      body.utm_source || '',
      body.utm_medium || '',
      body.utm_campaign || '',
      body.page_url || '',
      JSON.stringify(body.extra || {}),
      body.id || ''
    ];

    sheet.appendRow(row);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) }, 500);
  }
}

function doGet() {
  return _json({ ok: true, service: 'whitewill-leads-ingest' });
}

function _ensureSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function _json(payload, code) {
  const out = ContentService.createTextOutput(JSON.stringify(payload));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
