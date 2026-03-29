export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-[oklch(0.11_0.006_60)] border-r border-border relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center amber-glow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 12L6 4L10 9L12 6L14 12H2Z" fill="currentColor" className="text-primary-foreground" />
              </svg>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">ExpenseFlow</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <div className="space-y-3">
            <h2 className="font-heading text-4xl font-bold text-foreground leading-tight">
              Reimbursements,<br />
              <span className="text-primary">streamlined.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Submit, track, and approve expenses in one place. Built for teams that move fast.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              "OCR receipt scanning",
              "Multi-step approval workflows",
              "Real-time expense tracking",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-primary" />
                {feat}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-muted-foreground">
          © 2024 ExpenseFlow · Acme Corp Demo
        </div>
      </div>
      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
