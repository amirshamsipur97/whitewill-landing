/**
 * Shared phone country dial-codes for all lead forms, so every submission
 * captures the caller's country code (flows into the phone value + the
 * `country` lead field → Google Sheet). Ordered by relevance to our audience.
 */
export const COUNTRY_CODES = [
  { code: '+968', flag: '🇴🇲', label: 'Oman' },
  { code: '+971', flag: '🇦🇪', label: 'UAE' },
  { code: '+966', flag: '🇸🇦', label: 'Saudi Arabia' },
  { code: '+974', flag: '🇶🇦', label: 'Qatar' },
  { code: '+973', flag: '🇧🇭', label: 'Bahrain' },
  { code: '+965', flag: '🇰🇼', label: 'Kuwait' },
  { code: '+98', flag: '🇮🇷', label: 'Iran' },
  { code: '+7', flag: '🇷🇺', label: 'Russia' },
  { code: '+44', flag: '🇬🇧', label: 'United Kingdom' },
  { code: '+1', flag: '🇺🇸', label: 'United States' },
  { code: '+91', flag: '🇮🇳', label: 'India' },
  { code: '+92', flag: '🇵🇰', label: 'Pakistan' },
  { code: '+90', flag: '🇹🇷', label: 'Türkiye' },
  { code: '+20', flag: '🇪🇬', label: 'Egypt' },
  { code: '+962', flag: '🇯🇴', label: 'Jordan' },
  { code: '+961', flag: '🇱🇧', label: 'Lebanon' },
  { code: '+49', flag: '🇩🇪', label: 'Germany' },
  { code: '+33', flag: '🇫🇷', label: 'France' },
  { code: '+34', flag: '🇪🇸', label: 'Spain' },
  { code: '+39', flag: '🇮🇹', label: 'Italy' },
  { code: '+86', flag: '🇨🇳', label: 'China' },
  { code: '+60', flag: '🇲🇾', label: 'Malaysia' },
  { code: '+63', flag: '🇵🇭', label: 'Philippines' },
]

export const DEFAULT_DIAL_CODE = '+968'

/** Country name for a selected dial code (best-effort; shared codes pick first). */
export function countryForDialCode(code) {
  const hit = COUNTRY_CODES.find((c) => c.code === code)
  return hit ? hit.label : ''
}
