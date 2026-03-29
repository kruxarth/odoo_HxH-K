"use client";

import type { User, Role } from "@/lib/mock-data";
import { formatDate } from "@/lib/mock-data";

const ROLE_BADGE: Record<Role, string> = {
  ADMIN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  MANAGER: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  EMPLOYEE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

interface UserTableProps {
  users: User[];
  onRoleChange: (userId: string, role: Role) => void;
}

const ROLES: Role[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

export function UserTable({ users, onRoleChange }: UserTableProps) {
  const managers = users.filter((u) => u.role === "MANAGER" || u.role === "ADMIN");

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card/50">
            <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium hidden md:table-cell">
              Manager
            </th>
            <th className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium hidden lg:table-cell">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => {
            const manager = managers.find((m) => m.id === user.managerId);
            return (
              <tr key={user.id} className="hover:bg-card/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      {user.avatarInitials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value as Role)}
                    className={`px-2 py-1 rounded-full text-[11px] font-medium border cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring ${ROLE_BADGE[user.role]} bg-transparent`}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-card text-foreground">
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {manager ? (
                    <span>{manager.name}</span>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
