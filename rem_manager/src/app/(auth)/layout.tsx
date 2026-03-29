export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-[42%] flex-col p-12 bg-[oklch(0.60_0.17_55)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(oklch(1 0 0 / 0.1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 4L10 9L12 6L14 12H2Z" fill="white" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl text-white">ExpenseFlow</span>
        </div>

        {/* Centered branding */}
        <div className="relative flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <h2 className="font-heading text-4xl font-bold text-white leading-tight">
              Reimbursements,<br />streamlined.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Submit, track, and approve expenses in one place. Built for teams that move fast.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              "OCR receipt scanning",
              "Multi-step approval workflows",
              "Real-time expense tracking",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {feat}
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-white/40">
          © 2024 ExpenseFlow · Acme Corp Demo
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        {children}
      </div>
    </div>
  );
}
