export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left — amber branding panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] flex-col p-12 bg-[oklch(0.60_0.17_55)] relative overflow-hidden">

        {/* Atmospheric glow layers */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[oklch(0.75_0.20_65)] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[oklch(0.45_0.14_45)] opacity-30 blur-3xl pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.35) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Large background chart area fill */}
        <div className="absolute bottom-0 left-0 right-0 h-[52%] opacity-[0.07] pointer-events-none">
          <svg viewBox="0 0 600 300" fill="none" preserveAspectRatio="xMidYMax meet" className="w-full h-full">
            <path
              d="M0 260 C40 240 80 255 120 220 C160 185 200 200 240 155 C280 110 320 130 360 85 C400 40 440 70 480 50 C520 30 560 45 600 35 L600 300 L0 300Z"
              fill="white"
            />
            <path
              d="M0 260 C40 240 80 255 120 220 C160 185 200 200 240 155 C280 110 320 130 360 85 C400 40 440 70 480 50 C520 30 560 45 600 35"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Ghost monogram */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 font-heading font-bold text-[200px] leading-none text-white/[0.04] select-none pointer-events-none">
          EF
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 4L10 9L12 6L14 12H2Z" fill="oklch(0.52 0.17 55)" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-tight">ExpenseFlow</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="max-w-[300px]">
            <p className="text-white/50 text-[10px] uppercase tracking-[0.28em] font-mono mb-6">
              Expense Management
            </p>
            <h2 className="font-heading text-[2.6rem] font-bold text-white leading-[1.05] mb-5">
              Reimbursements,<br />
              <span className="text-white/35">streamlined.</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Submit, track, and approve expenses in one place.
              Built for teams that move fast.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-6">
            {[
              { v: "< 24h",      l: "Avg approval"  },
              { v: "Multi-step", l: "Workflows"      },
              { v: "OCR",        l: "Auto-scan"      },
            ].map(({ v, l }) => (
              <div key={l} className="flex-1 pt-3.5 border-t border-white/20 space-y-1.5">
                <p className="font-heading font-bold text-base text-white leading-none">{v}</p>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-white/25 font-mono">
          © 2024 ExpenseFlow
        </p>
      </div>

      {/* ── Right — form panel ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        {children}
      </div>
    </div>
  );
}
