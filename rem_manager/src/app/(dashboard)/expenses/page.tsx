"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ExpenseList } from "@/components/expenses/ExpenseList";

export default function ExpensesPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "EMPLOYEE";
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/expenses")
      .then((r) => r.json())
      .then((d) => { setExpenses(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {role === "ADMIN" ? "All company expenses" : role === "MANAGER" ? "Your team's expenses" : "Your submitted expenses"}
          </p>
        </div>
        <Link href="/expenses/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Expense
        </Link>
      </div>
      {loading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : (
        <ExpenseList expenses={expenses} showSubmitter={role !== "EMPLOYEE"} />
      )}
    </div>
  );
}
