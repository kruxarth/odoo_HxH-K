"use client";

import { useState } from "react";
import { useMockStore } from "@/lib/mock-store";
import { RuleBuilder } from "@/components/admin/RuleBuilder";
import { formatCurrency } from "@/lib/mock-data";
import type { ApprovalRule } from "@/lib/mock-data";
import { Trash } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function RulesPage() {
  const { rules, addRule, deleteRule } = useMockStore();
  const [builderOpen, setBuilderOpen] = useState(false);

  function handleSave(rule: ApprovalRule) {
    addRule(rule);
    setBuilderOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Approval Rules
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {rules.length} rule{rules.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <Button onClick={() => setBuilderOpen(true)}>+ New Rule</Button>
      </div>

      <div className="space-y-3">
        {rules.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground text-sm">No rules configured.</p>
          </div>
        )}
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-foreground">{rule.name}</h3>
                  {rule.isManagerApprover && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/25 font-mono">
                      Manager auto-approver
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(rule.minAmount)} –{" "}
                  {rule.maxAmount ? formatCurrency(rule.maxAmount) : "Unlimited"}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {rule.steps.map((step) => (
                    <span
                      key={step.id}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-mono"
                    >
                      Step {step.stepOrder}: {step.conditionType} · {step.approverRole}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {rule.steps.length} step{rule.steps.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={builderOpen} onOpenChange={setBuilderOpen}>
        <SheetContent
          className="bg-card border-border w-full sm:max-w-lg overflow-y-auto"
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="font-heading">New Approval Rule</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <RuleBuilder
              onSave={handleSave}
              onCancel={() => setBuilderOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
