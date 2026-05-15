export default function AudioSection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight">
          Generate audio and music
        </h2>
        <p className="mt-4 text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
          Compose royalty-free tracks, voiceovers, and sound effects in seconds. Just describe the mood,
          and Promptverse takes care of the rest.
        </p>
      </div>

      <div className="max-w-6xl mx-auto rounded-2xl border border-white/10 bg-card p-8 md:p-12 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-display font-medium text-2xl md:text-3xl tracking-tight leading-snug">
              Enhance Your Projects with Ultra-Realistic AI Voices
            </h3>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Pick from 200+ studio-quality voices in 40 languages. Adjust tone, pacing, and emotion to match your story.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/80">
                Text-to-speech
              </span>
              <span className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/80">
                Voice cloning
              </span>
              <span className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/80">
                Music generation
              </span>
            </div>
            <button className="mt-8 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-all">
              Try Audio Studio
            </button>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-violet-900/40 via-rose-700/30 to-amber-600/30">
            <div className="absolute inset-0 grid place-items-center">
              <button
                aria-label="Play preview"
                className="size-16 rounded-full bg-white/95 text-black grid place-items-center hover:scale-110 transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                <div className="w-1/3 h-full bg-white" />
              </div>
              <span className="text-xs text-white/80">1:24 / 3:50</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
