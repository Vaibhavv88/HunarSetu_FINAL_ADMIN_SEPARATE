import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const dbName = process.env.MYSQL_DATABASE || 'hunarsetu_db';
const baseConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Keep one pool without a selected database so the app can create its own
// database on first run, then use a normal pool for application queries.
const bootstrapPool = mysql.createPool(baseConfig);
const pool = mysql.createPool({ ...baseConfig, database: dbName });

export type FamilyAuthRole = 'student' | 'parent';

export interface FamilyUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: FamilyAuthRole;
  created_at: Date;
}

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  await bootstrapPool.execute(
    `CREATE DATABASE IF NOT EXISTS \`${dbName.replace(/`/g, '``')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      phone VARCHAR(25) NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('student','parent') NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL DEFAULT NULL,
      INDEX idx_users_role (role),
      INDEX idx_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Small compatibility migrations for databases created by earlier builds.
  const [columns] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
    [dbName]
  );
  const names = new Set(columns.map(row => String(row.COLUMN_NAME)));
  if (!names.has('phone')) await pool.execute(`ALTER TABLE users ADD COLUMN phone VARCHAR(25) NULL AFTER email`);
  if (!names.has('last_login')) await pool.execute(`ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL AFTER created_at`);
}

export async function ensureFamilyUsersTable() {
  if (!schemaReady) {
    schemaReady = ensureSchema().catch(error => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function createFamilyUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: FamilyAuthRole;
}) {
  await ensureFamilyUsersTable();
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone?.trim() || null;
  const passwordHash = await bcrypt.hash(input.password, 12);

  const [result] = await pool.execute<mysql.ResultSetHeader>(
    `INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, passwordHash, input.role]
  );

  return { id: result.insertId, name, email, phone: phone || '', role: input.role };
}

export async function authenticateFamilyUser(emailInput: string, password: string, role: FamilyAuthRole) {
  await ensureFamilyUsersTable();
  const email = emailInput.trim().toLowerCase();
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(
    `SELECT id, name, email, phone, role, password_hash, created_at FROM users WHERE email = ? AND role = ? LIMIT 1`,
    [email, role]
  );
  const user = rows[0] as (FamilyUser & { password_hash: string }) | undefined;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;

  await pool.execute(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`, [user.id]);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role
  };
}

export async function getFamilyUserCount() {
  await ensureFamilyUsersTable();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(`SELECT COUNT(*) AS count FROM users`);
  return Number(rows[0]?.count || 0);
}

export function createFamilyToken() {
  return crypto.randomBytes(32).toString('hex');
}
