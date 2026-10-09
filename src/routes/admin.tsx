import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminStatus } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/admin/login" });
  },
  component: Outlet,
});
