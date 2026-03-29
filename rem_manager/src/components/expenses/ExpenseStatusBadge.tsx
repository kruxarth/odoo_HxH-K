import type { ExpenseStatus } from "@/lib/mock-data";

const STATUS_STYLES: Record<ExpenseStatus, string> = {
  PENDING: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  APPROVED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  REJECTED: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

const STATUS_DOTS: Record<ExpenseStatus, string> = {
  PENDING: "bg-sky-400",
  APPROVED: "bg-emerald-400",
  REJECTED: "bg-rose-400",
};

export function ExpenseStatusBadge({ status }: { status: ExpenseStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full border ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1 h-1 rounded-full ${STATUS_DOTS[status]}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
