# Developer Setup Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 13+ (tested on v26) |
| npm | 6+ |
| MySQL | 5.7 or 8.0 via MAMP, XAMPP, or system install |

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

Open `.env` and fill in your local values:

```
MYSQL_HOST=127.0.0.1
MYSQL_PORT=8889       # MAMP default; standard MySQL uses 3306
MYSQL_USER=root
MYSQL_PASSWORD=root   # MAMP default
MYSQL_DATABASE=marketplace
```

> **Important:** Never commit `.env`. It is listed in `.gitignore`.

---

## 3. Set up the MySQL database

### Start MySQL

- **MAMP:** Open MAMP → click **Start Servers** → wait for MySQL to go green
- **System MySQL:** `mysql.server start`

### Run the migration (creates tables)

**Option A — phpMyAdmin (easiest)**

1. Open `http://localhost:8888/phpMyAdmin`
2. Click **Import** → **Choose File**
3. Select `database/migrations/001_create_tables.sql`
4. Click **Go**

**Option B — Terminal**

```bash
# MAMP
/Applications/MAMP/Library/bin/mysql -u root -p -P 8889 < database/migrations/001_create_tables.sql

# System MySQL
mysql -u root -p < database/migrations/001_create_tables.sql
```

### Run the seed (sample data)

Repeat the same import step with `database/seeds/001_seed_data.sql`.

Both files are **idempotent** — safe to re-run if something goes wrong.

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
| `npm test` | Run integration tests (requires running server + MySQL) |

---

## API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/categories` | Returns all categories |
| GET | `/api/listings` | Returns all listings with category |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` on port 8889/3306 | MySQL is not running — start MAMP or MySQL |
| `ER_ACCESS_DENIED_ERROR` | Wrong `MYSQL_USER` / `MYSQL_PASSWORD` in `.env` |
| `ER_BAD_DB_ERROR` | Database not created — run the migration SQL |
| Listings not loading | Open browser console and check for failed `/api/listings` fetch |
| Port 3000 in use | `lsof -ti :3000 \| xargs kill -9` then retry |
| `ERR_OSSL_EVP_UNSUPPORTED` | Node.js version too new — already handled via `NODE_OPTIONS` in `nodemon.json` |

---

## Database files reference

| File | Purpose |
|------|---------|
| `database/migrations/001_create_tables.sql` | Creates `categories` and `listings` tables |
| `database/seeds/001_seed_data.sql` | Inserts sample data |
| `database/legacy/` | Old SQL files kept for reference — do not use for fresh setup |
