"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
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

        {/* Heading */}
        <div className="auth-in auth-in-1 mb-10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.22em] font-mono mb-3">
            Welcome back
          </p>
          <h1 className="font-heading text-[2.4rem] font-bold text-foreground leading-[1.08]">
            Sign in to your<br />workspace
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="auth-in auth-in-2 space-y-7 mb-6">
            {/* Email */}
            <div className="space-y-2">
              <label
                className="block text-[10px] uppercase tracking-[0.22em] font-mono transition-colors duration-200"
                style={{ color: focused === "email" ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@company.com"
                required
                className="w-full py-2.5 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/35 focus:outline-none transition-colors duration-200"
                style={{
                  borderBottom: `2px solid ${focused === "email" ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              />
            </div>

            {/* Password */}
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
                required
                className="w-full py-2.5 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/35 focus:outline-none transition-colors duration-200"
                style={{
                  borderBottom: `2px solid ${focused === "password" ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              />
            </div>
          </div>

          {error && (
            <div className="auth-in mb-5 flex items-center gap-2 text-xs text-destructive">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="auth-in auth-in-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-primary-foreground font-heading font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 group"
              style={{ boxShadow: "0 4px 20px oklch(0.60 0.17 55 / 0.30)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in
                </>
              ) : (
                <>
                  Sign in
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
        </form>

        <p className="auth-in auth-in-4 mt-8 text-xs text-muted-foreground text-center">
          No workspace yet?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium underline underline-offset-4 hover:opacity-75 transition-opacity"
          >
            Create one free
          </Link>
        </p>
      </div>
    </>
  );
}
