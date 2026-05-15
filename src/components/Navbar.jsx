export default function Navbar() {
  const links = ['Home', 'Features', 'Pricing', 'About']
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-gradient-to-br from-white to-white/40 grid place-items-center">
            <span className="text-black font-bold text-sm">P</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">Promptverse</span>
        </div>
        <ul className="hidden md:flex items-center gap-10 text-sm text-white/80">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a>
            </li>
          ))}
        </ul>
        <button className="rounded-full border border-white/30 px-5 py-2 text-sm hover:bg-white hover:text-black transition-colors">
          Sign In
        </button>
      </nav>
    </header>
  )
}
