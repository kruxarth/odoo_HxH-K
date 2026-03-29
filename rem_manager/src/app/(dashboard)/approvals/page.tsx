"use client";

import { useMockStore } from "@/lib/mock-store";
import { ApprovalQueue } from "@/components/approvals/ApprovalQueue";

export default function ApprovalsPage() {
  const { currentUser, expenses, approvals, approveExpense, rejectExpense } =
    useMockStore();

  const pendingApprovals = approvals.filter(
    (a) => a.approverId === currentUser.id && a.status === "PENDING"
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Approvals</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {pendingApprovals.length} pending approval{pendingApprovals.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ApprovalQueue
        pendingApprovals={pendingApprovals}
        expenses={expenses}
        onApprove={approveExpense}
        onReject={rejectExpense}
      />
    </div>
  );
}
