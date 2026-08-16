// Supabase Edge Function: submit-form (v9)
// Receives website form submissions, persists to public.leads,
// then forwards to the Google Apps Script webhook (Google Sheet).
//
// v9: Meta LP leads (source "meta_lp") are ALSO forwarded to a second
// Apps Script web app that writes into a separate spreadsheet owned by a
// different Google account. The main sheet still gets every lead, so the
// dashboard and the outbound-call queue keep working untouched.
//
// v8: computes the SAME canonical dedup_key as the dashboard's
// /api/webhook/form-leads route (email-first, then last-8 phone digits)
// and UPSERTs on it — so the n8n 30-min sync updates this row instead of
// creating a duplicate. Phone is normalized (digits + leading '+', no spaces).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Pinned to the current Apps Script Web App deployment ("Version 4").
// The GOOGLE_SHEET_WEBHOOK_URL secret pointed at an older deployment that
// still ran the old code (no Country Code column, phone shown as #ERROR!).
// If you redeploy the Apps Script, use Manage deployments -> edit THIS
// deployment -> New version (keep the same URL) so this keeps working.
const SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxpxHu2aE4PuZD4NX65sN0WUOFAQL13FDdHQYMPc9pxehOvMiWLbzZeWuVCucUoazIUhw/exec'

// Second receiver: scripts/google-apps-script-meta-lp.gs, deployed on the
// sheet owner's own account. Same "edit the existing deployment" rule.
const META_LP_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxfkhSC7XzslyKMtL77pq2A9PxG0FGryyMe8K8Oeq3V38NFOVbLf_6EYBSoz_yrPxKW/exec'

// zz_meta_lp is the test source: routed to the new sheet like a real Meta
// lead, but excluded everywhere downstream (calls, dashboard) like any zz_.
function isMetaLp(source: unknown): boolean {
  const s = String(source ?? '')
  return s === 'meta_lp' || s === 'zz_meta_lp'
}

function normalizePhone(v: unknown): string | null {
  if (v == null) return null
  const s = String(v).replace(/[^0-9+]/g, '')
  if (!s) return null
  return s.startsWith('+') ? '+' + s.slice(1).replace(/[^0-9]/g, '') : s
}

// Same algorithm as the dashboard's form-leads webhook: email → phone → content.
function dedupKey(email: unknown, phone: string | null, leadId: string): string {
  const e = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (e) return 'E:' + e
  const digits = (phone ?? '').replace(/[^0-9]/g, '')
  if (digits.length >= 4) return 'P:' + digits.slice(-8)
  return 'C:' + leadId
}

async function postToSheet(url: string, secret: string, payload: unknown): Promise<string> {
  try {
    const target = secret
      ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(secret)}`
      : url
    const r = await fetch(target, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      redirect: 'follow',
      body: JSON.stringify(payload),
    })
    return `${r.status}`
  } catch (err) {
    console.warn('sheet webhook failed', url, err)
    return 'failed'
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST')
    return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (!body?.source) return json({ error: 'source is required' }, 400)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabase = createClient(supabaseUrl, serviceKey)

  const lead_id = `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const phone = normalizePhone(body.phone)

  const row = {
    lead_id,
    source: body.source,
    source_sheet: 'website_form',
    full_name: body.full_name ?? null,
    email: body.email ?? null,
    phone,
    country: body.country ?? null,
    message: body.message ?? null,
    language: body.language ?? null,
    property_interest: body.property_interest ?? null,
    preferred_location: body.preferred_location ?? null,
    budget: body.budget ?? null,
    utm_source: body.utm_source ?? null,
    utm_medium: body.utm_medium ?? null,
    utm_campaign: body.utm_campaign ?? null,
    status: 'new',
    dedup_key: dedupKey(body.email, phone, lead_id),
    raw_data: {
      ...body,
      page_url: body.page_url,
      rating: body.rating,
      extra: body.extra ?? {},
      received_at: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') ?? null,
      user_agent: req.headers.get('user-agent') ?? null,
    },
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('leads')
    .upsert(row, { onConflict: 'dedup_key', ignoreDuplicates: false })
    .select('id, lead_id, source, created_at')
    .single()

  if (error) {
    console.error('upsert error', error)
    return json({ error: error.message, where: 'supabase' }, 500)
  }

  const sheetPayload = {
    id: data.id,
    lead_id: data.lead_id,
    source: data.source,
    created_at: data.created_at,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    phone_country_code: body.phone_country_code ?? null,
    language: row.language,
    message: row.message,
    property_interest: row.property_interest,
    preferred_location: row.preferred_location,
    budget: row.budget,
    rating: body.rating ?? null,
    page_url: body.page_url ?? null,
    utm_source: row.utm_source,
    utm_medium: row.utm_medium,
    utm_campaign: row.utm_campaign,
    extra: body.extra ?? {},
  }

  // Forward to the main Google Sheet webhook (best-effort).
  const sheetSecret = Deno.env.get('GOOGLE_SHEET_SECRET') ?? 'irf_2026_a8f3kPzN9mQ4xL2yR7vW'
  const sheet_status = await postToSheet(SHEET_WEBHOOK_URL, sheetSecret, sheetPayload)

  // Meta LP leads additionally go to the separate Meta LP sheet.
  let meta_sheet_status = null
  if (isMetaLp(data.source)) {
    const metaSecret =
      Deno.env.get('META_LP_SHEET_SECRET') ?? 'irf_meta_lp_2026_change_me'
    meta_sheet_status = await postToSheet(META_LP_WEBHOOK_URL, metaSecret, sheetPayload)
  }

  return json(
    { ok: true, id: data.id, lead_id: data.lead_id, sheet_status, meta_sheet_status },
    200,
  )
})

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  })
}
