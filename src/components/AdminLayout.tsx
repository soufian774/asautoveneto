import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { logout } from "@/lib/auth";

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/admin" className="truncate font-display text-base font-extrabold sm:text-xl">
            AS<span className="text-primary">AUTO</span> <span className="hidden sm:inline">— Area Admin</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Esci
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
