# Project Merge Summary — May 17, 2026

## Overview

Merged two separate project folders into a connected full-stack authentication system:

- **Backend** (`intprog-Lab6/Lab6-INTPROG`) — Node.js/Express 5 API with MySQL
- **Frontend** (`intprog-act7/Act7`) — Angular 21 SPA

---

## What Was Done

### 1. Removed Fake Backend from Angular Frontend

The Angular app originally used a **341-line `FakeBackendInterceptor`** (`fake-backend.ts`) that intercepted all HTTP calls and returned mock responses from `localStorage`. This was completely bypassed so the frontend now talks to the real Express API.

**Files changed:**
- `src/app/app.module.ts` — Removed `fakeBackendProvider` from providers (kept as toggleable comment for Stage A demo)
- `src/app/_helpers/index.ts` — Kept fake-backend export for toggle capability
- `src/environments/environment.prod.ts` — Fixed `production: false` → `true`, added production API URL placeholder

**The fake backend is still available** as a toggleable feature for Stage A demonstration:
```typescript
// In app.module.ts providers:
// STAGE A: Uncomment to enable fake backend
// fakeBackendProvider
```

---

### 2. Migrated Backend from Hardcoded Config to Environment Variables

The backend previously imported all secrets from a committed `config.json` file. All references were replaced with `process.env.*` variables loaded via the `dotenv` package.

**Files changed:**
| File | Change |
|------|--------|
| `server.ts` | Added `dotenv/config` import, production CORS with allowlist, health check endpoint |
| `_helpers/db.ts` | `config.database.*` → `process.env.DB_*` |
| `_helpers/send-email.ts` | Replaced nodemailer/Ethereal with Resend SMTP relay |
| `_middleware/authorize.ts` | `config.secret` → `process.env.JWT_SECRET` |
| `accounts/account.service.ts` | `config.secret` → `process.env.JWT_SECRET`, removed unused imports, wrapped email sending in try/catch |

**New files created:**
| File | Purpose |
|------|---------|
| `.env` | Local environment variables (gitignored) |
| `.env.example` | Template for required variables (committed) |
| `.gitignore` | Prevents `.env` and `node_modules` from being committed |

---

### 3. Production-Ready CORS

Replaced the "allow everything" CORS policy:
```typescript
// BEFORE (insecure — allows any origin)
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// AFTER (production-ready — allowlist from env var)
const allowedOrigins = process.env.CORS_ORIGIN.split(',');
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error('CORS not allowed'));
    },
    credentials: true
}));
```

---

### 4. Switched Email Provider to Resend

Replaced Ethereal (test SMTP) with **Resend** (`smtp.resend.com`) for real email delivery.

- Uses `RESEND_API_KEY` env var for authentication
- `DEV_EMAIL_REDIRECT` env var redirects all emails to a single address (workaround for Resend free tier)
- Registration no longer fails if email delivery fails (try/catch wrapper)

---

### 5. Expanded Swagger API Documentation

Expanded `swagger.yaml` from 1 endpoint (health check) to **13 fully documented endpoints** covering:
- Authentication (login, refresh token, revoke token)
- Registration & email verification
- Password reset flow
- Account CRUD (get all, get by ID, create, update, delete)
- Bearer token security scheme

Accessible at: `http://localhost:4000/api-docs`

---

### 6. README Files

Added comprehensive `README.md` to both repos with:
- Live deployment links (placeholders)
- Local setup instructions
- Environment variable reference
- API endpoint table (backend)
- Stage A/B toggle instructions (frontend)

---

## Current Architecture

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   Angular 21 Frontend   │  HTTP   │   Express 5 Backend     │
│   (intprog-act7/Act7)   │────────▶│   (Lab6-INTPROG)        │
│                         │         │                         │
│  • JWT Interceptor      │         │  • JWT Auth Middleware   │
│  • Error Interceptor    │         │  • Sequelize + MySQL     │
│  • Auth Guard (RBAC)    │         │  • Resend Email          │
│  • Environment configs  │         │  • Swagger Docs          │
│                         │         │  • CORS Allowlist        │
│  Port: 4200             │         │  Port: 4000              │
└─────────────────────────┘         └─────────────────────────┘
```

---

## Remaining Steps

- [ ] Set up TiDB Cloud (remote MySQL) and update `DB_*` env vars
- [ ] Deploy backend to **Render** and get public URL
- [ ] Deploy frontend to **Vercel** with SPA rewrite rule
- [ ] Update `environment.prod.ts` with Render backend URL
- [ ] Update `CORS_ORIGIN` on Render with Vercel frontend URL
- [ ] Push both repos to GitHub with final commits
- [ ] Update README.md live links in both repos

---

## How to Run Locally

**Terminal 1 — Backend:**
```bash
cd intprog-Lab6/Lab6-INTPROG
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd intprog-act7/Act7
npm start
```

Open `http://localhost:4200`
