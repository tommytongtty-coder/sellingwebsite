/**
 * db-inspect.js — Read-only database inspection
 *
 * Loads .env, connects to the configured MySQL database, and reports:
 *   - Connection info (host, port, database, SSL, MySQL version)
 *   - Which of the 10 expected tables exist
 *   - Critical column checks (conversations.type, listings.is_certified, etc.)
 *   - Row counts per table
 *   - Whether an admin user exists
 *
 * This script executes ONLY read-only queries (SELECT, SHOW, DESCRIBE).
 * It never creates, alters, or drops anything.
 *
 * Usage:  node scripts/db-inspect.js
 */

const path = require('path');
const mysql = require('mysql2/promise');

// ── Load .env ────────────────────────────────────────────────
const dotenv = require('dotenv');
const envPath = path.join(__dirname, '..', '.env');
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  console.error(`[env] Could not load ${envPath}: ${dotenvResult.error.message}`);
  console.error('[env] Falling back to process environment variables.');
}

// ── Config (mirrors config/config.js logic) ──────────────────
function env(names, fallback) {
  const keys = Array.isArray(names) ? names : [names];
  for (const key of keys) {
    const val = process.env[key];
    if (val != null && val !== '') return val;
  }
  return fallback;
}

const cfg = {
  host:     env(['MYSQL_HOST', 'DB_HOST'], '127.0.0.1'),
  port:     parseInt(env(['MYSQL_PORT', 'DB_PORT'], '3306'), 10),
  user:     env(['MYSQL_USER', 'DB_USER'], 'root'),
  password: env(['MYSQL_PASSWORD', 'DB_PASSWORD'], 'root'),
  database: env(['MYSQL_DATABASE', 'DB_NAME'], 'marketplace'),
  ssl:      String(env(['MYSQL_SSL', 'DB_SSL'], '')).toLowerCase() === 'true'
              ? { rejectUnauthorized: false }
              : undefined,
};

// ── Expected schema ──────────────────────────────────────────
const EXPECTED_TABLES = [
  'users', 'categories', 'listings', 'listing_images',
  'favorites', 'offers', 'conversations', 'messages',
  'reports', 'admin_logs',
];

// Critical columns that migrations add or that the app relies on
const CRITICAL_COLUMNS = [
  { table: 'conversations', column: 'type',           note: 'Added by 003_conversation_type.sql — required for admin chat' },
  { table: 'listings',      column: 'is_certified',   note: 'Used by admin approve flow' },
  { table: 'listings',      column: 'views',          note: 'View counter' },
  { table: 'listings',      column: 'allow_meetup',   note: 'Delivery options' },
  { table: 'listings',      column: 'allow_delivery', note: 'Delivery options' },
  { table: 'listings',      column: 'status',         note: 'Listing workflow: draft/pending/active/sold/rejected' },
  { table: 'admin_logs',    column: 'old_value',      note: 'JSON column — requires MySQL 5.7+' },
  { table: 'admin_logs',    column: 'new_value',      note: 'JSON column — requires MySQL 5.7+' },
  { table: 'users',         column: 'role',           note: 'ENUM: buyer/seller/admin' },
];

