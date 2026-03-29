"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMockStore } from "@/lib/mock-store";
import {
  getUserById,
  formatCurrency,
  formatDate,
  CATEGORY_LABELS,
  getApprovalsByExpense,
} from "@/lib/mock-data";
import { ExpenseStatusBadge } from "@/components/expenses/ExpenseStatusBadge";
import { ApprovalTimeline } from "@/components/approvals/ApprovalTimeline";
import { ArrowLeft } from "@phosphor-icons/react";

export default function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { role, currentUser, expenses, approvals, approveExpense, rejectExpense } =
    useMockStore();

  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-muted-foreground">Expense not found.</p>
        <button
          onClick={() => router.push("/expenses")}
          className="mt-4 text-primary text-sm hover:underline"
        >
          ← Back to expenses
        </button>
      </div>
    );
  }

  const submitter = getUserById(expense.submittedById);
  const expenseApprovals = getApprovalsByExpense(expense.id).map((a) => {
    const live = approvals.find((la) => la.id === a.id);
    return live ?? a;
  });
  const liveApprovals = approvals.filter((a) => a.expenseId === expense.id);

  const canApprove =
    (role === "MANAGER" || role === "ADMIN") &&
    expense.status === "PENDING";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-bold text-foreground leading-tight">
              {expense.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <ExpenseStatusBadge status={expense.status} />
              <span className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[expense.category]}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(expense.submittedAt)}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-2xl font-bold text-primary">
              {formatCurrency(expense.amount, expense.currency)}
            </p>
            <p className="text-xs text-muted-foreground">{expense.currency}</p>
          </div>
        </div>

        {expense.description && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
              Description
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {expense.description}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Submitted by
            </p>
            <p className="text-sm font-medium">{submitter?.name ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground">{submitter?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Last updated
            </p>
            <p className="text-sm">{formatDate(expense.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Approval timeline */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading font-semibold text-sm text-foreground mb-4">
          Approval Timeline
        </h2>
        <ApprovalTimeline approvals={liveApprovals} />
      </div>

      {/* Admin/Manager actions */}
      {canApprove && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <h2 className="font-heading font-semibold text-sm text-foreground">Actions</h2>
          <div className="flex gap-3">
            <button
              onClick={() => approveExpense(expense.id, "Approved via detail page.")}
              className="flex-1 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => rejectExpense(expense.id, "Rejected via detail page.")}
              className="flex-1 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
