const stats = [
  { label: "Daily Users", value: "12k+" },
  { label: "Avg. Response", value: "120ms" },
  { label: "Uptime", value: "99.9%" },
]

const features = [
  {
    title: "Lightning setup",
    desc: "Start a new project in minutes with clean defaults and reusable sections.",
  },
  {
    title: "Tailwind-first UI",
    desc: "Utility-driven styling keeps the design consistent and easy to iterate.",
  },
  {
    title: "Mobile ready",
    desc: "Layouts stay crisp on phones, tablets, and desktops without extra work.",
  },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-400/90" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
                Nova
              </p>
              <p className="text-xs text-slate-400">Launch-ready UI</p>
            </div>
          </div>
          <button className="rounded-full border border-emerald-300/40 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-200 hover:text-white">
            Get Template
          </button>
        </header>

        <section className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
              New Project Kit
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
              A simple React + Tailwind starter you can ship today.
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              Clean sections, calm colors, and just enough polish to look
              professional. Use it for a landing page, portfolio, or a quick demo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300">
                Start Building
              </button>
              <button className="rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200 transition hover:border-slate-500">
                Preview Components
              </button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <p className="text-lg font-semibold text-white">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/40 p-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                Status
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Project Health</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Design polish</span>
                  <span className="text-emerald-300">Excellent</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-4/5 bg-emerald-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Launch checklist</span>
                  <span className="text-emerald-300">92%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-11/12 bg-emerald-400" />
                </div>
              </div>
              <button className="mt-6 w-full rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-200 hover:text-white">
                View Checklist
              </button>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-slate-400">{feature.desc}</p>
              <button className="mt-5 text-xs uppercase tracking-[0.2em] text-emerald-200">
                Learn more
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App
