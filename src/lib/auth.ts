import { createServerFn } from "@tanstack/react-start";
import { adminSession } from "@/lib/session";

export const login = createServerFn({ method: "POST" })
  .validator((password: string) => password)
  .handler(async ({ data: password }) => {
    if (password !== process.env["ADMIN_PASSWORD"]) {
      throw new Error("Password errata");
    }
    const session = await adminSession();
    await session.update({ isAdmin: true });
    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  await session.clear();
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await adminSession();
  return { isAdmin: session.data.isAdmin === true };
});
