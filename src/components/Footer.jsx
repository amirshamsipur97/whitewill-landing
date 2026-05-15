const COLUMNS = [
  { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Changelog'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
  { title: 'Resources', links: ['Docs', 'Help center', 'Community', 'Contact'] },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 px-8 py-14">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-7 rounded-md bg-gradient-to-br from-white to-white/40 grid place-items-center">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <span className="font-display font-semibold text-lg">Promptverse</span>
          </div>
          <p className="text-sm text-white/50 max-w-xs leading-relaxed">
            Discover endless creativity. Generate diverse content effortlessly with Promptverse AI.
          </p>
        </div>
        {COLUMNS.map(col => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
        <p className="text-xs text-white/40">© 2026 Promptverse. All rights reserved.</p>
        <div className="flex items-center gap-3">
          {['𝕏', 'in', 'ⓘ'].map(s => (
            <a
              key={s}
              href="#"
              className="size-8 rounded-full border border-white/15 grid place-items-center text-xs text-white/70 hover:bg-white hover:text-black transition-all"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
