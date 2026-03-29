"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  Role,
  Expense,
  User,
  ExpenseApproval,
  ApprovalRule,
} from "./mock-data";
import {
  mockUsers,
  mockExpenses,
  mockApprovals,
  mockRules,
  mockCompany,
} from "./mock-data";

interface MockStore {
  role: Role;
  currentUser: User;
  setRole: (role: Role) => void;
  expenses: Expense[];
  approvals: ExpenseApproval[];
  rules: ApprovalRule[];
  users: User[];
  addExpense: (expense: Expense) => void;
  approveExpense: (expenseId: string, comment?: string) => void;
  rejectExpense: (expenseId: string, comment: string) => void;
  addUser: (user: User) => void;
  addRule: (rule: ApprovalRule) => void;
  deleteRule: (ruleId: string) => void;
  updateUserRole: (userId: string, role: Role) => void;
}

const MockContext = createContext<MockStore | null>(null);

const ROLE_TO_USER: Record<Role, string> = {
  ADMIN: "user-alice",
  MANAGER: "user-bob",
  EMPLOYEE: "user-charlie",
};

export function MockStoreProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("EMPLOYEE");
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [approvals, setApprovals] = useState<ExpenseApproval[]>(mockApprovals);
  const [rules, setRules] = useState<ApprovalRule[]>(mockRules);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const saved = localStorage.getItem("mockRole") as Role | null;
    if (saved && ["ADMIN", "MANAGER", "EMPLOYEE"].includes(saved)) {
      setRoleState(saved);
    }
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem("mockRole", r);
  }, []);

  const currentUser =
    users.find((u) => u.id === ROLE_TO_USER[role]) ?? users[0];

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
    // Auto-create pending approval
    setApprovals((prev) => [
      {
        id: `appr-${Date.now()}`,
        expenseId: expense.id,
        approverId: "user-bob",
        status: "PENDING",
        comment: null,
        stepOrder: 1,
        decidedAt: null,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const approveExpense = useCallback((expenseId: string, comment?: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === expenseId
          ? { ...e, status: "APPROVED", updatedAt: new Date().toISOString() }
          : e
      )
    );
    setApprovals((prev) =>
      prev.map((a) =>
        a.expenseId === expenseId && a.status === "PENDING"
          ? {
              ...a,
              status: "APPROVED",
              comment: comment ?? null,
              decidedAt: new Date().toISOString(),
            }
          : a
      )
    );
  }, []);

  const rejectExpense = useCallback((expenseId: string, comment: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === expenseId
          ? { ...e, status: "REJECTED", updatedAt: new Date().toISOString() }
          : e
      )
    );
    setApprovals((prev) =>
      prev.map((a) =>
        a.expenseId === expenseId && a.status === "PENDING"
          ? {
              ...a,
              status: "REJECTED",
              comment,
              decidedAt: new Date().toISOString(),
            }
          : a
      )
    );
  }, []);

  const addUser = useCallback((user: User) => {
    setUsers((prev) => [...prev, user]);
  }, []);

  const addRule = useCallback((rule: ApprovalRule) => {
    setRules((prev) => [...prev, rule]);
  }, []);

  const deleteRule = useCallback((ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  }, []);

  const updateUserRole = useCallback((userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }, []);

  return (
    <MockContext.Provider
      value={{
        role,
        currentUser,
        setRole,
        expenses,
        approvals,
        rules,
        users,
        addExpense,
        approveExpense,
        rejectExpense,
        addUser,
        addRule,
        deleteRule,
        updateUserRole,
      }}
    >
      {children}
    </MockContext.Provider>
  );
}

export function useMockStore(): MockStore {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error("useMockStore must be used within MockStoreProvider");
  return ctx;
}

// ── Role Switcher Widget ──────────────────────────────────
const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  MANAGER: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  EMPLOYEE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function RoleSwitcher() {
  const { role, setRole } = useMockStore();
  const [open, setOpen] = useState(false);
  const roles: Role[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-2 flex flex-col gap-1 items-end">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setOpen(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all shadow-sm
                ${role === r ? ROLE_COLORS[r] : "bg-card text-muted-foreground border-border hover:border-primary/50"}
                backdrop-blur-sm`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold border backdrop-blur-sm shadow-lg transition-all bg-card
          ${ROLE_COLORS[role]}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {role}
        <span className="opacity-60">{open ? "▲" : "▼"}</span>
      </button>
    </div>
  );
}

export { mockCompany };
