const IMAGES = [
  '/images/ai1.png',
  '/images/ai2.png',
  '/images/ai3.png',
  '/images/ai4.png',
  '/images/ai5.png',
  '/images/ai6.png',
]

export default function ImagesSection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight">
          Images like never seen before
        </h2>
        <p className="mt-4 text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
          Generate stunning, original visuals from a single prompt. Photo-real, illustration, abstract — your imagination is the only limit.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl overflow-hidden bg-card border border-white/5 group relative"
          >
            <img
              src={src}
              alt={`AI generated artwork ${i + 1}`}
              className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
