/**
 * Detects that the tab is running a build older than the one deployed.
 *
 * WHY THIS EXISTS: this site deploys several times a day and is a long-lived
 * SPA. A tab left open keeps executing the JavaScript it loaded on arrival, so
 * a fix can be live on production for hours while the person testing it still
 * runs the old code and reports it broken. That happened with the landing CTA
 * on 2026-08-22: the corrected handler was verified inside the deployed bundle
 * while the owner was still clicking the previous one.
 *
 * HOW: the build writes dist/version.json holding the entry bundle's hashed
 * filename. At runtime we read the filename the page actually loaded from its
 * own <script type="module"> tag and compare. No env plumbing, no build id to
 * keep in sync, and it is exactly the thing that changes on every deploy.
 *
 * SAFETY, because a self-reloading page is a foot-gun:
 *  - it only ever checks on a ROUTE CHANGE, never on a timer, so it cannot
 *    reload out from under somebody filling in a form;
 *  - version.json is fetched no-store, so the check itself is never cached;
 *  - it reloads AT MOST ONCE per tab, guarded in sessionStorage;
 *  - every failure path is silent. A missing or unreachable version.json must
 *    never break navigation.
 */
const FLAG = 'irfan_build_reloaded'

function runningEntry() {
  try {
    const el = document.querySelector('script[type="module"][src*="/assets/"]')
    const src = el?.getAttribute('src') || ''
    return src.split('/').pop() || null
  } catch { return null }
}

export async function reloadIfStaleBuild() {
  try {
    if (sessionStorage.getItem(FLAG) === '1') return   // one reload per tab, ever
    const mine = runningEntry()
    if (!mine) return
    const r = await fetch('/version.json', { cache: 'no-store' })
    if (!r.ok) return
    const { entry } = await r.json()
    if (!entry || entry === mine) return
    sessionStorage.setItem(FLAG, '1')
    window.location.reload()
  } catch { /* never let this break the app */ }
}
