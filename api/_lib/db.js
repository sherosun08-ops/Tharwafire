import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
})

export { pool }

/**
 * Helper: run a query and return rows
 */
export async function query(text, params) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res.rows
  } finally {
    client.release()
  }
}

/**
 * Helper: run a query and return first row or null
 */
export async function queryOne(text, params) {
  const rows = await query(text, params)
  return rows[0] || null
}
