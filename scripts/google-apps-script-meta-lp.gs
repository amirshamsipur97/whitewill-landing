/**
 * Meta LP (/lp/oman) — lead ingest into a SEPARATE Google Sheet.
 *
 * This is a second receiver, independent of scripts/google-apps-script.gs
 * (which feeds the main "Form Property DB" sheet). It only ever sees the
 * leads the Supabase edge function routes to it, i.e. source = "meta_lp".
 *
 * Unlike the main script it does NOT need a spreadsheet id: create it from
 * inside the target sheet (Extensions -> Apps Script) so it binds to that
 * spreadsheet automatically. That also means the sheet can live in any
 * Google account without sharing anything with anyone.
 *
 * Setup on the sheet's own account:
 *   1) Open the Google Sheet that should receive the leads.
 *   2) Extensions -> Apps Script. Delete the stub, paste this whole file.
 *   3) Deploy -> New deployment -> Type: Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4) Authorize when Google asks (the "unverified app" screen is expected:
 *      Advanced -> Go to project -> Allow).
 *   5) Copy the /exec URL and send it over. It goes into the edge function.
 *
 * IMPORTANT for later edits: to change this code use
 * Deploy -> Manage deployments -> edit the EXISTING deployment -> New version.
 * "New deployment" mints a brand new URL and silently strands the old one,
 * which is exactly how the main sheet broke once already.
 */

const SHARED_SECRET = 'irf_meta_lp_2026_change_me'; // must match the edge function
const SHEET_NAME = 'Meta LP Leads';

const HEADERS = [
  'received_at',
  'lead_id',
  'full_name',
  'country_code',
  'phone',
  'email',
  'nationality',
  'lifestyle',
  'purpose',
  'property_type',
  'language',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'page_url',
  'raw_answers',
  'supabase_id'
];

function doPost(e) {
  try {
    if (SHARED_SECRET) {
      const token = (e && e.parameter && e.parameter.token) || '';
      if (token !== SHARED_SECRET) return _json({ ok: false, error: 'unauthorized' });
    }

    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const quiz = _parseQuiz(body.message);
    const phone = _splitPhone(body.phone, body.phone_country_code);

    const row = {
      received_at: new Date(),
      lead_id: body.lead_id || '',
      full_name: body.full_name || '',
      // leading apostrophe keeps Sheets from reading +968… as a formula
      country_code: phone.code ? "'" + phone.code : '',
      phone: phone.number ? "'" + phone.number : '',
      email: body.email || '',
      nationality: quiz.nationality || '',
      lifestyle: quiz.lifestyle || '',
      purpose: quiz.purpose || '',
      property_type: quiz.property_type || '',
      language: body.language || '',
      utm_source: body.utm_source || '',
      utm_medium: body.utm_medium || '',
      utm_campaign: body.utm_campaign || '',
      page_url: body.page_url || '',
      raw_answers: body.message || '',
      supabase_id: body.id || ''
    };

    const sheet = _ensureSheet();
    // Map by header name so re-ordering columns in the sheet cannot break this.
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    sheet.appendRow(headers.map(function (h) {
      const v = row[String(h).trim()];
      return v === undefined ? '' : v;
    }));

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return _json({ ok: true, service: 'meta-lp-leads-ingest' });
}

/** "Meta LP quiz - nationality: India, lifestyle: Luxury Living, ..." -> object */
function _parseQuiz(message) {
  const out = {};
  if (!message) return out;
  const body = String(message).replace(/^.*?quiz\s*-\s*/i, '');
  body.split(',').forEach(function (part) {
    const i = part.indexOf(':');
    if (i < 0) return;
    const key = part.slice(0, i).trim().toLowerCase().replace(/\s+/g, '_');
    const val = part.slice(i + 1).trim();
    if (key && val && val !== 'n/a') out[key] = val;
  });
  return out;
}

/** "+91 9876543210" -> { code: "+91", number: "9876543210" } */
function _splitPhone(phone, code) {
  const raw = String(phone || '').trim();
  if (!raw) return { code: code || '', number: '' };
  if (code && raw.indexOf(code) === 0) {
    return { code: code, number: raw.slice(code.length).replace(/[^0-9]/g, '') };
  }
  const m = raw.match(/^(\+\d{1,4})[\s-]*(\d+)$/);
  if (m) return { code: m[1], number: m[2] };
  return { code: code || '', number: raw.replace(/[^0-9]/g, '') };
}

function _ensureSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function _json(payload) {
  const out = ContentService.createTextOutput(JSON.stringify(payload));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
