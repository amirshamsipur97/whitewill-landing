import { useState } from 'react'
import CtaPill from './CtaPill'
import ChatPanel from './ChatPanel'

/**
 * Sticky support widget — fixed at bottom-left for the entire site.
 * The pill and the panel are mutually exclusive:
 *   - closed: only CtaPill visible
 *   - open:   only ChatPanel visible (the pill hides)
 *
 * No state is persisted across page loads on purpose — the widget should
 * feel always-available rather than "remembering" that you dismissed it.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {!open && <CtaPill onClick={() => setOpen(true)} />}
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}
