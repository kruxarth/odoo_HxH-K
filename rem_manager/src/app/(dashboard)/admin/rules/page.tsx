"use client";

import { useState, useEffect } from "react";
import { RuleBuilder, type RuleFormData } from "@/components/admin/RuleBuilder";
import { Trash } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function RulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [saveError, setSaveError] = useState("");

  function loadRules() {
    fetch("/api/rules")
      .then((r) => r.json())
      .then((d) => { setRules(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadRules();
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d.map((u: any) => ({ id: u.id, name: u.name, role: u.role })) : []))
      .catch(() => {});
  }, []);

  async function handleSave(data: RuleFormData) {
    setSaveError("");
    const res = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSaveError(body.error ?? "Failed to save rule");
      return;
    }
    loadRules();
    setBuilderOpen(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/rules/${id}`, { method: "DELETE" });
    loadRules();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Approval Rules</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Loading…" : `${rules.length} rule${rules.length !== 1 ? "s" : ""} configured`}
          </p>
        </div>
        <Button onClick={() => { setSaveError(""); setBuilderOpen(true); }}>+ New Rule</Button>
      </div>

      <div className="space-y-3">
        {!loading && rules.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground text-sm">No rules configured.</p>
          </div>
        )}
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-foreground">{rule.name}</h3>
                  {rule.isManagerApprover && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/25 font-mono">
                      Manager auto-approver
                    </span>
                  )}
                  {rule.conditionType && rule.conditionType !== "NONE" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                      {rule.conditionType}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(rule.minAmount)} – {rule.maxAmount ? formatCurrency(rule.maxAmount) : "Unlimited"}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {(rule.steps ?? []).map((step: any, i: number) => (
                    <span key={step.id ?? i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-mono">
                      {step.label ?? `Step ${step.sequence ?? i + 1}`}: {step.approver?.name ?? "—"}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {(rule.steps ?? []).length} step{(rule.steps ?? []).length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => handleDelete(rule.id)}
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
          className="bg-card border-border w-full sm:max-w-lg overflow-y-auto overflow-x-hidden"
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="font-heading">New Approval Rule</SheetTitle>
          </SheetHeader>
          {saveError && (
            <p className="px-4 text-xs text-destructive flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              {saveError}
            </p>
          )}
          <div className="px-4 pb-4">
            <RuleBuilder
              users={users}
              onSave={handleSave}
              onCancel={() => setBuilderOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
