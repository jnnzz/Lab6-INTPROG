# Project Plan: Node.js, TypeScript & MySQL Boilerplate API

## Overview

Build a fully functional authentication API from scratch using **TypeScript**, **Express**, **Sequelize (MySQL)**, and **JWTs**.

---

## Features to Build

- User Registration & Email Verification
- JWT Authentication with Refresh Tokens
- Refresh Token Rotation
- Role-Based Access Control (RBAC) — Admin and User
- Account Management (forgot/reset password, CRUD)
- Swagger API Documentation at `/api-docs`

---

## Part 1: Project Setup

**Goal:** Initialize the Node.js project and install all dependencies.

### Steps
1. Create project folder and run `npm init -y`
2. Install **production dependencies**: `express`, `cors`, `body-parser`, `cookie-parser`, `bcryptjs`, `jsonwebtoken`, `mysql2`, `sequelize`, `nodemailer`, `joi`, `swagger-ui-express`, `yamljs`, `express-jwt`
3. Install **dev dependencies**: `typescript`, `ts-node`, `nodemon`, and all `@types/*` packages
4. Run `npx tsc --init` and configure `tsconfig.json`:
   - `target: es2018`, `module: commonjs`, `outDir: ./dist`, `strict: false`
5. Add scripts to `package.json`:
   - `"start": "ts-node ./server.ts"`
   - `"start:dev": "nodemon --exec ts-node ./server.ts"`

---

## Part 2: Configuration & Database Setup

**Goal:** Create a central config file for DB credentials, JWT secret, and email settings.

### Files
- `config.json` — holds `database`, `secret`, `emailFrom`, and `smtpOptions`

