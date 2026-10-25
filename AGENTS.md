# Project Notes

## Stack
MERN-style app but with **MySQL** (not MongoDB): React frontend, Node/Express backend, MySQL via `mysql2`.

Backend layering: `routes/` → `controllers/` → `services/` → `repositories/` → MySQL.

## Running the app

```bash
npm run development   # start dev server on port 3000
```

**Restart the dev server after editing anything under `client/`.** `nodemon.json` only
watches `./server`, and the SSR bundle (`dist/server.generated.js`) is built once at
startup — so client edits are not picked up and the server keeps rendering the old
markup. Symptom: your change compiles fine but the page looks unchanged.

```bash
lsof -ti :3000 | xargs kill -9 && npm run development
```

## Database (Remote MySQL)

MySQL is hosted remotely. Connection details (host, port, user, password, database) are in `.env`.

```bash
npm run db:inspect   # check connection and schema status
npm run db:setup     # initial setup (schema + migrations, empty database only)
npm run db:setup:full # setup with demo seed data + admin account
```

## Common issues

- **`ECONNREFUSED`** — check that `MYSQL_HOST`, `MYSQL_PORT` in `.env` are correct and the remote DB is reachable.
- **`EADDRINUSE :::3000`** — a server is already on port 3000. Kill it with
  `lsof -ti :3000 | xargs kill -9`.
- **`jwt expired`** — the JWT in localStorage has passed its 7-day expiry. Log out and back in.
- **Xcode license blocks git** — if `git` fails with an Xcode license error, point the
  toolchain at the Command Line Tools instead of full Xcode:
  `sudo xcode-select -s /Library/Developer/CommandLineTools`

## Verification

There is no test suite. To verify changes compile:

```bash
NODE_OPTIONS=--openssl-legacy-provider npx webpack --config webpack.config.client.js --mode development
NODE_OPTIONS=--openssl-legacy-provider npx webpack --config webpack.config.server.js --mode development
```

## Listing workflow

Listings use a draft-to-pending flow so a listing is never published without its images:

1. `POST /api/listings` — creates the listing with `status: 'draft'`
2. `POST /api/listings/:id/images` — uploads images (rolls back the draft if the DB insert fails)
3. `POST /api/listings/:id/publish` — moves `draft` → `pending` for admin moderation

Admins then approve (`pending` → `active`) or reject from the admin page.

Sellers cannot set `status`, `is_certified`, or `views` directly — the service layer strips
these from seller input. Registration only permits the `buyer` and `seller` roles.

## SSR note

The server renders React via `react-dom/server`, so `localStorage` is unavailable during SSR.
Access it through the guarded `storage` constant in `client/auth.js` and `client/services/api.js`
rather than referencing `localStorage` directly.
