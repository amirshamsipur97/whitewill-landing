const FEATURES = [
  {
    title: 'Real-time Trends',
    desc: 'Stay updated with what people are creating right now. Trending topics surface every hour.',
  },
  {
    title: 'Document Insights',
    desc: 'Drop any PDF, doc, or URL — extract summaries, FAQs, and key points instantly.',
  },
  {
    title: 'Smart Templates',
    desc: '500+ ready-to-use prompt templates for marketing, code, design, and writing.',
  },
  {
    title: 'Team Workspace',
    desc: 'Collaborate on prompt libraries, share results, and version control your best generations.',
  },
  {
    title: 'API & Webhooks',
    desc: 'Plug Promptverse into your stack — REST, GraphQL, and Zapier integrations included.',
  },
  {
    title: 'Privacy First',
    desc: 'Your prompts and outputs are encrypted at rest. We never train on your private data.',
  },
]

export default function Features() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-medium tracking-[0.2em] text-white/50 mb-3">MORE FEATURES</p>
        <h2 className="font-display font-medium text-3xl md:text-5xl tracking-tight max-w-3xl leading-tight">
          Promptverse AI <span className="text-white/40">offers to an individual</span>
        </h2>
        <div className="section-divider h-px w-full mt-10" />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
