"use client";

import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  MANAGER: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  EMPLOYEE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const BREADCRUMBS: Record<string, string[]> = {
  "/dashboard": ["Dashboard"],
  "/expenses": ["Expenses"],
  "/expenses/new": ["Expenses", "New"],
  "/approvals": ["Approvals"],
  "/admin/users": ["Admin", "Users"],
  "/admin/rules": ["Admin", "Rules"],
};

function getSegments(pathname: string): string[] {
  if (pathname.startsWith("/expenses/") && pathname !== "/expenses/new") {
    return ["Expenses", "Detail"];
  }
  return BREADCRUMBS[pathname] ?? [pathname.split("/").pop() ?? ""];
}

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role ?? "EMPLOYEE";
  const name = session?.user?.name ?? "";
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const segments = getSegments(pathname);

  return (
    <header className="h-14 flex items-center px-4 lg:px-6 border-b border-border bg-background sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-3 text-muted-foreground hover:text-foreground"
      >
        <List size={20} />
      </button>
      <div className="flex items-center gap-1.5 text-sm flex-1">
        {segments.map((seg, i) => (
          <span key={seg} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground/40">/</span>}
            <span
              className={
                i === segments.length - 1
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }
            >
              {seg}
            </span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded-full border ${ROLE_BADGE[role] ?? ""}`}
        >
          {role}
        </span>
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-medium text-primary">
          {initials}
        </div>
      </div>
    </header>
  );
}
