import { useSession } from "@tanstack/react-start/server";

type AdminSessionData = { isAdmin: true };

export function adminSession() {
  return useSession<AdminSessionData>({
    password: process.env["SESSION_SECRET"]!,
    name: "asauto_admin",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env["NODE_ENV"] === "production",
    },
  });
}

export async function requireAdmin() {
  const session = await adminSession();
  if (session.data.isAdmin !== true) {
    throw new Error("Non autorizzato");
  }
}
