"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMockStore } from "@/lib/mock-store";
import { ExpenseForm, type ExpenseFormData } from "@/components/expenses/ExpenseForm";
import type { ExpenseCategory } from "@/lib/mock-data";
import { CloudArrowUp, MagnifyingGlass, CheckCircle } from "@phosphor-icons/react";

type Step = 1 | 2 | 3;

const MOCK_OCR_RESULT = {
  title: "Business Travel Receipt",
  amount: "342.00",
  currency: "USD",
  category: "TRAVEL" as ExpenseCategory,
  description: "Auto-extracted from receipt via OCR.",
};

export default function NewExpensePage() {
  const router = useRouter();
  const { currentUser, addExpense } = useMockStore();
  const [step, setStep] = useState<Step>(1);
  const [dragOver, setDragOver] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [ocrData, setOcrData] = useState<Partial<ExpenseFormData> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleFile() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setOcrData({
        title: MOCK_OCR_RESULT.title,
        amount: parseFloat(MOCK_OCR_RESULT.amount),
        currency: MOCK_OCR_RESULT.currency,
        category: MOCK_OCR_RESULT.category,
        description: MOCK_OCR_RESULT.description,
      });
      setTimeout(() => setStep(2), 600);
    }, 2000);
  }

  function handleSubmit(data: ExpenseFormData) {
    setSubmitting(true);
    setTimeout(() => {
      addExpense({
        id: `exp-${Date.now()}`,
        title: data.title,
        amount: data.amount,
        currency: data.currency,
        category: data.category,
        description: data.description,
        status: "PENDING",
        submittedById: currentUser.id,
        companyId: "company-1",
        receiptUrl: null,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSubmitting(false);
      setStep(3);
    }, 800);
  }

  const STEPS = [
    { n: 1, label: "Upload" },
    { n: 2, label: "Review" },
    { n: 3, label: "Done" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">New Expense</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Submit a reimbursement request</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-0">
        {STEPS.map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-0 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all ${
                  step === n
                    ? "bg-primary border-primary text-primary-foreground"
                    : step > n
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {step > n ? "✓" : n}
              </div>
              <span className={`text-[10px] ${step === n ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-full mx-1 mb-4 transition-colors ${step > n ? "bg-emerald-500/40" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(); }}
              onClick={handleFile}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-all ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : scanning
                  ? "border-primary/50 bg-primary/5"
                  : scanned
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {scanning ? (
                <>
                  <MagnifyingGlass size={32} className="text-primary animate-pulse" />
                  <p className="text-sm font-medium text-foreground">Scanning receipt...</p>
                  <p className="text-xs text-muted-foreground">Extracting fields via OCR</p>
                </>
              ) : scanned ? (
                <>
                  <CheckCircle size={32} className="text-emerald-400" />
                  <p className="text-sm font-medium text-foreground">Receipt scanned!</p>
                  <p className="text-xs text-muted-foreground">Redirecting to review...</p>
                </>
              ) : (
                <>
                  <CloudArrowUp size={32} className="text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Drop receipt here</p>
                    <p className="text-xs text-muted-foreground mt-0.5">or click to upload · PNG, JPG, PDF</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <button
              onClick={() => { setStep(2); setOcrData({}); }}
              className="w-full py-2 text-sm text-primary hover:underline"
            >
              Enter details manually →
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            {ocrData?.title && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-400">
                  Fields pre-filled from OCR scan. Review and edit as needed.
                </p>
              </div>
            )}
            <ExpenseForm initial={ocrData ?? {}} onSubmit={handleSubmit} loading={submitting} />
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="font-heading text-xl font-bold text-foreground">Submitted!</h2>
              <p className="text-sm text-muted-foreground">
                Your expense has been submitted for approval.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => router.push("/expenses")}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-card transition-colors"
              >
                View Expenses
              </button>
              <button
                onClick={() => { setStep(1); setOcrData(null); setScanned(false); }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
