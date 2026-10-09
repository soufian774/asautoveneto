import { Pool } from "pg";

declare global {
  var __asautoPool: Pool | undefined;
}

// Cached on globalThis so Vite's dev-mode module reloads don't leak a new
// connection pool on every HMR update.
export const pool = globalThis.__asautoPool ?? new Pool({ connectionString: process.env["DATABASE_URL"] });

if (process.env["NODE_ENV"] !== "production") {
  globalThis.__asautoPool = pool;
}
