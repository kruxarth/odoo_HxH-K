"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORY_LABELS: Record<string, string> = {
  TRAVEL: "Travel", MEALS: "Meals", ACCOMMODATION: "Accommodation",
  EQUIPMENT: "Equipment", SOFTWARE: "Software", MARKETING: "Marketing", OTHER: "Other",
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

interface ApprovalQueueProps {
  pendingApprovals: any[];
  expenses: any[];
  onApprove: (expenseId: string, comment?: string) => void;
  onReject: (expenseId: string, comment: string) => void;
}

export function ApprovalQueue({
  pendingApprovals,
  expenses,
  onApprove,
  onReject,
}: ApprovalQueueProps) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    action: "approve" | "reject" | null;
    expenseId: string | null;
  }>({ open: false, action: null, expenseId: null });
  const [comment, setComment] = useState("");

  function openDialog(action: "approve" | "reject", expenseId: string) {
    setComment("");
    setDialogState({ open: true, action, expenseId });
  }

  function handleConfirm() {
    if (!dialogState.expenseId || !dialogState.action) return;
    if (dialogState.action === "approve") {
      onApprove(dialogState.expenseId, comment || undefined);
    } else {
      onReject(dialogState.expenseId, comment || "Rejected.");
    }
    setDialogState({ open: false, action: null, expenseId: null });
  }

  if (pendingApprovals.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-emerald-400 text-xl">✓</span>
        </div>
        <p className="font-medium text-foreground">All caught up!</p>
        <p className="text-sm text-muted-foreground mt-1">No pending approvals.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {pendingApprovals.map((approval) => {
          const expense = expenses.find((e) => e.id === approval.expenseId);
          if (!expense) return null;
          const submitterName = expense.user?.name ?? "Unknown";

          return (
            <div
              key={approval.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => router.push(`/expenses/${expense.id}`)}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                  >
                    {expense.title}
                  </button>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">{submitterName}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {CATEGORY_LABELS[expense.category] ?? expense.category}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(expense.submittedAt)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono font-semibold text-foreground">
                    {formatCurrency(expense.amount, expense.currency)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openDialog("approve", expense.id)}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => openDialog("reject", expense.id)}
                  className="flex-1 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-medium hover:bg-rose-500/25 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={dialogState.open}
        onOpenChange={(open) =>
          setDialogState({ open, action: null, expenseId: null })
        }
      >
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {dialogState.action === "approve" ? "Approve Expense" : "Reject Expense"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Comment {dialogState.action === "reject" ? "(required)" : "(optional)"}
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  dialogState.action === "approve"
                    ? "Add a note (optional)..."
                    : "Explain the reason for rejection..."
                }
                rows={3}
                className="bg-background border-border resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setDialogState({ open: false, action: null, expenseId: null })
                }
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 ${
                  dialogState.action === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-rose-600 hover:bg-rose-500 text-white"
                }`}
                onClick={handleConfirm}
                disabled={dialogState.action === "reject" && !comment}
              >
                {dialogState.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
