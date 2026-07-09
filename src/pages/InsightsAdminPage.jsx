/**
 * InsightsAdminPage — password-protected authoring UI for the blog.
 * Not linked in the public nav; reachable at /insights-admin.
 * All reads/writes go through the insights-admin edge function (service role).
 * Password is held only in sessionStorage for the tab's lifetime.
 *
 * Styled in the site's olive-luxury material language (FONT, OLIVE_BRIGHT,
 * glass cards, hairline borders).
 */
import { useEffect, useMemo, useState } from 'react'
import {
  Box, Container, Typography, TextField, Button, MenuItem, Select,
  FormControlLabel, Switch, Stack, IconButton, Chip, Divider, Alert, CircularProgress, Tooltip,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PublishRoundedIcon from '@mui/icons-material/PublishRounded'
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { insightsAdmin } from '../supabase.js'
import Markdown from '../components/insights/Markdown.jsx'
import { FONT, OLIVE_BRIGHT, HAIR, HAIR_SOFT } from '../components/invest/ui.jsx'

const PW_KEY = 'insights_admin_pw'
const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' },
  { code: 'fa', label: 'فارسی' },
]
const RTL = new Set(['ar', 'fa'])
const GREEN = '#69ef1c'

const CARD_BG =
  'radial-gradient(80% 60% at 80% 0%, rgba(230,237,245,0.06) 0%, rgba(230,237,245,0) 70%), linear-gradient(153deg, rgba(20,21,24,0.9) 0%, rgba(10,11,13,0.95) 100%)'

const EMPTY = {
  id: null, lang: 'en', title: '', slug: '', category: '', cover_image: '',
  tags: '', excerpt: '', body_md: '', seo_title: '', seo_description: '', published: false,
}

