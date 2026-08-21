import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use DATABASE_URL or NEON_DATABASE_URL for database connection
const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or NEON_DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const poolConfig: pg.PoolConfig = {
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

console.log(`Database connecting (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', (err as NodeJS.ErrnoException).code || err.name);
});

export const db = drizzle(pool, { schema });

async function connectWithRetry(retries = 3, delay = 2000): Promise<pg.PoolClient> {
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.connect();
    } catch (err: any) {
      console.error(`Database connection attempt ${i + 1} failed:`, err.code || err.name || "DatabaseError");
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Failed to connect to database");
}

export async function ensureTablesExist() {
  const client = await connectWithRetry();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        status TEXT NOT NULL DEFAULT 'active',
        password_reset_required BOOLEAN NOT NULL DEFAULT false,
        registered_at TEXT NOT NULL,
        registered_time TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS notices (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        views INTEGER NOT NULL DEFAULT 0,
        is_important BOOLEAN NOT NULL DEFAULT false,
        files TEXT[] NOT NULL DEFAULT '{}'::text[]
      );
      
      CREATE TABLE IF NOT EXISTS notice_comments (
        id SERIAL PRIMARY KEY,
        notice_id INTEGER NOT NULL,
        user_id INTEGER,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS papers (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL DEFAULT 'conference',
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        first_author TEXT,
        corresponding_author TEXT,
        venue TEXT,
        journal TEXT,
        volume TEXT,
        year TEXT NOT NULL,
        abstract TEXT,
        keywords TEXT[] NOT NULL DEFAULT '{}'::text[],
        files TEXT[] NOT NULL DEFAULT '{}'::text[],
        website_url TEXT,
        date TEXT NOT NULL,
        views INTEGER NOT NULL DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS paper_comments (
        id SERIAL PRIMARY KEY,
        paper_id INTEGER NOT NULL,
        user_id INTEGER,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS talents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        education TEXT NOT NULL,
        major TEXT NOT NULL,
        interested_major TEXT NOT NULL,
        motivation TEXT NOT NULL,
        registered_at TEXT NOT NULL,
        registered_time TEXT NOT NULL,
        consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        retention_until TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '2 years'
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN NOT NULL DEFAULT false;
      ALTER TABLE notice_comments ADD COLUMN IF NOT EXISTS user_id INTEGER;
      ALTER TABLE paper_comments ADD COLUMN IF NOT EXISTS user_id INTEGER;
      ALTER TABLE talents ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
      ALTER TABLE talents ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '2 years';

      CREATE INDEX IF NOT EXISTS idx_talents_retention_until ON talents(retention_until);
      CREATE INDEX IF NOT EXISTS idx_notice_comments_user_id ON notice_comments(user_id);
      CREATE INDEX IF NOT EXISTS idx_paper_comments_user_id ON paper_comments(user_id);
    `);

    const invalidated = await client.query(`
      UPDATE users
      SET
        password = 'disabled$' || md5(random()::text || clock_timestamp()::text || id::text),
        password_reset_required = true
      WHERE password NOT LIKE 'scrypt$v1$%'
        AND password NOT LIKE 'disabled$%'
    `);
    if (invalidated.rowCount) {
      console.warn(`Invalidated ${invalidated.rowCount} legacy plaintext password record(s)`);
    }
    console.log("Database tables verified/created successfully");
  } catch (error) {
    console.error("Error ensuring tables exist:", error);
    throw error;
  } finally {
    client.release();
  }
}
