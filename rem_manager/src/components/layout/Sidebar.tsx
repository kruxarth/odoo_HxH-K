"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  Receipt,
  CheckSquare,
  Users,
  Gear,
  X,
} from "@phosphor-icons/react";
import { useMockStore } from "@/lib/mock-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: ChartBar,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"] as const,
  },
  {
    href: "/expenses",
    label: "Expenses",
    icon: Receipt,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"] as const,
  },
  {
    href: "/approvals",
    label: "Approvals",
    icon: CheckSquare,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    roles: ["ADMIN"] as const,
  },
  {
    href: "/admin/rules",
    label: "Rules",
    icon: Gear,
    roles: ["ADMIN"] as const,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, currentUser } = useMockStore();

  const visibleItems = NAV_ITEMS.filter((item) =>
    (item.roles as readonly string[]).includes(role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-60 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0 lg:static lg:flex",
          open ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center amber-glow-sm shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 12L6 4L10 9L12 6L14 12H2Z"
                  fill="currentColor"
                  className="text-primary-foreground"
                />
              </svg>
            </div>
            <span className="font-heading font-bold text-base text-sidebar-foreground">
              ExpenseFlow
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {visibleItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                  active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon size={18} weight={active ? "fill" : "regular"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-sidebar-accent">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-medium text-primary shrink-0">
              {currentUser.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