// ── Helpers ──────────────────────────────────────────────────
function ok(msg)   { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.log(`  ✗ ${msg}`); }
function info(msg) { console.log(`  · ${msg}`); }

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║     Database Inspection (read-only)      ║');
  console.log('╚══════════════════════════════════════════╝\n');

  // Print connection target (never print password)
  console.log('[Connection]');
  info(`Host:     ${cfg.host}`);
  info(`Port:     ${cfg.port}`);
  info(`Database: ${cfg.database}`);
  info(`User:     ${cfg.user}`);
  info(`SSL:      ${cfg.ssl ? 'ON (rejectUnauthorized: false)' : 'OFF'}`);
  console.log();

  let conn;
  try {
    conn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      ssl: cfg.ssl,
      connectTimeout: 15000,
    });
    ok('Connected successfully\n');
  } catch (err) {
    warn(`Connection FAILED: ${err.message}\n`);
    if (err.code === 'ECONNREFUSED') {
      console.log('  Hint: Is the database server running? Check host/port in .env.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('  Hint: Check MYSQL_USER and MYSQL_PASSWORD in .env.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log(`  Hint: Database "${cfg.database}" does not exist on the server.`);
    }
    process.exit(1);
  }

  // ── MySQL version ────────────────────────────────────────
  console.log('[MySQL Version]');
  try {
    const [[row]] = await conn.query('SELECT VERSION() AS version');
    info(`${row.version}`);
  } catch (e) {
    warn(`Could not determine version: ${e.message}`);
  }

  // ── Current database ─────────────────────────────────────
  try {
    const [[row]] = await conn.query('SELECT DATABASE() AS db');
    info(`Active database: ${row.db}`);
  } catch (e) { /* ignore */ }
  console.log();

  // ── Tables ───────────────────────────────────────────────
  console.log('[Tables]');
  let existingTables = [];
  try {
    const [rows] = await conn.query('SHOW TABLES');
    // SHOW TABLES returns rows like { Tables_in_<dbname>: 'tablename' }
    existingTables = rows.map(r => Object.values(r)[0]);
  } catch (e) {
    warn(`Could not list tables: ${e.message}`);
  }

  const missing = [];
  const extra = [];

  for (const t of EXPECTED_TABLES) {
    if (existingTables.includes(t)) {
      ok(t);
    } else {
      warn(`${t}  — MISSING`);
      missing.push(t);
    }
  }

  for (const t of existingTables) {
    if (!EXPECTED_TABLES.includes(t)) {
      info(`${t}  (extra — not in expected schema)`);
      extra.push(t);
    }
  }

  console.log();
  if (missing.length > 0) {
    console.log(`  ⚠  ${missing.length} expected table(s) missing: ${missing.join(', ')}`);
    console.log();
  }

  // ── Row counts ───────────────────────────────────────────
  console.log('[Row Counts]');
  for (const t of existingTables) {
    try {
      const [[row]] = await conn.query(`SELECT COUNT(*) AS cnt FROM \`${t}\``);
      info(`${t}: ${row.cnt} rows`);
    } catch (e) {
      warn(`${t}: error — ${e.message}`);
    }
  }
  console.log();

  // ── Critical columns ─────────────────────────────────────
  console.log('[Critical Columns]');
  const columnIssues = [];
  for (const check of CRITICAL_COLUMNS) {
    if (!existingTables.includes(check.table)) {
      warn(`${check.table}.${check.column} — table missing`);
      columnIssues.push(check);
      continue;
    }
    try {
      const [cols] = await conn.query(
        `SHOW COLUMNS FROM \`${check.table}\` LIKE ?`,
        [check.column]
      );
      if (cols.length > 0) {
        const col = cols[0];
        ok(`${check.table}.${check.column}  (${col.Type})`);
      } else {
        warn(`${check.table}.${check.column} — MISSING  [${check.note}]`);
        columnIssues.push(check);
      }
    } catch (e) {
      warn(`${check.table}.${check.column} — error: ${e.message}`);
      columnIssues.push(check);
    }
  }
  console.log();

  // ── Admin user check ─────────────────────────────────────
  console.log('[Admin User]');
  if (existingTables.includes('users')) {
    try {
      const [admins] = await conn.query(
        "SELECT id, username, email, role FROM users WHERE role = 'admin'"
      );
      if (admins.length === 0) {
        warn('No user with role=admin found');
        console.log('  Hint: Run database/seeds/003_admin01.sql to create the admin account.');
      } else {
        for (const a of admins) {
          ok(`id=${a.id}  username=${a.username}  email=${a.email}  role=${a.role}`);
        }
      }
    } catch (e) {
      warn(`Could not check admin users: ${e.message}`);
    }
  } else {
    warn('users table missing — cannot check');
  }
  console.log();

  // ── Summary ──────────────────────────────────────────────
  console.log('[Summary]');
  const tableOk = missing.length === 0;
  const colOk = columnIssues.length === 0;

  if (tableOk && colOk) {
    ok('Schema looks compatible — all 10 tables and critical columns present.');
    console.log('  The app should be able to connect and operate normally.');
  } else {
    if (!tableOk) {
      warn(`${missing.length} table(s) missing — the schema needs to be created or migrated.`);
    }
    if (!colOk) {
      warn(`${columnIssues.length} critical column(s) missing — migrations may be needed.`);
      for (const c of columnIssues) {
        console.log(`    → ${c.table}.${c.column}: ${c.note}`);
      }
    }
    console.log('\n  Recommended migration files (run in order):');
    if (!tableOk) {
      console.log('    1. database/migrations/002_full_schema.sql  (creates all tables — DESTRUCTIVE: drops existing)');
    }
    const needsType = columnIssues.some(c => c.table === 'conversations' && c.column === 'type');
    if (needsType) {
      console.log('    2. database/migrations/003_conversation_type.sql  (adds conversations.type column)');
    }
    console.log('\n  ⚠  Do NOT run 002_full_schema.sql against a database with existing data you want to keep.');
    console.log('     It drops all 10 tables before recreating them.');
  }

  console.log();
  await conn.end();
}

main().catch(err => {
  console.error(`\nFatal error: ${err.message}`);
  process.exit(1);
});
