/**
 * db-setup.js — Run SQL migration/seed files against the connected database
 *
 * Loads .env, connects via mysql2, and executes SQL files in order.
 * Designed for initial setup of an EMPTY database.
 *
 * Usage:
 *   node scripts/db-setup.js                     # schema + migrations only
 *   node scripts/db-setup.js --seed              # schema + migrations + demo data
 *   node scripts/db-setup.js --seed --admin      # schema + migrations + demo data + admin01
 *   node scripts/db-setup.js --admin             # schema + migrations + admin01 (no demo data)
 *   node scripts/db-setup.js --dry-run           # show what would run, don't execute
 *
 * Safety:
 *   - Refuses to run if any of the 10 expected tables already exist (use --force to override)
 *   - Prints each file before executing so you can see exactly what's happening
 *   - Never reads or prints the database password
 */

const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

// ── Load .env ────────────────────────────────────────────────
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// ── Config ───────────────────────────────────────────────────
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

// ── Files ────────────────────────────────────────────────────
const DB_ROOT = path.join(__dirname, '..', 'database');

const SCHEMA_FILES = [
  { path: path.join(DB_ROOT, 'migrations', '002_full_schema.sql'),        label: 'Schema: 10 tables' },
  { path: path.join(DB_ROOT, 'migrations', '003_conversation_type.sql'),  label: 'Migration: conversations.type column' },
];

const SEED_FILES = [
  { path: path.join(DB_ROOT, 'seeds', '002_seed_data.sql'),  label: 'Seed: demo users, categories, listings, messages' },
];

const ADMIN_FILES = [
  { path: path.join(DB_ROOT, 'seeds', '003_admin01.sql'),    label: 'Seed: rename admin to admin01 (login: admin01 / 123123)' },
];

const EXPECTED_TABLES = [
  'users', 'categories', 'listings', 'listing_images',
  'favorites', 'offers', 'conversations', 'messages',
  'reports', 'admin_logs',
];

// ── Parse flags ──────────────────────────────────────────────
const args = process.argv.slice(2);
const wantSeed  = args.includes('--seed');
const wantAdmin = args.includes('--admin');
const dryRun    = args.includes('--dry-run');
const force     = args.includes('--force');

// ── Main ─────────────────────────────────────────────────────
async function main() {
  // Build file list
  const files = [...SCHEMA_FILES];
  if (wantSeed)  files.push(...SEED_FILES);
  if (wantAdmin) files.push(...ADMIN_FILES);

  console.log('\n=== Database Setup ===\n');
  console.log(`Target:   ${cfg.host}:${cfg.port} / ${cfg.database}`);
  console.log(`User:     ${cfg.user}`);
  console.log(`SSL:      ${cfg.ssl ? 'ON' : 'OFF'}`);
  console.log(`Mode:     ${dryRun ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log();

  console.log('Files to execute:');
  for (let i = 0; i < files.length; i++) {
    const exists = fs.existsSync(files[i].path);
    console.log(`  ${i + 1}. ${files[i].label}`);
    console.log(`     ${path.relative(process.cwd(), files[i].path)}${exists ? '' : '  [FILE NOT FOUND]'}`);
  }
  console.log();

  if (dryRun) {
    console.log('Dry run complete — no database changes made.');
    return;
  }

  // Connect
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
      multipleStatements: true,  // required to run full SQL files
    });
    console.log('Connected.\n');
  } catch (err) {
    console.error(`Connection FAILED: ${err.message}`);
    process.exit(1);
  }

  // Safety check: refuse if tables already exist (unless --force)
  try {
    const [rows] = await conn.query('SHOW TABLES');
    const existing = rows.map(r => Object.values(r)[0]);
    const overlap = EXPECTED_TABLES.filter(t => existing.includes(t));
    if (overlap.length > 0 && !force) {
      console.error(`ABORTED: ${overlap.length} table(s) already exist: ${overlap.join(', ')}`);
      console.error('This script is for initial setup of an EMPTY database.');
      console.error('Use --force to override (WARNING: 002_full_schema.sql drops all tables).');
      await conn.end();
      process.exit(1);
    }
    if (overlap.length > 0 && force) {
      console.log(`WARNING: --force used. ${overlap.length} existing table(s) will be dropped: ${overlap.join(', ')}\n`);
    }
  } catch (e) {
    console.error(`Could not check existing tables: ${e.message}`);
    await conn.end();
    process.exit(1);
  }

  // Execute each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`[${i + 1}/${files.length}] ${file.label}`);
    try {
      const sql = fs.readFileSync(file.path, 'utf8');
      await conn.query(sql);
      console.log(`  Done.\n`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}\n`);
      console.error('Stopping. Fix the error and re-run.');
      await conn.end();
      process.exit(1);
    }
  }

  // Verify
  console.log('--- Verification ---\n');
  try {
    const [rows] = await conn.query('SHOW TABLES');
    const tables = rows.map(r => Object.values(r)[0]);
    const present = EXPECTED_TABLES.filter(t => tables.includes(t));
    const missing = EXPECTED_TABLES.filter(t => !tables.includes(t));
    console.log(`Tables: ${present.length}/10 present`);
    if (missing.length > 0) console.log(`Missing: ${missing.join(', ')}`);

    for (const t of present) {
      const [[row]] = await conn.query(`SELECT COUNT(*) AS cnt FROM \`${t}\``);
      console.log(`  ${t}: ${row.cnt} rows`);
    }
  } catch (e) {
    console.error(`Verification error: ${e.message}`);
  }

  console.log('\nSetup complete.');
  await conn.end();
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
