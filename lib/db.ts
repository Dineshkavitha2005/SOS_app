import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Open SQLite DB connection
export async function openDB() {
  return open({
    filename: path.join(process.cwd(), 'db', 'safenet_users.db'),
    driver: sqlite3.Database,
  });
}
