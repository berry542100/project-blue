export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
      />

      <main className="relative z-10 w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          Project Blue
        </h1>
        <p className="mt-4 text-lg text-zinc-400 sm:mt-5 sm:text-xl md:text-2xl">
          AI Decision Engine
        </p>

        <div className="mt-12 space-y-6 sm:mt-16">
          <input
            type="text"
            placeholder="What decision are you trying to make today?"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-4 text-base text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:px-6 sm:py-5 sm:text-lg"
          />
          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-500 active:bg-blue-700 sm:py-5 sm:text-lg"
          >
            Start Analysis
          </button>
        </div>
      </main>
    </div>
  );
}
