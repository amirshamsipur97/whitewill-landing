/**
 * Localized URL helpers for the per-language routing (Phase 2 SEO).
 *
 * URL model: English is prefix-less (`/buy`); ar/ru/fa get a path prefix
 * (`/ar/buy`, `/ru/buy`, `/fa/buy`). The first path segment is the source of
 * truth for the active language.
 */
import { createElement } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export const PREFIX_LANGS = ['ar', 'ru', 'fa'] // en is prefix-less
export const ALL_LANGS = ['en', 'ar', 'ru', 'fa']

/** Language implied by a pathname's first segment ('en' if none). */
export function langFromPath(pathname) {
  const m = (pathname || '/').match(/^\/(ar|ru|fa)(?=\/|$)/)
  return m ? m[1] : 'en'
}

/** Strip the language prefix → the logical path (always starts with '/'). */
export function stripLang(pathname) {
  const p = (pathname || '/').replace(/^\/(ar|ru|fa)(?=\/|$)/, '')
  return p === '' ? '/' : p
}

/** Prefix a logical path with the language ('/' stays clean per language). */
export function localizePath(logicalPath, lang) {
  const p = logicalPath && logicalPath.startsWith('/') ? logicalPath : '/' + (logicalPath || '')
  if (lang === 'en' || !PREFIX_LANGS.includes(lang)) return p
  return p === '/' ? `/${lang}` : `/${lang}${p}`
}

/** Hook: navigate using a LOGICAL path, auto-prefixed with the current lang. */
export function useLocalizedNavigate() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  return (logicalPath, opts) => navigate(localizePath(logicalPath, lang), opts)
}

/**
 * <LocalizedLink to="/buy"> — `to` is a LOGICAL path; the current language
 * prefix is applied automatically so links stay within the active language.
 * Pass `raw` to opt out (e.g. external or already-absolute localized paths).
 */
export function LocalizedLink({ to, raw = false, ...rest }) {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const href = raw ? to : localizePath(to, lang)
  return createElement(Link, { to: href, ...rest })
}
