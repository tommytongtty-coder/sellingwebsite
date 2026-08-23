# Architecture Overview

## Technology stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 16, React Router 5, inline styles |
| Backend | Node.js 26, Express 4, Babel (ESM → CJS via webpack) |
| Database | MySQL (MAMP locally, configurable via `.env`) |
| Build | Webpack 4 (separate client + server bundles) |
| Dev server | Nodemon + webpack-dev-middleware + HMR |

---

## Folder map — who works where

```
sellingwebsite/
│
├── client/               ← FRONTEND DEVELOPERS
│   ├── App.js            ← Router only — add new <Route> entries here
│   ├── main.js           ← React entry point — do not edit unless changing hydration
│   ├── pages/            ← One file per page/route
│   ├── components/       ← Reusable UI components shared across pages
│   ├── services/         ← API fetch hooks (useListings, useCategories, …)
│   └── styles/           ← Shared JS style objects (shell, card, colours)
│
├── server/               ← BACKEND DEVELOPERS
│   ├── server.js         ← Express bootstrap + SSR — rarely needs editing
│   ├── routes/           ← Wire URL paths to controllers here
│   ├── controllers/      ← Handle req/res; call services; return JSON
│   ├── services/         ← Business logic; orchestrate repositories
│   ├── repositories/     ← All SQL queries live here — one file per table
│   └── middleware/       ← Express middleware (error handler, auth, etc.)
│
├── database/             ← DATABASE / DBA
│   ├── connection.js     ← mysql2 pool — import this in repositories
│   ├── migrations/       ← Schema changes; run in order on every new environment
│   ├── seeds/            ← Sample data for development; idempotent
│   └── legacy/           ← Old SQL files kept for reference — do not run
│
├── tests/                ← ANY DEVELOPER
│   └── api/              ← Integration tests (require running server + MySQL)
│
├── docs/                 ← ANY DEVELOPER
│   └── architecture.md   ← This file
│
├── config/config.js      ← Read-only env vars — edit .env instead
├── scripts/              ← Build tooling — do not edit unless changing build
├── template.js           ← Server-rendered HTML shell
└── webpack.config.*.js   ← Webpack configs — do not edit unless changing build
```

---

## Data flow

```
Browser
  └─▶ GET /api/listings
        └─▶ server/routes/listings.routes.js
              └─▶ server/controllers/listings.controller.js
                    └─▶ server/services/listings.service.js
                          └─▶ server/repositories/listings.repository.js
                                └─▶ database/connection.js (mysql2 pool)
                                      └─▶ MySQL: listings + categories tables
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/categories` | All categories ordered by id |
| GET | `/api/listings` | All listings with category name, ordered by created_at DESC |

Response shapes are documented in `tests/api/`.

---

## Adding a new feature

### New API endpoint (example: `GET /api/listings/:id`)

1. Add SQL in `server/repositories/listings.repository.js`
2. Add business logic in `server/services/listings.service.js` (if needed)
3. Add controller method in `server/controllers/listings.controller.js`
4. Register route in `server/routes/listings.routes.js`
5. Add integration test in `tests/api/listings.test.js`

### New page (example: `/listing/:id`)

1. Create `client/pages/ListingDetailPage.js`
2. Add `<Route path="/listing/:id">` in `client/App.js`
3. Add fetch hook in `client/services/api.js` if needed

### New database column or table

1. Create `database/migrations/002_your_description.sql` (always increment number)
2. Update the relevant repository file
3. Update `database/seeds/` if sample data is needed

---

## Environment setup

Copy `.env.example` to `.env` and fill in your local values.  
See `SETUP.md` for full developer onboarding steps.

**Never commit `.env`** — it is listed in `.gitignore`.
