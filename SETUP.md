# Developer Setup Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 6+ |
| MySQL | 8.0+ (remote, configured via `.env`) |

---

## 1. Clone and install dependencies

```bash
git clone <repo-url>
cd sellingwebsite
npm install
```

---

## 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your database connection details:

```
MYSQL_HOST=<your-db-host>
MYSQL_PORT=<your-db-port>
MYSQL_USER=<your-db-user>
MYSQL_PASSWORD=<your-db-password>
MYSQL_DATABASE=<your-db-name>
MYSQL_SSL=true
```

> **Important:** Never commit `.env`. It is listed in `.gitignore`.

---

## 3. Set up the database

### Verify connection

```bash
npm run db:inspect
```

This connects (read-only) and reports which tables exist, column checks, and row counts.

### Run initial setup (empty database only)

```bash
npm run db:setup          # schema + migrations only
npm run db:setup:full     # schema + migrations + demo data + admin account
```

The setup script refuses to run if tables already exist (use `--force` to override).

---

## 4. Start the development server

```bash
npm run development
```

Open `http://localhost:3000` in your browser.

- The server rebuilds automatically when you change files in `server/`
- The browser updates automatically (HMR) when you change files in `client/`

---

## 5. Project structure

See `docs/architecture.md` for the full folder map and a guide on which folder each role should work in.

---

## Available commands

| Command | Description |
|---------|-------------|
| `npm run development` | Start dev server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run start` | Run the production build |
| `npm run db:inspect` | Check database connection and schema status |
| `npm run db:setup` | Initial database setup (schema + migrations) |
| `npm run db:setup:full` | Initial setup with demo seed data + admin |

---

## API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/categories` | Returns all categories |
| GET | `/api/listings` | Returns all active listings with category |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` | Database not reachable — check `MYSQL_HOST` and `MYSQL_PORT` in `.env` |
| `ER_ACCESS_DENIED_ERROR` | Wrong `MYSQL_USER` / `MYSQL_PASSWORD` in `.env` |
| `ER_BAD_DB_ERROR` | Database does not exist — create it on your hosting provider |
| Listings not loading | Open browser console and check for failed `/api/listings` fetch |
| Port 3000 in use | `lsof -ti :3000 \| xargs kill -9` then retry |
| `ERR_OSSL_EVP_UNSUPPORTED` | Already handled via `NODE_OPTIONS` in `nodemon.json` |

---

## Database files reference

| File | Purpose |
|------|---------|
| `database/migrations/002_full_schema.sql` | Creates all 10 tables (full schema) |
| `database/migrations/003_conversation_type.sql` | Adds conversation type column |
| `database/seeds/002_seed_data.sql` | Demo data for development |
| `database/seeds/003_admin01.sql` | Admin account setup |
