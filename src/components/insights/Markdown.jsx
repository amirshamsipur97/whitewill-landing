/**
 * Markdown — renders an article body (GitHub-flavoured markdown) in the
 * site's olive-luxury language. Sanitised (rehype-sanitize) so author content
 * can never inject scripts. RTL-aware: pass dir="rtl" via the wrapping page.
 */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Box, Typography } from '@mui/material'
import { FONT, OLIVE_BRIGHT, HAIR, HAIR_SOFT } from '../invest/ui.jsx'

const text = 'rgba(255,255,255,0.82)'

const components = {
  h1: ({ children }) => (
    <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 300, fontSize: { xs: 26, md: 36 }, lineHeight: 1.25, color: '#fff', mt: { xs: 4, md: 6 }, mb: 2 }}>{children}</Typography>
  ),
  h2: ({ children }) => (
    <Typography component="h2" sx={{ fontFamily: FONT, fontWeight: 400, fontSize: { xs: 22, md: 28 }, lineHeight: 1.3, color: '#fff', mt: { xs: 4, md: 5.5 }, mb: 1.8, '&::before': { content: '""', display: 'inline-block', width: 22, height: 2, mr: 1.2, mb: '5px', bgcolor: OLIVE_BRIGHT, verticalAlign: 'middle' } }}>{children}</Typography>
  ),
  h3: ({ children }) => (
    <Typography component="h3" sx={{ fontFamily: FONT, fontWeight: 600, fontSize: { xs: 18, md: 21 }, color: '#fff', mt: { xs: 3, md: 4 }, mb: 1.4 }}>{children}</Typography>
  ),
  p: ({ children }) => (
    <Typography sx={{ fontFamily: FONT, fontSize: { xs: 15.5, md: 17 }, lineHeight: 1.95, color: text, mb: 2.4 }}>{children}</Typography>
  ),
  a: ({ children, href }) => (
    <Box component="a" href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" sx={{ color: OLIVE_BRIGHT, textDecoration: 'none', borderBottom: `1px solid ${OLIVE_BRIGHT}55`, '&:hover': { borderBottomColor: OLIVE_BRIGHT } }}>{children}</Box>
  ),
  strong: ({ children }) => <Box component="strong" sx={{ color: '#fff', fontWeight: 700 }}>{children}</Box>,
  em: ({ children }) => <Box component="em" sx={{ fontStyle: 'italic' }}>{children}</Box>,
  ul: ({ children }) => <Box component="ul" sx={{ pl: 0, mb: 2.6, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.1 }}>{children}</Box>,
  ol: ({ children }) => <Box component="ol" sx={{ pl: 3, mb: 2.6, display: 'flex', flexDirection: 'column', gap: 1.1, '& li': { fontFamily: FONT, fontSize: { xs: 15.5, md: 16.5 }, lineHeight: 1.8, color: text } }}>{children}</Box>,
  li: ({ children, ordered }) =>
    ordered ? (
      <Box component="li">{children}</Box>
    ) : (
      <Box component="li" sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', fontFamily: FONT, fontSize: { xs: 15.5, md: 16.5 }, lineHeight: 1.8, color: text, '&::before': { content: '""', flexShrink: 0, width: 7, height: 7, mt: '9px', borderRadius: '2px', bgcolor: OLIVE_BRIGHT, transform: 'rotate(45deg)' } }}>
        <Box component="span">{children}</Box>
      </Box>
    ),
  blockquote: ({ children }) => (
    <Box component="blockquote" sx={{ m: 0, my: 3, px: { xs: 2.5, md: 3 }, py: { xs: 1.5, md: 2 }, borderInlineStart: `2px solid ${OLIVE_BRIGHT}`, bgcolor: 'rgba(140,141,37,0.06)', borderRadius: '0 10px 10px 0', '& p': { mb: 0, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' } }}>{children}</Box>
  ),
  hr: () => <Box sx={{ my: 4, borderTop: HAIR }} />,
  img: ({ src, alt }) => (
    <Box component="img" src={src} alt={alt || ''} loading="lazy" sx={{ display: 'block', width: '100%', height: 'auto', borderRadius: '14px', border: HAIR, my: 3 }} />
  ),
  code: ({ inline, children }) =>
    inline ? (
      <Box component="code" sx={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.88em', px: 0.7, py: 0.2, borderRadius: '5px', bgcolor: 'rgba(255,255,255,0.08)' }}>{children}</Box>
    ) : (
      <Box component="pre" dir="ltr" sx={{ overflowX: 'auto', p: 2, my: 3, borderRadius: '12px', border: HAIR, bgcolor: 'rgba(255,255,255,0.03)', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}><code>{children}</code></Box>
    ),
  table: ({ children }) => (
    <Box sx={{ overflowX: 'auto', my: 3, border: HAIR, borderRadius: '14px' }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& th, & td': { textAlign: 'start', px: { xs: 1.6, md: 2.4 }, py: 1.4, borderBottom: HAIR_SOFT, fontFamily: FONT, fontSize: { xs: 13.5, md: 14.5 } }, '& th': { color: OLIVE_BRIGHT, fontWeight: 700, bgcolor: 'rgba(255,255,255,0.03)' }, '& td': { color: text } }}>{children}</Box>
    </Box>
  ),
}

export default function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
      {children || ''}
    </ReactMarkdown>
  )
}
