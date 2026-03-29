export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type ExpenseStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ExpenseCategory =
  | "TRAVEL"
  | "MEALS"
  | "ACCOMMODATION"
  | "EQUIPMENT"
  | "SOFTWARE"
  | "MARKETING"
  | "OTHER";
export type ConditionType =
  | "NONE"
  | "PERCENTAGE"
  | "SPECIFIC_APPROVER"
  | "HYBRID";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Company {
  id: string;
  name: string;
  currency: string;
  country: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId: string | null;
  companyId: string;
  createdAt: string;
  avatarInitials: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  status: ExpenseStatus;
  submittedById: string;
  companyId: string;
  receiptUrl: string | null;
  submittedAt: string;
  updatedAt: string;
}

export interface ExpenseApproval {
  id: string;
  expenseId: string;
  approverId: string;
  status: ApprovalStatus;
  comment: string | null;
  stepOrder: number;
  decidedAt: string | null;
  createdAt: string;
}

export interface ApprovalRuleStep {
  id: string;
  ruleId: string;
  stepOrder: number;
  conditionType: ConditionType;
  approverRole: Role | null;
  specificApproverId: string | null;
  percentageThreshold: number | null;
}

export interface ApprovalRule {
  id: string;
  name: string;
  companyId: string;
  minAmount: number;
  maxAmount: number | null;
  isManagerApprover: boolean;
  steps: ApprovalRuleStep[];
  createdAt: string;
}

// ── Company ──────────────────────────────────────────────
export const mockCompany: Company = {
  id: "company-1",
  name: "Acme Corp",
  currency: "USD",
  country: "US",
  createdAt: "2024-01-01T00:00:00Z",
};

// ── Users ─────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: "user-alice",
    name: "Alice Chen",
    email: "alice@acme.com",
    role: "ADMIN",
    managerId: null,
    companyId: "company-1",
    createdAt: "2024-01-01T00:00:00Z",
    avatarInitials: "AC",
  },
  {
    id: "user-bob",
    name: "Bob Martinez",
    email: "bob@acme.com",
    role: "MANAGER",
    managerId: "user-alice",
    companyId: "company-1",
    createdAt: "2024-01-15T00:00:00Z",
    avatarInitials: "BM",
  },
  {
    id: "user-charlie",
    name: "Charlie Kim",
    email: "charlie@acme.com",
    role: "EMPLOYEE",
    managerId: "user-bob",
    companyId: "company-1",
    createdAt: "2024-02-01T00:00:00Z",
    avatarInitials: "CK",
  },
  {
    id: "user-diana",
    name: "Diana Osei",
    email: "diana@acme.com",
    role: "EMPLOYEE",
    managerId: "user-bob",
    companyId: "company-1",
    createdAt: "2024-02-15T00:00:00Z",
    avatarInitials: "DO",
  },
];

// ── Expenses ──────────────────────────────────────────────
export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    title: "Q1 Sales Conference Flight",
    amount: 842.5,
    currency: "USD",
    category: "TRAVEL",
    description: "Round-trip flight to NYC for Q1 sales conference.",
    status: "PENDING",
    submittedById: "user-charlie",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-03-10T09:00:00Z",
    updatedAt: "2024-03-10T09:00:00Z",
  },
  {
    id: "exp-2",
    title: "Team Lunch — March Sprint",
    amount: 215.0,
    currency: "USD",
    category: "MEALS",
    description: "Team lunch during March sprint planning.",
    status: "APPROVED",
    submittedById: "user-bob",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-03-08T12:30:00Z",
    updatedAt: "2024-03-09T10:00:00Z",
  },
  {
    id: "exp-3",
    title: "Figma Annual Subscription",
    amount: 576.0,
    currency: "USD",
    category: "SOFTWARE",
    description: "Annual Figma Professional subscription for design team.",
    status: "APPROVED",
    submittedById: "user-diana",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-03-05T14:00:00Z",
    updatedAt: "2024-03-06T11:00:00Z",
  },
  {
    id: "exp-4",
    title: "Client Dinner — Prospect Co",
    amount: 380.0,
    currency: "USD",
    category: "MEALS",
    description: "Dinner with Prospect Co executives to close deal.",
    status: "REJECTED",
    submittedById: "user-charlie",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-03-03T19:00:00Z",
    updatedAt: "2024-03-04T09:00:00Z",
  },
  {
    id: "exp-5",
    title: "Hotel — NYC Conference",
    amount: 1240.0,
    currency: "USD",
    category: "ACCOMMODATION",
    description: "3 nights at Marriott NYC for sales conference.",
    status: "PENDING",
    submittedById: "user-charlie",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-03-11T10:00:00Z",
    updatedAt: "2024-03-11T10:00:00Z",
  },
  {
    id: "exp-6",
    title: "MacBook Pro — Engineering",
    amount: 2499.0,
    currency: "USD",
    category: "EQUIPMENT",
    description: "MacBook Pro M3 for new engineering hire.",
    status: "PENDING",
    submittedById: "user-bob",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-03-12T08:00:00Z",
    updatedAt: "2024-03-12T08:00:00Z",
  },
  {
    id: "exp-7",
    title: "LinkedIn Ads Campaign",
    amount: 950.0,
    currency: "USD",
    category: "MARKETING",
    description: "LinkedIn sponsored content campaign — March.",
    status: "APPROVED",
    submittedById: "user-diana",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-03-01T09:00:00Z",
    updatedAt: "2024-03-02T15:00:00Z",
  },
  {
    id: "exp-8",
    title: "Office Supplies",
    amount: 127.4,
    currency: "USD",
    category: "OTHER",
    description: "Pens, notebooks, and sticky notes for Q1.",
    status: "APPROVED",
    submittedById: "user-charlie",
    companyId: "company-1",
    receiptUrl: null,
    submittedAt: "2024-02-28T11:00:00Z",
    updatedAt: "2024-02-28T16:00:00Z",
  },
];

