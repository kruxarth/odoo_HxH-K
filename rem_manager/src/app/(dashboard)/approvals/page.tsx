"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ApprovalQueue } from "@/components/approvals/ApprovalQueue";

export default function ApprovalsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function loadData() {
    fetch("/api/expenses")
      .then((r) => r.json())
      .then((d) => { setExpenses(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { if (userId) loadData(); }, [userId]);

  // Flatten all approvals from expenses fetched
  const allApprovals = expenses.flatMap((e: any) =>
    (e.approvals ?? []).map((a: any) => ({
      id: a.id,
      expenseId: e.id,
      approverId: a.approverId,
      status: a.status,
      comment: a.comment,
      stepOrder: a.sequence,
      decidedAt: a.decidedAt,
      createdAt: a.createdAt,
    }))
  );

  const pendingApprovals = allApprovals.filter(
    (a) => a.approverId === userId && a.status === "PENDING"
  );

  async function handleApprove(expenseId: string, comment?: string) {
    const approval = allApprovals.find(
      (a) => a.expenseId === expenseId && a.approverId === userId && a.status === "PENDING"
    );
    if (!approval) return;
    await fetch(`/api/approvals/${approval.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision: "APPROVED", comment }),
    });
    loadData();
  }

  async function handleReject(expenseId: string, comment: string) {
    const approval = allApprovals.find(
      (a) => a.expenseId === expenseId && a.approverId === userId && a.status === "PENDING"
    );
    if (!approval) return;
    await fetch(`/api/approvals/${approval.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision: "REJECTED", comment }),
    });
    loadData();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Approvals</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {loading ? "Loading…" : `${pendingApprovals.length} pending approval${pendingApprovals.length !== 1 ? "s" : ""}`}
        </p>
      </div>
      {!loading && (
        <ApprovalQueue
          pendingApprovals={pendingApprovals}
          expenses={expenses}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
