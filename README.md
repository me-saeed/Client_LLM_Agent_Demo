# Aurexillion

A full-stack support ticket board with a Kanban-style UI. Users can view, create, search, filter, and drag tickets between **Open**, **In Progress**, and **Resolved** columns. Changes sync in real time via Socket.IO.

The repo is split into two apps:

| Directory   | Role                                      | Default URL              |
|-------------|-------------------------------------------|--------------------------|
| `frontend/` | Next.js UI + API proxy (BFF)              | http://localhost:3000    |
| `backend/`  | Express REST API + MongoDB + Socket.IO    | http://localhost:5000    |

---

## 1. Technologies used

### Frontend (`frontend/`)

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling
- **Zustand** for client state (`src/store/tickets/`)
- **@dnd-kit** for drag-and-drop between columns
- **react-hook-form** + **Yup** for forms and validation
- **Headless UI** for dialogs
- **socket.io-client** for real-time ticket updates
- **Next.js Route Handlers** (`app/api/ticket/`) as a BFF proxy to the backend

### Backend (`backend/`)

- **Express 5** + **TypeScript**
- **MongoDB** via **Mongoose 9**
- **Socket.IO** for `ticket:created` and `ticket:updated` events
- **Yup** request validation middleware
- **Swagger UI** at `/api-docs`
- **Vitest** + **Supertest** + **mongodb-memory-server** for API tests

### Prerequisites

- **Node.js** 20+
- **pnpm** (recommended; both apps use it)
- **MongoDB** running locally (default: `mongodb://localhost:27017/aurexillion`)

---

## 2. Installation instructions

Clone the repository and install dependencies in both apps:

```bash
git clone <repository-url>
cd Aurexillion

cd backend
pnpm install

cd ../frontend
pnpm install
```

### Environment variables

**Backend** — create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aurexillion
```

**Frontend** — optional `frontend/.env.local` (defaults work for local dev):

```env
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

- `BACKEND_URL` — used by Next.js API routes (server-side proxy)
- `NEXT_PUBLIC_BACKEND_URL` — used by the Socket.IO client in the browser

---

## 3. How to run the frontend and backend

Start **MongoDB** first, then run both apps in separate terminals.

### Backend

```bash
cd backend
pnpm dev
```

Runs on **http://localhost:5000**

- REST API: `http://localhost:5000/api/tickets`
- Swagger docs: **http://localhost:5000/api-docs**

### Frontend

```bash
cd frontend
pnpm dev
```

Runs on **http://localhost:3000** and redirects to `/tickets`.

### Production builds

```bash
# Backend (no build step — runs via ts-node in dev)
cd backend && pnpm dev

# Frontend
cd frontend
pnpm build
pnpm start
```

---

## 4. How to set up the database or seed sample data

### Database setup

1. Install and start MongoDB locally.
2. Ensure `MONGODB_URI` in `backend/.env` points to your instance (default: `mongodb://localhost:27017/aurexillion`).
3. Start the backend — Mongoose connects on startup.

The database and `tickets` collection are created automatically when the backend connects or when you run the seed script.

### Seed sample data

The backend includes a setup script that upserts 6 sample tickets (by unique `customerEmail`):

```bash
cd backend
pnpm setup
```

This runs `src/scripts/setup.ts`, which seeds data from `src/data/default-tickets.ts`. Re-running is safe — existing tickets with the same email are updated, not duplicated.

---

## 5. How to run the automated tests

Tests live in the **backend only** (no frontend test suite yet).

```bash
cd backend
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

### What the tests cover

- `tests/tickets.test.ts` — ticket API validation, create, and status update
- `tests/setup.ts` — spins up an in-memory MongoDB (`mongodb-memory-server`) before tests

Tests do **not** require a running MongoDB instance or the dev server.

### Linting

```bash
# Backend
cd backend && pnpm lint

# Frontend
cd frontend && pnpm lint
```

---

## 6. Assumptions and technical trade-offs

### Architecture

- **BFF proxy pattern** — The frontend calls `/api/ticket` (Next.js), which forwards to the Express API. This avoids CORS for REST calls and normalizes MongoDB `_id` to frontend `id`.
- **Direct Socket.IO connection** — Real-time updates connect from the browser to `localhost:5000`, not through the Next.js proxy. CORS is configured for `http://localhost:3000`.
- **Monorepo layout without a root workspace** — `frontend/` and `backend/` are independent packages; each needs its own `pnpm install`.

### Data and API

- **`customerEmail` is unique** — One ticket per email address; duplicate creates will fail at the DB level.
- **Status update is status-only** — `PATCH /api/tickets/:id` only accepts `{ status }`; other fields are not editable via the API yet.
- **Search filter (`name_title`)** — Applied in application memory after the DB query (title + customer name), not via a MongoDB text index. Fine for small datasets; less efficient at scale.
- **Optimistic drag-and-drop** — The UI updates ticket status immediately on drop; a failed PATCH leaves the UI out of sync until refresh or a socket event.
- **Create ticket response** — POST returns a success message, not the created ticket; the UI relies on Socket.IO `ticket:created` to show new tickets.

### Scope

- **No authentication** — `bcryptjs` and `jsonwebtoken` are listed as dependencies but not wired up; the board is open.
- **No delete flow** — Delete is not exposed in the UI or frontend API proxy.
- **Local development defaults** — Hard-coded fallbacks assume backend on port 5000 and frontend on port 3000.

---

## 7. What I would improve with more time

1. **Authentication & authorization** — JWT-based auth, protected API routes, and user-scoped tickets.
2. **Rollback on failed updates** — Revert optimistic drag-and-drop when PATCH fails; show toast errors.
3. **Return full ticket from POST** — Avoid relying solely on Socket.IO for create feedback; support clients without websockets.
4. **MongoDB-native search** — Text index or `$regex` filters in the query instead of in-memory filtering.
5. **Full ticket editing** — Edit title, description, priority, and customer fields in the detail modal.
6. **Delete tickets** — API + UI with confirmation.
7. **Frontend tests** — Component tests (Vitest/RTL) and E2E (Playwright) for drag-and-drop and forms.
8. **Docker Compose** — One command to start MongoDB, backend, and frontend.
9. **Root pnpm workspace** — Shared types between frontend and backend (e.g. `Ticket`, status enums).
10. **`.env.example` files** — Document required variables without committing secrets.
11. **CI pipeline** — GitHub Actions for lint + backend tests on every PR.
12. **Debounce search** — Reduce API calls while typing in the search box.
13. **Error boundaries & loading states** — Skeleton UI while tickets load; clearer error recovery.

---

## Project structure (overview)

```
Aurexillion/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Ticket HTTP handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routers/         # Express routes
│   │   ├── validations/     # Yup schemas
│   │   ├── scripts/setup.ts # DB seed script
│   │   └── server.ts        # Entry point
│   └── tests/               # Vitest API tests
└── frontend/
    ├── app/
    │   ├── api/ticket/      # BFF proxy to backend
    │   └── tickets/         # Ticket board page
    └── src/
        ├── component/       # UI components
        ├── store/tickets/   # Zustand store + API client
        └── hooks/           # Socket.IO hook
```

---

## API quick reference

| Method | Backend endpoint           | Frontend proxy        |
|--------|----------------------------|-----------------------|
| GET    | `/api/tickets`             | `/api/ticket`         |
| POST   | `/api/tickets`             | `/api/ticket`         |
| GET    | `/api/tickets/:id`         | `/api/ticket/:slug`   |
| PATCH  | `/api/tickets/:id`         | `/api/ticket/:slug`   |

**Socket events:** `ticket:created`, `ticket:updated`
