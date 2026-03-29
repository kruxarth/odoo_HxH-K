"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash, Plus } from "@phosphor-icons/react";

type ConditionType = "NONE" | "PERCENTAGE" | "SPECIFIC_APPROVER" | "HYBRID";

const CONDITION_TYPES: { value: ConditionType; label: string; desc: string }[] = [
  { value: "NONE",               label: "None",              desc: "Always apply" },
  { value: "PERCENTAGE",         label: "Percentage",        desc: "Require % above threshold" },
  { value: "SPECIFIC_APPROVER",  label: "Specific Approver", desc: "Must be approved by a named user" },
  { value: "HYBRID",             label: "Hybrid",            desc: "Percentage + specific approver" },
];

export interface RuleFormData {
  name: string;
  minAmount: number;
  maxAmount: number | null;
  isManagerApprover: boolean;
  conditionType: ConditionType;
  percentageThreshold: number | null;
  specificApproverId: string | null;
  steps: { approverId: string; sequence: number; label: string }[];
}

interface StepRow {
  id: string;
  approverId: string;
  label: string;
}

interface RuleBuilderProps {
  users: { id: string; name: string; role: string }[];
  onSave: (data: RuleFormData) => void;
  onCancel: () => void;
}

function uid() {
  return `step-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function RuleBuilder({ users, onSave, onCancel }: RuleBuilderProps) {
  const [name, setName] = useState("");
  const [minAmount, setMinAmount] = useState("0");
  const [maxAmount, setMaxAmount] = useState("");
  const [isManagerApprover, setIsManagerApprover] = useState(true);
  const [conditionType, setConditionType] = useState<ConditionType>("NONE");
  const [percentageThreshold, setPercentageThreshold] = useState("");
  const [specificApproverId, setSpecificApproverId] = useState("");
  const [steps, setSteps] = useState<StepRow[]>([
    { id: uid(), approverId: users[0]?.id ?? "", label: "" },
  ]);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { id: uid(), approverId: users[0]?.id ?? "", label: "" },
    ]);
  }

  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveStep(idx: number, dir: -1 | 1) {
    const next = [...steps];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSteps(next);
  }

  function updateStep(idx: number, patch: Partial<StepRow>) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      minAmount: parseFloat(minAmount) || 0,
      maxAmount: maxAmount ? parseFloat(maxAmount) : null,
      isManagerApprover,
      conditionType,
      percentageThreshold:
        conditionType === "PERCENTAGE" || conditionType === "HYBRID"
          ? parseFloat(percentageThreshold) || null
          : null,
      specificApproverId:
        conditionType === "SPECIFIC_APPROVER" || conditionType === "HYBRID"
          ? specificApproverId || null
          : null,
      steps: steps
        .filter((s) => s.approverId)
        .map((s, i) => ({
          approverId: s.approverId,
          sequence: i + 1,
          label: s.label || `Step ${i + 1}`,
        })),
    });
  }

  const needsPct =
    conditionType === "PERCENTAGE" || conditionType === "HYBRID";
  const needsSpecific =
    conditionType === "SPECIFIC_APPROVER" || conditionType === "HYBRID";

  return (
    <div className="space-y-6">
      {/* Basic fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Rule Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Executive Approval"
            className="bg-background border-border"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Min Amount ($)
            </label>
            <Input
              type="number"
              min="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0"
              className="bg-background border-border font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Max Amount ($)
            </label>
            <Input
              type="number"
              min="0"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Unlimited"
              className="bg-background border-border font-mono"
            />
          </div>
        </div>

        {/* Manager toggle */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
          <button
            type="button"
            onClick={() => setIsManagerApprover((v) => !v)}
            aria-pressed={isManagerApprover}
            aria-label="Toggle manager auto-approver"
            className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full border border-transparent p-0 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
              isManagerApprover ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                isManagerApprover ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-sm leading-none text-foreground">Manager is auto-approver</span>
        </div>
      </div>

      {/* Rule-level condition */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Approval Condition
        </h3>
        <div className="rounded-lg border border-border bg-background p-4 space-y-3">
          <div className="space-y-2">
            {CONDITION_TYPES.map((ct) => (
              <label key={ct.value} className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="conditionType"
                  value={ct.value}
                  checked={conditionType === ct.value}
                  onChange={() => setConditionType(ct.value)}
                  className="mt-0.5 accent-amber-400 shrink-0"
                />
                <div>
                  <p className="text-xs font-medium text-foreground">{ct.label}</p>
                  <p className="text-[11px] text-muted-foreground">{ct.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {needsPct && (
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Approval Threshold %
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={percentageThreshold}
                onChange={(e) => setPercentageThreshold(e.target.value)}
                placeholder="e.g. 60"
                className="h-8 text-xs bg-background border-border font-mono"
              />
            </div>
          )}

          {needsSpecific && users.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Specific Approver
              </label>
              <select
                value={specificApproverId}
                onChange={(e) => setSpecificApproverId(e.target.value)}
                className="w-full h-8 px-2 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">— select user —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Approval Steps
          </h3>
          <button
            onClick={addStep}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus size={12} />
            Add step
          </button>
        </div>

        {users.length === 0 && (
          <p className="text-xs text-muted-foreground italic px-1">
            No users found. Add team members first to assign steps.
          </p>
        )}

        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="rounded-lg border border-border bg-background p-3.5 space-y-3"
            >
              {/* Step header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  Step {idx + 1}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => moveStep(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => moveStep(idx, 1)}
                    disabled={idx === steps.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={() => removeStep(idx)}
                    disabled={steps.length === 1}
                    className="p-1 text-muted-foreground hover:text-rose-400 disabled:opacity-30 transition-colors"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              </div>

              {/* Approver */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Approver
                </label>
                {users.length > 0 ? (
                  <select
                    value={step.approverId}
                    onChange={(e) => updateStep(idx, { approverId: e.target.value })}
                    className="w-full h-8 px-2 rounded-md bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} · {u.role}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No users available</p>
                )}
              </div>

              {/* Optional label */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Label <span className="normal-case text-muted-foreground/60">(optional)</span>
                </label>
                <Input
                  value={step.label}
                  onChange={(e) => updateStep(idx, { label: e.target.value })}
                  placeholder={`Step ${idx + 1}`}
                  className="h-8 text-xs bg-card border-border"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={!name.trim()}>
          Save Rule
        </Button>
      </div>
    </div>
  );
}
