"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ApprovalRule, ApprovalRuleStep, ConditionType, Role } from "@/lib/mock-data";
import { ArrowUp, ArrowDown, Trash, Plus } from "@phosphor-icons/react";

const CONDITION_TYPES: { value: ConditionType; label: string; desc: string }[] = [
  { value: "NONE", label: "None", desc: "No condition — always apply" },
  { value: "PERCENTAGE", label: "Percentage", desc: "Require % above threshold" },
  { value: "SPECIFIC_APPROVER", label: "Specific Approver", desc: "Route to a specific user" },
  { value: "HYBRID", label: "Hybrid", desc: "Combine multiple conditions" },
];

interface RuleBuilderProps {
  onSave: (rule: ApprovalRule) => void;
  onCancel: () => void;
}

function newStep(ruleId: string, order: number): ApprovalRuleStep {
  return {
    id: `step-${Date.now()}-${order}`,
    ruleId,
    stepOrder: order,
    conditionType: "NONE",
    approverRole: "MANAGER",
    specificApproverId: null,
    percentageThreshold: null,
  };
}

export function RuleBuilder({ onSave, onCancel }: RuleBuilderProps) {
  const tempId = `rule-${Date.now()}`;
  const [name, setName] = useState("");
  const [minAmount, setMinAmount] = useState("0");
  const [maxAmount, setMaxAmount] = useState("");
  const [isManagerApprover, setIsManagerApprover] = useState(true);
  const [steps, setSteps] = useState<ApprovalRuleStep[]>([newStep(tempId, 1)]);

  function addStep() {
    setSteps((prev) => [...prev, newStep(tempId, prev.length + 1)]);
  }

  function removeStep(idx: number) {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, stepOrder: i + 1 }))
    );
  }

  function moveStep(idx: number, dir: -1 | 1) {
    const next = [...steps];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setSteps(next.map((s, i) => ({ ...s, stepOrder: i + 1 })));
  }

  function updateStep(idx: number, patch: Partial<ApprovalRuleStep>) {
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    );
  }

  function handleSave() {
    if (!name) return;
    onSave({
      id: tempId,
      name,
      companyId: "company-1",
      minAmount: parseFloat(minAmount) || 0,
      maxAmount: maxAmount ? parseFloat(maxAmount) : null,
      isManagerApprover,
      steps,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="space-y-5">
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsManagerApprover(!isManagerApprover)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              isManagerApprover ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                isManagerApprover ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <label className="text-sm text-foreground">Manager is auto-approver</label>
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
            <Plus size={12} /> Add step
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="rounded-lg border border-border bg-background p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  Step {idx + 1}
                </span>
                <div className="flex items-center gap-1">
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Condition
                  </label>
                  <div className="mt-1 space-y-1">
                    {CONDITION_TYPES.map((ct) => (
                      <label
                        key={ct.value}
                        className="flex items-start gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`condition-${step.id}`}
                          value={ct.value}
                          checked={step.conditionType === ct.value}
                          onChange={() =>
                            updateStep(idx, { conditionType: ct.value })
                          }
                          className="mt-0.5 accent-amber-400"
                        />
                        <div>
                          <p className="text-xs text-foreground">{ct.label}</p>
                          <p className="text-[10px] text-muted-foreground">{ct.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Approver Role
                    </label>
                    <select
                      value={step.approverRole ?? "MANAGER"}
                      onChange={(e) =>
                        updateStep(idx, {
                          approverRole: e.target.value as Role,
                        })
                      }
                      className="mt-1 w-full h-8 px-2 rounded-md bg-card border border-border text-xs text-foreground focus:outline-none"
                    >
                      {(["MANAGER", "ADMIN"] as Role[]).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(step.conditionType === "PERCENTAGE" ||
                    step.conditionType === "HYBRID") && (
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Threshold %
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={step.percentageThreshold ?? ""}
                        onChange={(e) =>
                          updateStep(idx, {
                            percentageThreshold: parseFloat(e.target.value) || null,
                          })
                        }
                        placeholder="100"
                        className="mt-1 h-8 text-xs bg-card border-border font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={!name}>
          Save Rule
        </Button>
      </div>
    </div>
  );
}
