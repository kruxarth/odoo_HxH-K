"use client";

import Link from "next/link";
import { useMockStore } from "@/lib/mock-store";
import {
  formatCurrency,
  formatRelativeDate,
  getUserById,
  CATEGORY_LABELS,
} from "@/lib/mock-data";
import { ExpenseStatusBadge } from "@/components/expenses/ExpenseStatusBadge";
import { ArrowRight } from "@phosphor-icons/react";

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-border p-5 grid-pattern relative overflow-hidden ${accent ? "amber-glow" : ""}`}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className={`font-heading text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {[0.3, 0.5, 0.7, 0.6, 0.9, 0.8, 1].map((scale, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-primary/30"
          style={{ height: `${Math.max(10, scale * pct)}%` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { role, currentUser, expenses, approvals, users, rules } = useMockStore();

  // Compute stats
  const myExpenses = expenses.filter(
    (e) => role === "EMPLOYEE" ? e.submittedById === currentUser.id : true
  );

  const teamExpenses = role === "MANAGER"
    ? expenses.filter((e) => {
        const submitter = getUserById(e.submittedById);
        return submitter?.managerId === currentUser.id;
      })
    : [];

  const pending = myExpenses.filter((e) => e.status === "PENDING");
  const approved = myExpenses.filter((e) => e.status === "APPROVED");
  const rejected = myExpenses.filter((e) => e.status === "REJECTED");
  const totalApprovedAmount = approved.reduce((s, e) => s + e.amount, 0);

  const pendingApprovals = approvals.filter(
    (a) => a.approverId === currentUser.id && a.status === "PENDING"
  );

  const recentExpenses = [...myExpenses]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const maxAmount = Math.max(...myExpenses.map((e) => e.amount), 1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {role === "EMPLOYEE"
              ? `Hello, ${currentUser.name.split(" ")[0]}`
              : role === "MANAGER"
              ? "Manager Overview"
              : "Company Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date("2024-03-12").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/expenses/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New Expense
        </Link>
      </div>

      {/* Stats grid */}
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
            <StatCard label="Pending Approvals" value={String(pendingApprovals.length)} accent />
            <StatCard label="Team Expenses" value={String(teamExpenses.length)} />
            <StatCard
              label="Team Total"
              value={formatCurrency(teamExpenses.reduce((s, e) => s + e.amount, 0))}
            />
            <StatCard
              label="Approved"
              value={String(teamExpenses.filter((e) => e.status === "APPROVED").length)}
            />
          </>
        ) : (
          <>
            <StatCard label="Total Expenses" value={String(expenses.length)} />
            <StatCard label="Pending" value={String(expenses.filter((e) => e.status === "PENDING").length)} accent />
            <StatCard label="Users" value={String(users.length)} />
            <StatCard label="Rules" value={String(rules.length)} />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent expenses */}
        <div className="lg:col-span-2 rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-heading font-semibold text-sm text-foreground">Recent Expenses</h2>
            <Link
              href="/expenses"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentExpenses.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No expenses yet.{" "}
                <Link href="/expenses/new" className="text-primary hover:underline">
                  Submit one →
                </Link>
              </div>
            ) : (
              recentExpenses.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/expenses/${exp.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-card/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {CATEGORY_LABELS[exp.category]} · {formatRelativeDate(exp.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-medium text-sm">
                      {formatCurrency(exp.amount)}
                    </span>
                    <ExpenseStatusBadge status={exp.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Activity feed / Chart */}
        <div className="rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-heading font-semibold text-sm text-foreground">Spend Overview</h2>
          <MiniBar value={totalApprovedAmount} max={maxAmount * myExpenses.length} />
          <div className="space-y-2">
            {(["PENDING", "APPROVED", "REJECTED"] as const).map((status) => {
              const count = myExpenses.filter((e) => e.status === status).length;
              const pct = myExpenses.length === 0 ? 0 : Math.round((count / myExpenses.length) * 100);
              const color =
                status === "APPROVED"
                  ? "bg-emerald-400"
                  : status === "REJECTED"
                  ? "bg-rose-400"
                  : "bg-sky-400";
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
          {role !== "EMPLOYEE" && pendingApprovals.length > 0 && (
            <div className="pt-2 border-t border-border">
              <Link
                href="/approvals"
                className="flex items-center justify-between text-xs text-primary hover:underline"
              >
                <span>{pendingApprovals.length} pending approval{pendingApprovals.length !== 1 ? "s" : ""}</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
