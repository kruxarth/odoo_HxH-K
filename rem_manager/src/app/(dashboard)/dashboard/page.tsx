"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ExpenseStatusBadge } from "@/components/expenses/ExpenseStatusBadge";
import { ArrowRight } from "@phosphor-icons/react";

const CATEGORY_LABELS: Record<string, string> = {
  TRAVEL: "Travel",
  MEALS: "Meals",
  ACCOMMODATION: "Accommodation",
  EQUIPMENT: "Equipment",
  SOFTWARE: "Software",
  MARKETING: "Marketing",
  OTHER: "Other",
};

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function formatRelativeDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border border-border p-5 grid-pattern relative overflow-hidden ${accent ? "amber-glow" : ""}`}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className={`font-heading text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {[0.3, 0.5, 0.7, 0.6, 0.9, 0.8, 1].map((scale, i) => (
        <div key={i} className="flex-1 rounded-sm bg-primary/30" style={{ height: `${Math.max(10, scale * pct)}%` }} />
      ))}
    </div>
  );
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  amountInCompanyCurrency: number;
  category: string;
  status: string;
  submittedAt: string;
  user?: { name: string };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "EMPLOYEE";
  const userId = session?.user?.id ?? "";
  const firstName = (session?.user?.name ?? "").split(" ")[0];

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [ruleCount, setRuleCount] = useState(0);

  useEffect(() => {
    fetch("/api/expenses").then((r) => r.json()).then(setExpenses).catch(() => {});
    if (role === "ADMIN") {
      fetch("/api/users").then((r) => r.json()).then((d) => setUserCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
      fetch("/api/rules").then((r) => r.json()).then((d) => setRuleCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
    }
  }, [role, userId]);

  const myExpenses = role === "EMPLOYEE" ? expenses.filter((e) => true) : expenses;
  const pending = myExpenses.filter((e) => e.status === "PENDING");
  const approved = myExpenses.filter((e) => e.status === "APPROVED");
  const rejected = myExpenses.filter((e) => e.status === "REJECTED");
  const totalApprovedAmount = approved.reduce((s, e) => s + (e.amountInCompanyCurrency || e.amount), 0);
  const recentExpenses = [...myExpenses].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5);
  const maxAmount = Math.max(...myExpenses.map((e) => e.amountInCompanyCurrency || e.amount), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {role === "EMPLOYEE" ? `Hello, ${firstName}` : role === "MANAGER" ? "Manager Overview" : "Company Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link href="/expenses/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Expense
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {role === "EMPLOYEE" ? (
          <>
            <StatCard label="Total Submitted" value={String(myExpenses.length)} />
            <StatCard label="Pending" value={String(pending.length)} sub="awaiting review" />
            <StatCard label="Approved" value={String(approved.length)} sub={formatCurrency(totalApprovedAmount)} accent />
            <StatCard label="Rejected" value={String(rejected.length)} />
          </>
        ) : role === "MANAGER" ? (
          <>
            <StatCard label="Team Expenses" value={String(myExpenses.length)} accent />
            <StatCard label="Pending" value={String(pending.length)} />
            <StatCard label="Approved" value={String(approved.length)} />
            <StatCard label="Team Total" value={formatCurrency(totalApprovedAmount)} />
          </>
        ) : (
          <>
            <StatCard label="Total Expenses" value={String(expenses.length)} />
            <StatCard label="Pending" value={String(pending.length)} accent />
            <StatCard label="Users" value={String(userCount)} />
            <StatCard label="Rules" value={String(ruleCount)} />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-heading font-semibold text-sm text-foreground">Recent Expenses</h2>
            <Link href="/expenses" className="flex items-center gap-1 text-xs text-primary hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentExpenses.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No expenses yet.{" "}
                <Link href="/expenses/new" className="text-primary hover:underline">Submit one →</Link>
              </div>
            ) : (
              recentExpenses.map((exp) => (
                <Link key={exp.id} href={`/expenses/${exp.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-card/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {CATEGORY_LABELS[exp.category] ?? exp.category} · {formatRelativeDate(exp.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-medium text-sm">{formatCurrency(exp.amount, exp.currency)}</span>
                    <ExpenseStatusBadge status={exp.status as any} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-heading font-semibold text-sm text-foreground">Spend Overview</h2>
          <MiniBar value={totalApprovedAmount} max={maxAmount * myExpenses.length} />
          <div className="space-y-2">
            {(["PENDING", "APPROVED", "REJECTED"] as const).map((status) => {
              const count = myExpenses.filter((e) => e.status === status).length;
              const pct = myExpenses.length === 0 ? 0 : Math.round((count / myExpenses.length) * 100);
              const color = status === "APPROVED" ? "bg-emerald-400" : status === "REJECTED" ? "bg-rose-400" : "bg-sky-400";
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
