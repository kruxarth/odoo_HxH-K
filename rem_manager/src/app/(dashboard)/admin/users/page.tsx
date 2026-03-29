"use client";

import { useState } from "react";
import { useMockStore } from "@/lib/mock-store";
import { UserTable } from "@/components/admin/UserTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Role, User } from "@/lib/mock-data";

const ROLES: Role[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

export default function UsersPage() {
  const { users, addUser, updateUserRole } = useMockStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE" as Role,
    managerId: "",
  });

  const managers = users.filter(
    (u) => u.role === "MANAGER" || u.role === "ADMIN"
  );

  function handleAdd() {
    if (!form.name || !form.email) return;
    const initials = form.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      managerId: form.managerId || null,
      companyId: "company-1",
      createdAt: new Date().toISOString(),
      avatarInitials: initials,
    };
    addUser(newUser);
    setSheetOpen(false);
    setForm({ name: "", email: "", role: "EMPLOYEE", managerId: "" });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {users.length} team member{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>+ Add User</Button>
      </div>
      <UserTable users={users} onRoleChange={updateUserRole} />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-card border-border">
          <SheetHeader>
            <SheetTitle className="font-heading">Add New User</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@acme.com"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="w-full h-9 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Manager
              </label>
              <select
                value={form.managerId}
                onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                className="w-full h-9 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">No manager</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAdd}
                disabled={!form.name || !form.email}
              >
                Add User
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
