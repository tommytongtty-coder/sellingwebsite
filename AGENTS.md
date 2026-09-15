# Project Notes

## Stack
MERN-style app but with **MySQL** (not MongoDB): React frontend, Node/Express backend, MySQL via `mysql2`.

Backend layering: `routes/` → `controllers/` → `services/` → `repositories/` → MySQL.

## Running the app

```bash
npm run db:start      # start MAMP MySQL (must be running first)
npm run development   # start dev server on port 3000
```

**Restart the dev server after editing anything under `client/`.** `nodemon.json` only
watches `./server`, and the SSR bundle (`dist/server.generated.js`) is built once at
startup — so client edits are not picked up and the server keeps rendering the old
markup. Symptom: your change compiles fine but the page looks unchanged.

```bash
lsof -ti :3000 | xargs kill -9 && npm run development
```

## Database (MAMP MySQL)

MySQL runs via MAMP on port **8889** (not the standard 3306). Credentials and DB name are in `.env`.

```bash
npm run db:start    # start MySQL
npm run db:stop     # stop MySQL
npm run db:status   # check if MySQL is up
npm run db:shell    # open SQL shell on the marketplace database
```

## Common issues

- **`ECONNREFUSED 127.0.0.1:8889`** — MAMP MySQL is not running. Run `npm run db:start`.
  Note that having the MAMP app open does *not* mean the MySQL service is started.
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
