const PROMPTS = [
  { text: 'Write a attractive hero title for the following website', url: 'https://zeltalabs.com/' },
  { text: 'Generate 10 social media captions about', url: 'AI productivity tools' },
  { text: 'Create a marketing email sequence for', url: 'a SaaS startup launch' },
  { text: 'Suggest blog post ideas around', url: 'sustainable design trends' },
  { text: 'Draft a product description for', url: 'a smart home device' },
  { text: 'Write a LinkedIn post about', url: 'remote-first culture' },
  { text: 'Generate code documentation for', url: 'a React component library' },
  { text: 'Outline a podcast episode covering', url: 'the future of AI' },
]

function PromptCard({ text, url }) {
  return (
    <div className="flex-shrink-0 w-[420px] rounded-md bg-card border border-white/5 px-6 py-6 flex items-start justify-between gap-3">
      <p className="text-sm text-white leading-relaxed">
        {text}
        <br />
        <span className="text-accent">{url}</span>
      </p>
      <div className="size-7 rounded-full bg-white grid place-items-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

function Row({ items, animationClass }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-6 w-max ${animationClass}`}>
        {doubled.map((p, i) => <PromptCard key={i} {...p} />)}
      </div>
    </div>
  )
}

export default function PromptScroll() {
  const row1 = PROMPTS.slice(0, 4)
  const row2 = PROMPTS.slice(2, 6)
  const row3 = PROMPTS.slice(4, 8)

  return (
    <section className="py-24 relative">
      <div className="text-center px-8 mb-14">
        <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight">
          Create more with Promptverse
        </h2>
        <p className="mt-4 text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
          Discover endless creativity with PromptVerse. Generate diverse content effortlessly using prompts —
          a sleek, futuristic experience.
        </p>
      </div>

      <div className="space-y-6">
        <Row items={row1} animationClass="animate-scroll-x" />
        <Row items={row2} animationClass="animate-scroll-x-reverse" />
        <Row items={row3} animationClass="animate-scroll-x-slow" />
      </div>

      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </section>
  )
}
