import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import pg from "pg"

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsDir = path.join(__dirname, "..", "db", "migrations")

async function run() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada")
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _schema_migrations (
        id BIGSERIAL PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b))

    for (const filename of files) {
      const { rowCount } = await pool.query(
        "SELECT 1 FROM _schema_migrations WHERE filename = $1",
        [filename]
      )

      if (rowCount) {
        console.log(`skip ${filename}`)
        continue
      }

      const sql = await fs.readFile(path.join(migrationsDir, filename), "utf8")
      await pool.query("BEGIN")
      await pool.query(sql)
      await pool.query("INSERT INTO _schema_migrations (filename) VALUES ($1)", [filename])
      await pool.query("COMMIT")
      console.log(`ok ${filename}`)
    }

    console.log("Migrations concluídas")
  } catch (error) {
    try {
      await pool.query("ROLLBACK")
    } catch {
      // noop
    }

    throw error
  } finally {
    await pool.end()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