function slugify(s) {
  return String(s).toLowerCase().trim()
    .replace(/[^a-z0-9؀-ۿЀ-ӿ\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

// Shared olive-luxury field styling for the editor.
const fieldSx = {
  '& .MuiInputBase-root': { fontFamily: FONT, color: '#fff', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '10px' },
  '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: OLIVE_BRIGHT },
  '& .MuiInputLabel-root': { fontFamily: FONT, color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: OLIVE_BRIGHT },
  '& .MuiFormHelperText-root': { fontFamily: FONT, color: 'rgba(255,255,255,0.35)' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.14)' },
}

const oliveBtn = {
  fontFamily: FONT, fontWeight: 700, textTransform: 'none', borderRadius: '10px',
  bgcolor: OLIVE_BRIGHT, color: '#0b0b0b', px: 2.5,
  '&:hover': { bgcolor: '#a0a12c' },
}

function StatusChip({ published }) {
  return (
    <Chip
      label={published ? 'Published' : 'Draft'}
      size="small"
      sx={{
        fontFamily: FONT, fontWeight: 600, fontSize: 11.5, height: 24, borderRadius: '7px',
        bgcolor: published ? 'rgba(105,239,28,0.12)' : 'rgba(255,255,255,0.06)',
        color: published ? GREEN : 'rgba(255,255,255,0.55)',
        border: `1px solid ${published ? 'rgba(105,239,28,0.35)' : 'rgba(255,255,255,0.12)'}`,
      }}
    />
  )
}

function Login({ onAuthed }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      await insightsAdmin('auth', pw)
      sessionStorage.setItem(PW_KEY, pw)
      onAuthed(pw)
    } catch (e2) {
      setErr(e2.message || 'Wrong password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2,
      background: 'radial-gradient(70% 60% at 50% 0%, rgba(140,141,37,0.12) 0%, rgba(0,0,0,0) 60%), #000' }}>
      <Box sx={{ width: '100%', maxWidth: 400, borderRadius: '18px', border: HAIR, p: { xs: 3.5, md: 4.5 },
        backgroundImage: CARD_BG, boxShadow: 'inset 0 1px 1px 1px rgba(255,255,255,0.06)' }}>
        <Box sx={{ width: 46, height: 46, borderRadius: '12px', display: 'grid', placeItems: 'center', mb: 2.5,
          bgcolor: 'rgba(140,141,37,0.15)', border: '1px solid rgba(140,141,37,0.32)' }}>
          <LockOutlinedIcon sx={{ color: OLIVE_BRIGHT, fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 1 }}>
          INSIGHTS ADMIN
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontWeight: 300, fontSize: 26, color: '#fff', mb: 1 }}>Sign in</Typography>
        <Typography sx={{ fontFamily: FONT, color: 'rgba(255,255,255,0.5)', fontSize: 14, mb: 3.5 }}>
          Enter the admin password to manage articles.
        </Typography>
        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField type="password" label="Password" value={pw} onChange={(e) => setPw(e.target.value)} fullWidth autoFocus sx={fieldSx} />
            {err && <Alert severity="error" sx={{ borderRadius: '10px' }}>{err}</Alert>}
            <Button type="submit" variant="contained" disabled={busy || !pw} sx={{ ...oliveBtn, py: 1.3 }}>
              {busy ? <CircularProgress size={20} sx={{ color: '#0b0b0b' }} /> : 'Sign in'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}

function Editor({ pw, row, onSaved, onCancel }) {
  const [f, setF] = useState(() => ({
    ...EMPTY, ...row,
    tags: Array.isArray(row?.tags) ? row.tags.join(', ') : (row?.tags || ''),
  }))
  const [slugTouched, setSlugTouched] = useState(Boolean(row?.id))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    if (!slugTouched) setF((p) => ({ ...p, slug: slugify(p.title) }))
  }, [f.title, slugTouched])

  async function save() {
    setBusy(true); setErr('')
    try {
      const { row: saved } = await insightsAdmin('upsert', pw, {
        row: {
          id: f.id ?? undefined,
          lang: f.lang, title: f.title, slug: f.slug, category: f.category,
          cover_image: f.cover_image, tags: f.tags, excerpt: f.excerpt,
          body_md: f.body_md, seo_title: f.seo_title, seo_description: f.seo_description,
          published: f.published,
        },
      })
      onSaved(saved)
    } catch (e) {
      setErr(e.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const rtl = RTL.has(f.lang)

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 300, fontSize: 24, color: '#fff' }}>{f.id ? 'Edit article' : 'New article'}</Typography>
        <Button onClick={onCancel} sx={{ fontFamily: FONT, color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}>← Back to list</Button>
      </Stack>
      {err && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{err}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Select value={f.lang} onChange={set('lang')} sx={{ ...fieldSx, minWidth: 150, '& .MuiSelect-select': { fontFamily: FONT, color: '#fff' } }}>
              {LANGS.map((l) => <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>)}
            </Select>
            <FormControlLabel
              control={<Switch checked={f.published} onChange={(e) => setF((p) => ({ ...p, published: e.target.checked }))}
                sx={{ '& .Mui-checked': { color: OLIVE_BRIGHT }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: `${OLIVE_BRIGHT} !important` } }} />}
              label={<Typography sx={{ fontFamily: FONT, color: '#fff' }}>{f.published ? 'Published' : 'Draft'}</Typography>}
            />
          </Stack>
          <TextField label="Title" value={f.title} onChange={set('title')} fullWidth sx={fieldSx} />
          <TextField label="Slug (URL)" value={f.slug} onChange={(e) => { setSlugTouched(true); setF((p) => ({ ...p, slug: e.target.value })) }} fullWidth helperText={`/insights/${f.slug || '…'}`} sx={fieldSx} />
          <Stack direction="row" spacing={2}>
            <TextField label="Category" value={f.category} onChange={set('category')} fullWidth sx={fieldSx} />
            <TextField label="Tags (comma separated)" value={f.tags} onChange={set('tags')} fullWidth sx={fieldSx} />
          </Stack>
          <TextField label="Cover image URL" value={f.cover_image} onChange={set('cover_image')} fullWidth placeholder="/peninsula.jpg or https://…" sx={fieldSx} />
          <TextField label="Excerpt (summary / meta description)" value={f.excerpt} onChange={set('excerpt')} fullWidth multiline minRows={2} sx={fieldSx} />
          <TextField label="Body (Markdown)" value={f.body_md} onChange={set('body_md')} fullWidth multiline minRows={14}
            sx={{ ...fieldSx, '& textarea': { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13.5, lineHeight: 1.7, direction: rtl ? 'rtl' : 'ltr' } }} />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }}><Typography sx={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>SEO overrides (optional)</Typography></Divider>
          <TextField label="SEO title" value={f.seo_title} onChange={set('seo_title')} fullWidth sx={fieldSx} />
          <TextField label="SEO description" value={f.seo_description} onChange={set('seo_description')} fullWidth multiline minRows={2} sx={fieldSx} />

          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button variant="contained" onClick={save} disabled={busy || !f.title} sx={{ ...oliveBtn, px: 4 }}>
              {busy ? <CircularProgress size={20} sx={{ color: '#0b0b0b' }} /> : (f.published ? 'Save & publish' : 'Save draft')}
            </Button>
            <Button onClick={onCancel} sx={{ fontFamily: FONT, color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}>Cancel</Button>
          </Stack>
        </Stack>

        {/* Live preview */}
        <Box sx={{ border: HAIR, borderRadius: '16px', p: { xs: 2, md: 3 }, backgroundImage: CARD_BG, maxHeight: '82vh', overflowY: 'auto', position: { md: 'sticky' }, top: 16 }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 11, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 2, fontWeight: 700 }}>LIVE PREVIEW</Typography>
          <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ textAlign: rtl ? 'right' : 'left' }}>
            {f.cover_image && <Box component="img" src={f.cover_image} alt="" sx={{ width: '100%', aspectRatio: '16/8', objectFit: 'cover', borderRadius: '12px', mb: 3, border: HAIR }} />}
            <Typography component="h1" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 24, md: 34 }, color: '#fff', mb: 2 }}>{f.title || 'Untitled'}</Typography>
            <Markdown>{f.body_md}</Markdown>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Row({ r, pw, onChanged, onEdit, onDelete }) {
  const [busy, setBusy] = useState(false)
  const rtlTitle = /[؀-ۿ]/.test(r.title)

  async function togglePublish() {
    setBusy(true)
    try {
      await insightsAdmin('setPublished', pw, { id: r.id, published: !r.published })
      onChanged()
    } catch (e) {
      alert(e.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, md: 2 }}
      sx={{ px: { xs: 2, md: 2.5 }, py: 1.8, borderRadius: '14px', border: HAIR, mb: 1.5,
        backgroundImage: CARD_BG, transition: 'border-color .2s, transform .2s',
        '&:hover': { borderColor: 'rgba(140,141,37,0.4)' } }}>
      <Chip label={r.lang} size="small" sx={{ fontFamily: FONT, fontWeight: 700, bgcolor: 'rgba(140,141,37,0.18)',
        color: '#c8c95a', border: '1px solid rgba(140,141,37,0.3)', minWidth: 46, height: 26, borderRadius: '7px' }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography dir={rtlTitle ? 'rtl' : 'ltr'} sx={{ fontFamily: FONT, fontSize: 15, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: rtlTitle ? 'right' : 'left' }}>{r.title}</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          /insights/{r.slug}{r.category ? `  ·  ${r.category}` : ''}
        </Typography>
      </Box>
      <StatusChip published={r.published} />

      {/* Publish / Unpublish */}
      {r.published ? (
        <Tooltip title="Unpublish (back to draft)">
          <span><IconButton onClick={togglePublish} disabled={busy} sx={{ color: 'rgba(255,255,255,0.55)' }}>
            {busy ? <CircularProgress size={18} /> : <UnpublishedOutlinedIcon fontSize="small" />}
          </IconButton></span>
        </Tooltip>
      ) : (
        <Tooltip title="Publish to the live site">
          <Button onClick={togglePublish} disabled={busy} size="small" startIcon={busy ? null : <PublishRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{ fontFamily: FONT, fontWeight: 700, textTransform: 'none', borderRadius: '9px', px: 1.6,
              color: GREEN, border: `1px solid rgba(105,239,28,0.35)`, bgcolor: 'rgba(105,239,28,0.08)',
              '&:hover': { bgcolor: 'rgba(105,239,28,0.16)', borderColor: GREEN } }}>
            {busy ? <CircularProgress size={16} sx={{ color: GREEN }} /> : 'Publish'}
          </Button>
        </Tooltip>
      )}

      {r.published && (
        <Tooltip title="Open live">
          <IconButton component="a" href={`/insights/${r.slug}`} target="_blank" rel="noreferrer" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            <OpenInNewRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Edit">
        <IconButton onClick={() => onEdit(r.id)} sx={{ color: 'rgba(255,255,255,0.7)' }}><EditRoundedIcon fontSize="small" /></IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={() => onDelete(r.id, r.title)} sx={{ color: 'rgba(255,120,120,0.8)' }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
      </Tooltip>
    </Stack>
  )
}

export default function InsightsAdminPage() {
  const [pw, setPw] = useState(() => sessionStorage.getItem(PW_KEY) || '')
  const [authed, setAuthed] = useState(false)
  const [rows, setRows] = useState(null)
  const [editing, setEditing] = useState(null)
  const [err, setErr] = useState('')

  async function load(password) {
    setErr('')
    try {
      const { rows } = await insightsAdmin('list', password)
      setRows(rows)
      setAuthed(true)
    } catch (e) {
      setErr(e.message || 'Failed to load')
      if (String(e.message).includes('Unauthorized')) {
        sessionStorage.removeItem(PW_KEY); setAuthed(false); setPw('')
      }
    }
  }

  useEffect(() => {
    if (pw) load(pw)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function openEdit(id) {
    try {
      const { row } = await insightsAdmin('get', pw, { id })
      setEditing(row)
    } catch (e) { setErr(e.message) }
  }

  async function remove(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await insightsAdmin('delete', pw, { id })
      load(pw)
    } catch (e) { setErr(e.message) }
  }

  function logout() {
    sessionStorage.removeItem(PW_KEY)
    setAuthed(false); setPw(''); setRows(null)
  }

  const [langTab, setLangTab] = useState('all')

  const langCounts = useMemo(() => {
    const c = { all: (rows || []).length, en: 0, ru: 0, ar: 0, fa: 0 }
    for (const r of rows || []) if (c[r.lang] !== undefined) c[r.lang] += 1
    return c
  }, [rows])

  const grouped = useMemo(() => {
    const list = (rows || []).filter((r) => langTab === 'all' || r.lang === langTab)
    return [...list].sort((a, b) =>
      new Date(b.published_at || b.updated_at || 0) - new Date(a.published_at || a.updated_at || 0))
  }, [rows, langTab])

  const draftCount = useMemo(() => (rows || []).filter((r) => !r.published).length, [rows])

  if (!authed) {
    return <Login onAuthed={(p) => { setPw(p); load(p) }} />
  }

  return (
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', color: '#fff',
      background: 'radial-gradient(90% 50% at 50% 0%, rgba(140,141,37,0.08) 0%, rgba(0,0,0,0) 50%), #000' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 12 } }}>
        {editing ? (
          <Editor pw={pw} row={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); load(pw) }} />
        ) : (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: OLIVE_BRIGHT, mb: 0.5 }}>INSIGHTS ADMIN</Typography>
                <Typography sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 28, md: 38 }, color: '#fff', lineHeight: 1.1 }}>Articles</Typography>
                {rows && (
                  <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: 'rgba(255,255,255,0.5)', mt: 0.8 }}>
                    {rows.length} total · {draftCount} draft{draftCount === 1 ? '' : 's'}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setEditing({ ...EMPTY })} sx={oliveBtn}>New article</Button>
                <Tooltip title="Sign out">
                  <IconButton onClick={logout} sx={{ color: 'rgba(255,255,255,0.55)', border: HAIR, borderRadius: '10px' }}><LogoutRoundedIcon fontSize="small" /></IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            {err && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{err}</Alert>}

            {/* Language tabs */}
            <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', rowGap: 1 }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'en', label: 'English' },
                { key: 'ru', label: 'Русский' },
                { key: 'ar', label: 'العربية' },
                { key: 'fa', label: 'فارسی' },
              ].map((t) => {
                const active = langTab === t.key
                return (
                  <Button key={t.key} onClick={() => setLangTab(t.key)}
                    sx={{ fontFamily: FONT, fontWeight: 700, textTransform: 'none', fontSize: 13.5,
                      px: 2, py: 0.7, borderRadius: '10px', minWidth: 0,
                      color: active ? '#c8c95a' : 'rgba(255,255,255,0.6)',
                      border: active ? '1px solid rgba(140,141,37,0.55)' : HAIR,
                      bgcolor: active ? 'rgba(140,141,37,0.16)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(140,141,37,0.10)', borderColor: 'rgba(140,141,37,0.4)' } }}>
                    {t.label}
                    <Box component="span" sx={{ ml: 0.8, fontSize: 11.5, fontWeight: 700,
                      color: active ? 'rgba(200,201,90,0.8)' : 'rgba(255,255,255,0.35)' }}>
                      {langCounts[t.key] ?? 0}
                    </Box>
                  </Button>
                )
              })}
            </Stack>

            {rows === null ? (
              <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress sx={{ color: OLIVE_BRIGHT }} /></Box>
            ) : grouped.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center', border: HAIR, borderRadius: '16px', backgroundImage: CARD_BG }}>
                <Typography sx={{ fontFamily: FONT, color: 'rgba(255,255,255,0.5)' }}>No articles yet. Create your first one.</Typography>
              </Box>
            ) : (
              <Box>
                {grouped.map((r) => (
                  <Row key={r.id} r={r} pw={pw} onChanged={() => load(pw)} onEdit={openEdit} onDelete={remove} />
                ))}
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}
