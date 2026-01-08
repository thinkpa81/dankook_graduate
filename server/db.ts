import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Resolve hostname to IP if needed for production deployments
// The internal hostname 'helium' doesn't resolve in production network
function resolveHost(host: string | undefined): string {
  if (!host) return 'localhost';
  // If host is 'helium' (Replit internal), use the resolved IP
  if (host === 'helium') {
    return '172.31.65.4';
  }
  return host;
}

// Use individual PG* environment variables for more reliable connection
const poolConfig: pg.PoolConfig = process.env.PGHOST && process.env.PGPORT ? {
  host: resolveHost(process.env.PGHOST),
  port: parseInt(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
} : {
  connectionString: process.env.DATABASE_URL?.replace('@helium', '@172.31.65.4'),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

if (!process.env.DATABASE_URL && !process.env.PGHOST) {
  throw new Error(
    "DATABASE_URL or PGHOST must be set. Did you forget to provision a database?",
  );
}

console.log(`Database connecting to: ${resolveHost(process.env.PGHOST) || 'via DATABASE_URL'}`);

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle(pool, { schema });

async function connectWithRetry(retries = 3, delay = 2000): Promise<pg.PoolClient> {
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.connect();
    } catch (err: any) {
      console.error(`Database connection attempt ${i + 1} failed:`, err.message);
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
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS papers (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL DEFAULT 'domestic-conference',
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
        registered_time TEXT NOT NULL
      );
    `);
    console.log("Database tables verified/created successfully");
  } catch (error) {
    console.error("Error ensuring tables exist:", error);
    throw error;
  } finally {
    client.release();
  }
}
