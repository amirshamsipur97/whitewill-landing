// ─────────────────────────────────────────────────────────────────────────
// investContent.js — language index for the /invest page.
//
// Content lives in one file per language (same shape, see invest/en.js for the
// canonical structure). `getInvestContent(lang)` returns the set for the active
// language, falling back to English for any unknown code. InvestPage reads the
// active language from the i18n context (useI18n) and passes the result down.
// ─────────────────────────────────────────────────────────────────────────

import en from './invest/en'
import ru from './invest/ru'
import ar from './invest/ar'

const CONTENT = { en, ru, ar }

export function getInvestContent(lang) {
  return CONTENT[lang] || en
}
