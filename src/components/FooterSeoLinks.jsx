/**
 * FooterSeoLinks — the site-wide keyword-anchored internal link block.
 *
 * Mounted EAGERLY in App.jsx, immediately above the (DeferredMount-ed)
 * SiteFooter. It must not be deferred: the whole point is that a crawler sees
 * these links in the DOM on first render, without needing an
 * IntersectionObserver to fire.
 *
 * Content + 4-language phrasing: src/footerSeoLinks.mjs
 */
import { LocalizedLink } from '../lib/localize.js'
import { useI18n } from '../i18n.jsx'
import { FONT, OLIVE_BRIGHT } from './invest/ui.jsx'
import { POPULAR, COMMUNITIES, PROJECTS, servicesFor, footerSeoCopy } from '../footerSeoLinks.mjs'

const INK = 'rgba(255,255,255,0.86)'
const SUB = 'rgba(255,255,255,0.52)'
const LINE = 'rgba(255,255,255,0.09)'

const CSS = `
.fsl{background:#0a0a0b;border-top:1px solid ${LINE};font-family:${FONT}}
.fsl-wrap{max-width:1180px;margin:0 auto;padding:44px 20px 40px;display:grid;gap:30px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.fsl-h{font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${SUB};margin:0 0 14px}
.fsl-list{list-style:none;margin:0;padding:0}
.fsl-list li{margin-bottom:9px}
.fsl-list a{color:${INK};font-size:13.5px;line-height:1.5;text-decoration:none;transition:color .18s}
.fsl-list a:hover{color:${OLIVE_BRIGHT};text-decoration:underline;text-underline-offset:3px}
@media (max-width:600px){.fsl-wrap{padding:32px 18px 28px;gap:24px}}
`

export default function FooterSeoLinks() {
  const { lang } = useI18n()
  const c = footerSeoCopy(lang)
  const rtl = lang === 'fa' || lang === 'ar'

  const col = (heading, items) => (
    <nav aria-label={heading}>
      <h2 className="fsl-h">{heading}</h2>
      <ul className="fsl-list">
        {items.map((it) => (
          <li key={it.to}>
            <LocalizedLink to={it.to}>{it.label}</LocalizedLink>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <section className="fsl" dir={rtl ? 'rtl' : 'ltr'} aria-label={c.headings.popular}>
      <style>{CSS}</style>
      <div className="fsl-wrap" style={{ textAlign: rtl ? 'right' : 'left' }}>
        {col(
          c.headings.popular,
          POPULAR.map((p) => ({ to: p.to, label: c.popular[p.key] })),
        )}
        {col(
          c.headings.communities,
          COMMUNITIES.map((a) => ({
            to: `/project?area=${encodeURIComponent(a.area)}`,
            label: c.community.replace('{area}', a.label),
          })),
        )}
        {col(
          c.headings.projects,
          PROJECTS.map((p) => ({
            to: `/buy/${p.slug}`,
            label: c.project.replace('{name}', p.name),
          })),
        )}
        {col(
          c.headings.services,
          servicesFor(lang).map((s) => ({ to: s.to, label: c.services[s.key] })),
        )}
      </div>
    </section>
  )
}
