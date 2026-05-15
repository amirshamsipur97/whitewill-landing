import Sparkles from './Sparkles'

export default function Hero() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <Sparkles />

      <div className="relative max-w-4xl mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-2 mb-8 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-white" />
          Promptverse AI
        </div>

        <h1 className="font-display font-medium text-5xl md:text-7xl leading-[1.05] tracking-tight">
          Find Inspiration.
          <br />
          Create. Generate.
          <br />
          Produce &amp; Automate.
        </h1>

        <p className="mt-8 text-base text-white/60 leading-relaxed max-w-xl mx-auto">
          Discover endless creativity with PromptVerse. Generate diverse content effortlessly using prompts.
          Stay updated with real-time trends, automate tasks, and extract insights from any document or URL.
          All within a sleek, futuristic design.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <button className="group inline-flex items-center gap-2 rounded-full border border-white/80 px-8 py-3.5 text-sm font-medium hover:bg-white hover:text-black transition-all">
            Start Generating
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-12">
              <path d="M14 4l2 2-9 9-3 1 1-3 9-9zm0 0l4 4M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black hover:bg-white/90 transition-all">
            Download
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
