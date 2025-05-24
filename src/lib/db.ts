import Database from 'better-sqlite3';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Initialize SQLite database with a file
const dbPath = join(process.cwd(), 'events.db');
const isNewDb = !existsSync(dbPath);
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Only initialize schema if this is a new database
if (isNewDb) {
  const schemaPath = join(process.cwd(), 'sql', 'schema.sql');
  if (existsSync(schemaPath)) {
    try {
      const schema = readFileSync(schemaPath, 'utf8');
      db.exec(schema);
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error);
      throw error; // Re-throw to prevent app from running with invalid DB state
    }
  } else {
    console.error('Schema file not found at:', schemaPath);
    throw new Error('Schema file not found');
  }
}

// Helper function to run queries
export function query<T>(sql: string, params: any[] = []): T {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params) as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to run a single query and get one result
export function queryOne<T>(sql: string, params: any[] = []): T | null {
  try {
    const stmt = db.prepare(sql);
    return stmt.get(...params) as T | null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to execute a query (for INSERT, UPDATE, DELETE)
export function execute(sql: string, params: any[] = []): { lastInsertId: number } {
  try {
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return { lastInsertId: Number(result.lastInsertRowid) };
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

export default db; 