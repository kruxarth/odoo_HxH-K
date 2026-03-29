"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";

type ExpenseStatus = "PENDING" | "APPROVED" | "REJECTED";
const ALL_STATUSES: ExpenseStatus[] = ["PENDING", "APPROVED", "REJECTED"];

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

interface ExpenseListProps {
  expenses: any[];
  showSubmitter?: boolean;
}

export function ExpenseList({ expenses, showSubmitter = false }: ExpenseListProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filtered = expenses.filter((e) => {
    if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
    if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(expenses.map((e) => e.category as string)));

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-border">
          {(["ALL", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-8 px-2 text-xs rounded-md bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c] ?? c}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Title</TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Category</TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right">Amount</TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Status</TableHead>
              {showSubmitter && (
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Submitter</TableHead>
              )}
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12 text-sm">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="border-border cursor-pointer hover:bg-card/60 transition-colors"
                  onClick={() => router.push(`/expenses/${expense.id}`)}
                >
                  <TableCell className="font-medium text-sm">{expense.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {CATEGORY_LABELS[expense.category] ?? expense.category}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-sm">
                    {formatCurrency(expense.amount, expense.currency)}
                  </TableCell>
                  <TableCell>
                    <ExpenseStatusBadge status={expense.status} />
                  </TableCell>
                  {showSubmitter && (
                    <TableCell className="text-sm text-muted-foreground">
                      {expense.user?.name ?? "Unknown"}
                    </TableCell>
                  )}
                  <TableCell className="text-muted-foreground text-sm">
                    {formatRelativeDate(expense.submittedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
