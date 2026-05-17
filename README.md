# IntProg Lab6 — Backend API

Full-stack authentication system backend built with **Node.js**, **Express 5**, **TypeScript**, **Sequelize ORM**, and **MySQL**.

## Live Deployment

- **Live API**: `https://lab6-intprog.onrender.com`
- **Swagger Docs**: `https://lab6-intprog.onrender.com/api-docs`
- **Frontend App**: `https://laroco-angular21-fullstack.vercel.app`

## Features

- JWT access token + HTTP-only refresh token cookie authentication
- Role-based access control (Admin / User)
- Email verification and password reset via Resend
- Full CRUD for user accounts
- Production-ready CORS configuration
- Swagger/OpenAPI documentation

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js + Express 5 | HTTP server & routing |
| TypeScript | Type safety |
| Sequelize | MySQL ORM |
| JWT + bcrypt | Authentication & password hashing |
| Resend | Transactional emails |
| Joi | Request validation |

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials and Resend API key

# 3. Start development server
npm run start:dev
```

The API runs on `http://localhost:4000`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL user |
| `DB_PASS` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `RESEND_API_KEY` | Resend API key for emails |
| `EMAIL_FROM` | Sender email address |
| `CORS_ORIGIN` | Allowed frontend origin(s) |

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/accounts/authenticate` | No | Login |
| POST | `/accounts/refresh-token` | Cookie | Refresh JWT |
| POST | `/accounts/revoke-token` | JWT | Logout |
| POST | `/accounts/register` | No | Register |
| POST | `/accounts/verify-email` | No | Verify email |
| POST | `/accounts/forgot-password` | No | Request reset |
| POST | `/accounts/reset-password` | No | Reset password |
| GET | `/accounts` | Admin | List all |
| GET | `/accounts/:id` | JWT | Get by ID |
| POST | `/accounts` | Admin | Create |
| PUT | `/accounts/:id` | JWT | Update |
| DELETE | `/accounts/:id` | JWT | Delete |
