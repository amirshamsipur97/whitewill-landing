import { useEffect, useState } from 'react'
import CtaPill from './CtaPill'
import ChatPanel from './ChatPanel'
import { useI18n } from '../../i18n.jsx'

/**
 * Sticky support widget — fixed at bottom-left for the entire site.
 * The pill and the panel are mutually exclusive:
 *   - closed: only CtaPill visible
 *   - open:   only ChatPanel visible (the pill hides)
 *
 * Dispatches `chat:open` / `chat:close` events on the window so other
 * sections (DiscoverProperties, AthurayaCity) can hide their cursor-
 * following cards while the AI panel is visible.
 *
 * No state is persisted across page loads on purpose — the widget should
 * feel always-available rather than "remembering" that you dismissed it.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(open ? 'chat:open' : 'chat:close'))
  }, [open])

  return (
    <>
      {!open && (
        <CtaPill
          onClick={() => setOpen(true)}
          label={t.chatPill?.label || "Let's work together"}
        />
      )}
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}