### Notes
- Use [Ethereal Email](https://ethereal.email/) for free SMTP test credentials
- Database auto-created on first run via Sequelize

---

## Part 3: Helper Utilities (`_helpers/`)

**Goal:** Create reusable utility modules.

| File | Purpose |
|---|---|
| `db.ts` | Connects to MySQL, initializes Sequelize models, defines relationships, syncs tables |
| `send-email.ts` | Nodemailer wrapper for sending verification and reset emails |
| `role.ts` | Role enum (`Role.Admin`, `Role.User`) |
| `swagger.ts` | Serves Swagger UI at `/api-docs` using `swagger.yaml` |

### Notes
- `db.ts` creates the database if it doesn't exist on startup
- Account and RefreshToken have a one-to-many relationship (cascade delete)

---

## Part 4: Middleware (`_middleware/`)

**Goal:** Create Express middleware functions for cross-cutting concerns.

| File | Purpose |
|---|---|
| `error-handler.ts` | Global error handler — string errors → 400/404; `UnauthorizedError` → 401; others → 500 |
| `validate-request.ts` | Validates request body against a Joi schema |
| `authorize.ts` | JWT validation + role-based authorization; attaches `req.user` with `role` and `ownsToken` |

### Notes
- `authorize()` with no args = any authenticated user
- `authorize(Role.Admin)` = admin only
- Returns `401 Unauthorized` if auth or authorization fails

---

## Part 5: Accounts Module (`accounts/`)

**Goal:** Implement the full account lifecycle.

### Files

#### `account.model.ts`
Defines the Sequelize schema for the `accounts` table:
- Fields: `email`, `passwordHash`, `title`, `firstName`, `lastName`, `role`, `verificationToken`, `verified`, `resetToken`, `resetTokenExpires`, `passwordReset`, `created`, `updated`
- Virtual field: `isVerified` (true if `verified` or `passwordReset` is set)
- Default scope excludes `passwordHash`; `withHash` scope includes it

#### `refresh-token.model.ts`
Defines the Sequelize schema for the `refreshTokens` table:
- Fields: `token`, `expires`, `created`, `createdByIp`, `revoked`, `revokedByIp`, `replacedByToken`
- Virtual fields: `isExpired`, `isActive`

#### `account.service.ts`
Core business logic. Exported methods:

| Method | Description |
|---|---|
| `authenticate` | Validates credentials, returns JWT + refresh token |
| `refreshToken` | Rotates refresh token, returns new JWT + new refresh token |
| `revokeToken` | Marks a refresh token as revoked |
| `register` | Creates account, assigns role (first = Admin), sends verification email |
| `verifyEmail` | Confirms email using verification token |
| `forgotPassword` | Generates reset token (24hr expiry), sends reset email |
| `validateResetToken` | Validates a password reset token |
| `resetPassword` | Resets password using a valid reset token |
| `getAll` | Returns all accounts (admin only) |
| `getById` | Returns a single account |
| `create` | Admin creates a pre-verified account |
| `update` | Updates account fields |
| `delete` | Deletes an account |

#### `accounts.controller.ts`
Maps Express routes to service methods. Includes Joi schema validation per route.

**Routes:**

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/authenticate` | Public | Login |
| POST | `/refresh-token` | Public | Refresh JWT via cookie |
| POST | `/revoke-token` | Any auth | Revoke refresh token |
| POST | `/register` | Public | Register account |
| POST | `/verify-email` | Public | Verify email token |
| POST | `/forgot-password` | Public | Request password reset |
| POST | `/validate-reset-token` | Public | Validate reset token |
| POST | `/reset-password` | Public | Reset password |
| GET | `/` | Admin | Get all accounts |
| GET | `/:id` | Any auth | Get account by ID |
| POST | `/` | Admin | Create account |
| PUT | `/:id` | Any auth | Update account |
| DELETE | `/:id` | Any auth | Delete account |

---

## Part 6: Entry Point (`server.ts`)

**Goal:** Wire everything together with Express.

### Setup
- Parse JSON and URL-encoded bodies
- Parse cookies
- Enable CORS with credentials
- Mount `/accounts` route → `accountsController`
- Mount `/api-docs` route → Swagger docs
- Register global `errorHandler` middleware last
- Listen on port `4000` (dev) or `process.env.PORT` (prod)

---

## Part 7: Testing with Postman

**Goal:** Verify all API flows end-to-end.

### Test Flows (in order)

1. **Register** — `POST /accounts/register` with title, firstName, lastName, email, password, confirmPassword, acceptTerms
2. **Verify Email** — `POST /accounts/verify-email` with token from email
3. **Authenticate** — `POST /accounts/authenticate` → copy JWT from response, refresh token auto-set as `httpOnly` cookie
4. **Get All Accounts** — `GET /accounts` with Bearer Token (Admin only)
5. **Update Account** — `PUT /accounts/:id` with Bearer Token + JSON body
6. **Refresh Token** — `POST /accounts/refresh-token` (uses cookie automatically)
7. **Revoke Token** — `POST /accounts/revoke-token` with Bearer Token + `{ "token": "..." }`
8. **Forgot Password** — `POST /accounts/forgot-password` with `{ "email": "..." }`
9. **Reset Password** — `POST /accounts/reset-password` with token + new password
10. **Delete Account** — `DELETE /accounts/:id` with Bearer Token

---

## Folder Structure

```
node-mysql-api/
├── _helpers/
│   ├── db.ts
│   ├── send-email.ts
│   ├── role.ts
│   └── swagger.ts
├── _middleware/
│   ├── authorize.ts
│   ├── error-handler.ts
│   └── validate-request.ts
├── accounts/
│   ├── account.model.ts
│   ├── refresh-token.model.ts
│   ├── account.service.ts
│   └── accounts.controller.ts
├── config.json
├── swagger.yaml
├── server.ts
├── tsconfig.json
└── package.json
```

---

## Security Highlights

- JWT access tokens expire in **15 minutes**
- Refresh tokens expire in **7 days** and are stored in `httpOnly` cookies (XSS protection)
- Refresh Token Rotation: each use revokes the old token and issues a new one
- `replacedByToken` field creates an audit trail in the database
- Role-based guards prevent users from accessing other accounts
