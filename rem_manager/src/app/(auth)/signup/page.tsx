"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 space-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 12L6 4L10 9L12 6L14 12H2Z" fill="currentColor" className="text-primary-foreground" />
              </svg>
            </div>
            <span className="font-heading font-bold text-lg">ExpenseFlow</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all ${
                  s === step ? "w-6 bg-primary" : s < step ? "w-3 bg-primary/60" : "w-3 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {step === 1 ? "Create your workspace" : "Your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === 1 ? "Step 1 of 2 — Company details" : "Step 2 of 2 — Admin account"}
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Company Name
            </label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              className="bg-card border-border"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Country & Currency
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-9 px-3 rounded-md bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Currency: <span className="text-primary font-medium">{selectedCountry.currency}</span>
            </p>
          </div>
          <Button className="w-full" onClick={() => setStep(2)} disabled={!company}>
            Continue →
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Your Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice Chen"
              className="bg-card border-border"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Work Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@company.com"
              className="bg-card border-border"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-card border-border"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={loading}>
              ← Back
            </Button>
            <Button className="flex-1" onClick={handleCreate} disabled={loading || !name || !email || !password}>
              {loading ? "Creating…" : "Create Account"}
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
