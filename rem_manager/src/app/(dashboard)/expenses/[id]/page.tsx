"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExpenseStatusBadge } from "@/components/expenses/ExpenseStatusBadge";
import { ApprovalTimeline } from "@/components/approvals/ApprovalTimeline";
import { ArrowLeft } from "@phosphor-icons/react";

const CATEGORY_LABELS: Record<string, string> = {
  TRAVEL: "Travel", MEALS: "Meals", ACCOMMODATION: "Accommodation",
  EQUIPMENT: "Equipment", SOFTWARE: "Software", MARKETING: "Marketing", OTHER: "Other",
};

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role ?? "EMPLOYEE";
  const userId = session?.user?.id ?? "";

  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  function loadExpense() {
    fetch(`/api/expenses/${id}`)
      .then((r) => r.json())
      .then(setExpense)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadExpense(); }, [id]);

  async function handleApproval(approvalId: string, decision: "APPROVED" | "REJECTED") {
    setActionLoading(true);
    await fetch(`/api/approvals/${approvalId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setActionLoading(false);
    loadExpense();
  }

  // Admin override
  async function handleOverride(status: "APPROVED" | "REJECTED") {
    setActionLoading(true);
    await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActionLoading(false);
    loadExpense();
  }

  if (loading) return <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>;
  if (!expense || expense.error) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Expense not found.</p>
        <button onClick={() => router.push("/expenses")} className="mt-4 text-primary text-sm hover:underline">
          ← Back to expenses
        </button>
      </div>
    );
  }

  const myPendingApproval = expense.approvals?.find(
    (a: any) => a.approverId === userId && a.status === "PENDING"
  );
  const canApprove = (role === "MANAGER" || role === "ADMIN") && expense.status === "PENDING";

  // Map approvals to the format ApprovalTimeline expects
  const timelineApprovals = (expense.approvals ?? []).map((a: any) => ({
    id: a.id,
    expenseId: expense.id,
    approverId: a.approverId,
    status: a.status,
    comment: a.comment,
    stepOrder: a.sequence,
    decidedAt: a.decidedAt,
    createdAt: a.createdAt,
  }));

  return (
    <div className="max-w-2xl space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-bold text-foreground leading-tight">{expense.title}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <ExpenseStatusBadge status={expense.status} />
              <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[expense.category] ?? expense.category}</span>
              <span className="text-xs text-muted-foreground">{formatDate(expense.submittedAt)}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-2xl font-bold text-primary">{formatCurrency(expense.amount, expense.currency)}</p>
            <p className="text-xs text-muted-foreground">{expense.currency}</p>
          </div>
        </div>

        {expense.description && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Description</p>
            <p className="text-sm text-foreground leading-relaxed">{expense.description}</p>
          </div>
        )}

        <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Submitted by</p>
            <p className="text-sm font-medium">{expense.user?.name ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground">{expense.user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last updated</p>
            <p className="text-sm">{formatDate(expense.updatedAt)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading font-semibold text-sm text-foreground mb-4">Approval Timeline</h2>
        <ApprovalTimeline approvals={timelineApprovals} />
      </div>

      {canApprove && myPendingApproval && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <h2 className="font-heading font-semibold text-sm text-foreground">Your Decision</h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleApproval(myPendingApproval.id, "APPROVED")}
              disabled={actionLoading}
              className="flex-1 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleApproval(myPendingApproval.id, "REJECTED")}
              disabled={actionLoading}
              className="flex-1 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {role === "ADMIN" && expense.status === "PENDING" && !myPendingApproval && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <h2 className="font-heading font-semibold text-sm text-foreground">Admin Override</h2>
          <div className="flex gap-3">
            <button onClick={() => handleOverride("APPROVED")} disabled={actionLoading} className="flex-1 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50">
              Force Approve
            </button>
            <button onClick={() => handleOverride("REJECTED")} disabled={actionLoading} className="flex-1 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors disabled:opacity-50">
              Force Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
