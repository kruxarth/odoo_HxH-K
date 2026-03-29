"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ExpenseCategory } from "@/lib/mock-data";
import { CATEGORY_LABELS } from "@/lib/mock-data";

export interface ExpenseFormData {
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

interface ExpenseFormProps {
  initial?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => void;
  loading?: boolean;
}

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as ExpenseCategory[];

export function ExpenseForm({ initial, onSubmit, loading }: ExpenseFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [amount, setAmount] = useState(String(initial?.amount ?? ""));
  const [currency, setCurrency] = useState(initial?.currency ?? "USD");
  const [category, setCategory] = useState<ExpenseCategory>(
    initial?.category ?? "OTHER"
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().split("T")[0]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      title,
      amount: parseFloat(amount) || 0,
      currency,
      category,
      description,
      date,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Q1 Sales Conference Flight"
          required
          className="bg-card border-border"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Amount
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="bg-card border-border font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full h-9 px-3 rounded-md bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full h-9 px-3 rounded-md bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-card border-border"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide context for this expense..."
          rows={3}
          className="bg-card border-border resize-none"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Expense"}
      </Button>
    </form>
  );
}
