import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg"

import { requireEnv } from "@/lib/config/env"

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

function createPool() {
  const { DATABASE_URL } = requireEnv(["DATABASE_URL"])

  return new Pool({
    connectionString: DATABASE_URL,
    max: 10,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })
}

export function getPool() {
  if (!global.__pgPool) {
    global.__pgPool = createPool()
  }

  return global.__pgPool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params)
}

export async function withTransaction<T>(run: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect()

  try {
    await client.query("BEGIN")
    const result = await run(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
