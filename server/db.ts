import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export async function ensureTablesExist() {
  const client = await pool.connect();
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
