import type { ExpenseApproval } from "@/lib/mock-data";
import { getUserById, formatDate } from "@/lib/mock-data";
import { Check, X, Clock } from "@phosphor-icons/react";

interface ApprovalTimelineProps {
  approvals: ExpenseApproval[];
}

export function ApprovalTimeline({ approvals }: ApprovalTimelineProps) {
  if (approvals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No approval records.</p>
    );
  }

  return (
    <div className="space-y-0">
      {approvals.map((approval, i) => {
        const approver = getUserById(approval.approverId);
        const isLast = i === approvals.length - 1;

        return (
          <div key={approval.id} className="flex gap-4">
            {/* Icon + connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  approval.status === "APPROVED"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : approval.status === "REJECTED"
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                    : "bg-sky-500/20 border-sky-500/50 text-sky-400"
                }`}
              >
                {approval.status === "APPROVED" ? (
                  <Check size={14} weight="bold" />
                ) : approval.status === "REJECTED" ? (
                  <X size={14} weight="bold" />
                ) : (
                  <Clock size={14} />
                )}
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border my-1" style={{ minHeight: 24 }} />
              )}
            </div>
            {/* Content */}
            <div className={`pb-6 min-w-0 ${isLast ? "" : ""}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">
                  {approver?.name ?? "Unknown"}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${
                    approval.status === "APPROVED"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                      : approval.status === "REJECTED"
                      ? "bg-rose-500/15 text-rose-400 border-rose-500/25"
                      : "bg-sky-500/15 text-sky-400 border-sky-500/25"
                  }`}
                >
                  {approval.status.charAt(0) + approval.status.slice(1).toLowerCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {approval.decidedAt
                  ? formatDate(approval.decidedAt)
                  : "Awaiting decision"}
              </p>
              {approval.comment && (
                <p className="mt-1.5 text-sm text-muted-foreground bg-card rounded-md px-3 py-2 border border-border">
                  &ldquo;{approval.comment}&rdquo;
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
