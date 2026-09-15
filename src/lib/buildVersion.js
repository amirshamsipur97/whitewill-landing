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
 *  - it checks on ARRIVAL and on every ROUTE CHANGE, never on a timer, so it
 *    cannot reload out from under somebody filling in a form. Arrival matters:
 *    the owner's stale tab failed on the FIRST click because the lazy chunk for
 *    the new route was requested under its old hash. Catching it at mount means
 *    the tab corrects itself before anything can be clicked;
 *  - version.json is fetched no-store, so the check itself is never cached;
 *  - it reloads AT MOST ONCE PER BUILD per tab: sessionStorage remembers the
 *    entry hash it last reloaded FOR, so a second deploy in the same session
 *    still gets its one reload. The first version stored a bare boolean, and
 *    on 2026-09-16 (three deploys in one hour) a tab that had already used
 *    its single reload could never recover from the next stale chunk;
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
    const mine = runningEntry()
    if (!mine) return
    const r = await fetch('/version.json', { cache: 'no-store' })
    if (!r.ok) return
    const { entry } = await r.json()
    if (!entry || entry === mine) return
    // Already reloaded once for THIS build and still stale? Then the reload
    // did not help (proxy cache, offline); stop, do not loop.
    if (sessionStorage.getItem(FLAG) === entry) return
    sessionStorage.setItem(FLAG, entry)
    window.location.reload()
  } catch { /* never let this break the app */ }
}

/**
 * Used by the chunk error boundary: true when production has moved on from
 * the build this tab is running, which means one reload will fix a failed
 * lazy import. Silent false on any failure.
 */
export async function isBuildStale() {
  try {
    const mine = runningEntry()
    if (!mine) return false
    const r = await fetch('/version.json', { cache: 'no-store' })
    if (!r.ok) return false
    const { entry } = await r.json()
    return Boolean(entry) && entry !== mine
  } catch { return false }
}
