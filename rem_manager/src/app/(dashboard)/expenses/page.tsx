"use client";

import Link from "next/link";
import { useMockStore } from "@/lib/mock-store";
import { getUserById } from "@/lib/mock-data";
import { ExpenseList } from "@/components/expenses/ExpenseList";

export default function ExpensesPage() {
  const { role, currentUser, expenses } = useMockStore();

  const visibleExpenses =
    role === "EMPLOYEE"
      ? expenses.filter((e) => e.submittedById === currentUser.id)
      : role === "MANAGER"
      ? expenses.filter((e) => {
          const submitter = getUserById(e.submittedById);
          return (
            submitter?.managerId === currentUser.id ||
            e.submittedById === currentUser.id
          );
        })
      : expenses;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {role === "ADMIN"
              ? "All company expenses"
              : role === "MANAGER"
              ? "Your team's expenses"
              : "Your submitted expenses"}
          </p>
        </div>
        <Link
          href="/expenses/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New Expense
        </Link>
      </div>
      <ExpenseList expenses={visibleExpenses} showSubmitter={role !== "EMPLOYEE"} />
    </div>
  );
}
