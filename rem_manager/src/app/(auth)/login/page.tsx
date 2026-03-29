"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("charlie@acme.com");
  const [password, setPassword] = useState("password");

  function handleDemo() {
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 space-y-1">
        <div className="flex items-center gap-2 mb-4 lg:hidden">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 4L10 9L12 6L14 12H2Z" fill="currentColor" className="text-primary-foreground" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg">ExpenseFlow</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDemo();
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
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
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4 border-primary/30 text-primary hover:bg-primary/10"
          onClick={handleDemo}
        >
          Continue to Demo →
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        No account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
