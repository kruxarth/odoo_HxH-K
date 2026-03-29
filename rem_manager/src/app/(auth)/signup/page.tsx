"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "United States", currency: "USD" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", currency: "GBP" },
  { code: "EU", flag: "🇪🇺", name: "European Union", currency: "EUR" },
  { code: "CA", flag: "🇨🇦", name: "Canada", currency: "CAD" },
  { code: "AU", flag: "🇦🇺", name: "Australia", currency: "AUD" },
  { code: "IN", flag: "🇮🇳", name: "India", currency: "INR" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("US");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];

  async function handleCreate() {
    if (!name || !email || !password) return;
    setError("");
    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        companyName: company,
        country,
        currency: selectedCountry.currency,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <>
      <style>{`
        @keyframes auth-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-in { animation: auth-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .auth-in-1 { animation-delay: 0.05s; }
        .auth-in-2 { animation-delay: 0.12s; }
        .auth-in-3 { animation-delay: 0.19s; }
        .auth-in-4 { animation-delay: 0.26s; }
        @keyframes step-in {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .step-in { animation: step-in 0.35s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="w-full max-w-[400px]">

        {/* Mobile logo */}
        <div className="auth-in flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 4L10 9L12 6L14 12H2Z" fill="white" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg">ExpenseFlow</span>
        </div>

        {/* Step indicator + heading */}
        <div className="auth-in auth-in-1 mb-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.22em] font-mono">
              New workspace
            </p>
            <div className="flex items-center gap-1.5">
              <span
                className="font-heading font-bold text-lg leading-none transition-colors"
                style={{ color: step >= 1 ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                01
              </span>
              <span className="w-6 h-px bg-border" />
              <span
                className="font-heading font-bold text-lg leading-none transition-colors"
                style={{ color: step >= 2 ? "var(--color-primary)" : "var(--color-muted-foreground)/40" }}
              >
                02
              </span>
            </div>
          </div>
          <h1 className="font-heading text-[2.4rem] font-bold text-foreground leading-[1.08]">
            {step === 1 ? (
              <>Set up your<br />company</>
            ) : (
              <>Create your<br />admin account</>
            )}
          </h1>
        </div>

        {/* Step 1 — Company */}
        {step === 1 && (
          <div key="step1" className="step-in space-y-7">
            <div className="space-y-2">
              <label
                className="block text-[10px] uppercase tracking-[0.22em] font-mono transition-colors duration-200"
                style={{ color: focused === "company" ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                Company name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onFocus={() => setFocused("company")}
                onBlur={() => setFocused(null)}
                placeholder="Acme Corp"
                className="w-full py-2.5 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/35 focus:outline-none transition-colors duration-200"
                style={{
                  borderBottom: `2px solid ${focused === "company" ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-[10px] uppercase tracking-[0.22em] font-mono transition-colors duration-200"
                style={{ color: focused === "country" ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                Country & currency
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onFocus={() => setFocused("country")}
                  onBlur={() => setFocused(null)}
                  className="w-full py-2.5 bg-transparent text-foreground text-sm focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                  style={{
                    borderBottom: `2px solid ${focused === "country" ? "var(--color-primary)" : "var(--color-border)"}`,
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} · {c.currency}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                >
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!company.trim()}
              className="w-full py-3.5 bg-primary text-primary-foreground font-heading font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 flex items-center justify-center gap-2 group"
              style={{ boxShadow: "0 4px 20px oklch(0.60 0.17 55 / 0.30)" }}
            >
              Continue
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              >
                <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Step 2 — Account */}
        {step === 2 && (
          <div key="step2" className="step-in space-y-7">
            <div className="space-y-2">
              <label
                className="block text-[10px] uppercase tracking-[0.22em] font-mono transition-colors duration-200"
                style={{ color: focused === "name" ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="Alice Chen"
                className="w-full py-2.5 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/35 focus:outline-none transition-colors duration-200"
                style={{
                  borderBottom: `2px solid ${focused === "name" ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-[10px] uppercase tracking-[0.22em] font-mono transition-colors duration-200"
                style={{ color: focused === "email" ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="alice@company.com"
                className="w-full py-2.5 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/35 focus:outline-none transition-colors duration-200"
                style={{
                  borderBottom: `2px solid ${focused === "email" ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-[10px] uppercase tracking-[0.22em] font-mono transition-colors duration-200"
                style={{ color: focused === "password" ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                className="w-full py-2.5 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/35 focus:outline-none transition-colors duration-200"
                style={{
                  borderBottom: `2px solid ${focused === "password" ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="py-3.5 px-5 border border-border text-foreground font-heading font-semibold text-sm rounded-xl hover:bg-muted/50 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12 7H2M2 7L6 3M2 7L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !name || !email || !password}
                className="flex-1 py-3.5 bg-primary text-primary-foreground font-heading font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 flex items-center justify-center gap-2 group"
                style={{ boxShadow: "0 4px 20px oklch(0.60 0.17 55 / 0.30)" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Creating
                  </>
                ) : (
                  <>
                    Create account
                    <svg
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      className="group-hover:translate-x-0.5 transition-transform duration-150"
                    >
                      <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <p className="auth-in auth-in-4 mt-8 text-xs text-muted-foreground text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium underline underline-offset-4 hover:opacity-75 transition-opacity"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