// ── Approval Records ──────────────────────────────────────
export const mockApprovals: ExpenseApproval[] = [
  // exp-1 (PENDING) — waiting for Bob
  {
    id: "appr-1",
    expenseId: "exp-1",
    approverId: "user-bob",
    status: "PENDING",
    comment: null,
    stepOrder: 1,
    decidedAt: null,
    createdAt: "2024-03-10T09:01:00Z",
  },
  // exp-2 (APPROVED) — Bob approved
  {
    id: "appr-2",
    expenseId: "exp-2",
    approverId: "user-bob",
    status: "APPROVED",
    comment: "Great team lunch, approved!",
    stepOrder: 1,
    decidedAt: "2024-03-09T10:00:00Z",
    createdAt: "2024-03-08T12:31:00Z",
  },
  // exp-3 (APPROVED) — Alice approved
  {
    id: "appr-3",
    expenseId: "exp-3",
    approverId: "user-alice",
    status: "APPROVED",
    comment: "Approved. Figma is essential.",
    stepOrder: 1,
    decidedAt: "2024-03-06T11:00:00Z",
    createdAt: "2024-03-05T14:01:00Z",
  },
  // exp-4 (REJECTED) — Bob rejected
  {
    id: "appr-4",
    expenseId: "exp-4",
    approverId: "user-bob",
    status: "REJECTED",
    comment: "Amount exceeds meal policy. Please resubmit with itemized receipt.",
    stepOrder: 1,
    decidedAt: "2024-03-04T09:00:00Z",
    createdAt: "2024-03-03T19:01:00Z",
  },
  // exp-5 (PENDING) — waiting for Bob
  {
    id: "appr-5",
    expenseId: "exp-5",
    approverId: "user-bob",
    status: "PENDING",
    comment: null,
    stepOrder: 1,
    decidedAt: null,
    createdAt: "2024-03-11T10:01:00Z",
  },
  // exp-6 (PENDING, high value) — waiting for Alice after Bob
  {
    id: "appr-6",
    expenseId: "exp-6",
    approverId: "user-alice",
    status: "PENDING",
    comment: null,
    stepOrder: 1,
    decidedAt: null,
    createdAt: "2024-03-12T08:01:00Z",
  },
  // exp-7 (APPROVED)
  {
    id: "appr-7",
    expenseId: "exp-7",
    approverId: "user-alice",
    status: "APPROVED",
    comment: "Campaign looks good. Approved.",
    stepOrder: 1,
    decidedAt: "2024-03-02T15:00:00Z",
    createdAt: "2024-03-01T09:01:00Z",
  },
  // exp-8 (APPROVED)
  {
    id: "appr-8",
    expenseId: "exp-8",
    approverId: "user-bob",
    status: "APPROVED",
    comment: null,
    stepOrder: 1,
    decidedAt: "2024-02-28T16:00:00Z",
    createdAt: "2024-02-28T11:01:00Z",
  },
];

// ── Approval Rules ────────────────────────────────────────
export const mockRules: ApprovalRule[] = [
  {
    id: "rule-1",
    name: "Standard Approval",
    companyId: "company-1",
    minAmount: 0,
    maxAmount: 1000,
    isManagerApprover: true,
    createdAt: "2024-01-01T00:00:00Z",
    steps: [
      {
        id: "step-1",
        ruleId: "rule-1",
        stepOrder: 1,
        conditionType: "NONE",
        approverRole: "MANAGER",
        specificApproverId: null,
        percentageThreshold: null,
      },
    ],
  },
  {
    id: "rule-2",
    name: "High Value Approval",
    companyId: "company-1",
    minAmount: 1000,
    maxAmount: null,
    isManagerApprover: false,
    createdAt: "2024-01-01T00:00:00Z",
    steps: [
      {
        id: "step-2",
        ruleId: "rule-2",
        stepOrder: 1,
        conditionType: "PERCENTAGE",
        approverRole: "ADMIN",
        specificApproverId: null,
        percentageThreshold: 100,
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────
export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getExpensesByUser(userId: string): Expense[] {
  return mockExpenses.filter((e) => e.submittedById === userId);
}

export function getExpensesByTeam(managerId: string): Expense[] {
  const teamIds = mockUsers
    .filter((u) => u.managerId === managerId)
    .map((u) => u.id);
  return mockExpenses.filter((e) => teamIds.includes(e.submittedById));
}

export function getApprovalsByExpense(expenseId: string): ExpenseApproval[] {
  return mockApprovals
    .filter((a) => a.expenseId === expenseId)
    .sort((a, b) => a.stepOrder - b.stepOrder);
}

export function getPendingApprovalsForApprover(
  approverId: string
): ExpenseApproval[] {
  return mockApprovals.filter(
    (a) => a.approverId === approverId && a.status === "PENDING"
  );
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date("2024-03-12T12:00:00Z");
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  TRAVEL: "Travel",
  MEALS: "Meals",
  ACCOMMODATION: "Accommodation",
  EQUIPMENT: "Equipment",
  SOFTWARE: "Software",
  MARKETING: "Marketing",
  OTHER: "Other",
};
