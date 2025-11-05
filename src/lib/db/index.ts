"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __dbPool?: Pool;
};

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required to initialize the database connection"
    );
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });
}

const pool = globalForDb.__dbPool ?? createPool();

if (!globalForDb.__dbPool) {
  globalForDb.__dbPool = pool;
}

export const db = drizzle(pool, { schema });
export type Database = typeof db;
