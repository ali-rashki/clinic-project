import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main id="home" className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid items-center gap-10 rounded-[32px] border border-[#5D4FFF]/10 bg-white px-6 py-8 shadow-[0_20px_80px_-36px_rgba(93,79,255,0.55)] md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-10">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-[#5D4FFF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#5D4FFF]">
              Modern clinic care
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Smart, friendly healthcare for every visit.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Streamline appointments, improve patient experience, and keep every consultation organized with a clean digital front door.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-full bg-[#5D4FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b3fe8]"
              >
                Schedule now
              </a>
              <a
                href="#services"
                className="rounded-full border border-[#5D4FFF]/20 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#5D4FFF]/5"
              >
                View services
              </a>
            </div>
          </div>

          <div className="grid gap-3 rounded-[28px] bg-slate-950 p-4 text-white">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-white/60">Today</p>
              <p className="mt-3 text-3xl font-bold">24 appointments</p>
              <p className="mt-2 text-sm text-white/70">Across all care teams and virtual rooms.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-[#5D4FFF] p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">Priority</p>
                <p className="mt-3 text-2xl font-bold">High</p>
                <p className="mt-2 text-sm text-white/80">New patient check-ins awaiting response.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Response</p>
                <p className="mt-3 text-2xl font-bold">14 min</p>
                <p className="mt-2 text-sm text-white/70">Average queue time across the clinic.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
