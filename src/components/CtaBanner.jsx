export default function CtaBanner() {
  return (
    <section className="py-20 px-8">
      <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent px-8 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="relative">
          <h2 className="font-display font-medium text-3xl md:text-4xl tracking-tight leading-snug">
            Promptverse has no limitation.
            <br />
            Get Started in a journey with promptverse.
          </h2>
          <button className="mt-8 rounded-full bg-white text-black px-7 py-3 text-sm font-medium hover:bg-white/90 transition-all">
            Generate now
          </button>
        </div>
      </div>
    </section>
  )
}
