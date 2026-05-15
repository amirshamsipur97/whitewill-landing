const SIDEBAR_ITEMS = [
  'Project research',
  'Marketing copy',
  'Code review',
  'Email drafts',
  'Blog ideas',
  'Social posts',
]

const COLUMN_PROMPTS = [
  [
    'Write a hero title for our SaaS landing page',
    'Generate 5 catchy taglines for an AI startup',
    'Outline a 6-week content calendar',
    'Draft a cold email to a potential client',
    'Create a feature comparison table',
  ],
  [
    'Summarize this 30-page report into bullet points',
    'Translate the following article to Spanish',
    'Generate alt text for these 10 images',
    'Write a press release for our new launch',
    'Create a FAQ for our support page',
  ],
  [
    'Suggest A/B test variations for our CTA',
    'Convert this Figma spec into a Tailwind layout',
    'Draft user research interview questions',
    'Build a pitch deck outline',
    'Write SEO meta descriptions for 10 pages',
  ],
]

function PromptItem({ text }) {
  return (
    <div className="rounded-md bg-card-2 border border-white/5 px-4 py-3 text-xs text-white/85 leading-relaxed hover:border-white/15 transition-colors">
      {text}
    </div>
  )
}

export default function TrendingPrompts() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="font-display font-medium text-4xl md:text-5xl tracking-tight">
          See Trending Prompts
        </h2>
        <p className="mt-4 text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
          Browse the most popular prompts shared by our community. Use them as-is or remix to fit your project.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <button className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium hover:bg-white hover:text-black transition-all">
            Browse All
          </button>
          <button className="rounded-full bg-white text-black px-7 py-3 text-sm font-medium hover:bg-white/90 transition-all">
            Try Free
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
        <div className="grid grid-cols-12 min-h-[520px]">
          <aside className="col-span-3 border-r border-white/10 p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <div className="size-5 rounded bg-gradient-to-br from-violet-500 to-blue-500" />
              <span className="text-xs font-medium">Promptverse</span>
            </div>
            <button className="rounded-md bg-accent px-3 py-2 text-xs font-medium text-white text-left mb-2">
              + New chat
            </button>
            {SIDEBAR_ITEMS.map((item, i) => (
              <div
                key={item}
                className={`px-3 py-2 text-xs rounded-md cursor-pointer ${
                  i === 0 ? 'bg-white/5 text-white' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                {item}
              </div>
            ))}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="size-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
                <span className="text-xs">My account</span>
              </div>
            </div>
          </aside>

          <div className="col-span-9 p-6">
            <div className="text-center text-sm text-white/70 mb-6">Trending Prompts</div>
            <div className="grid grid-cols-3 gap-3">
              {COLUMN_PROMPTS.map((col, ci) => (
                <div key={ci} className="space-y-3">
                  {col.map((p, pi) => <PromptItem key={pi} text={p} />)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
