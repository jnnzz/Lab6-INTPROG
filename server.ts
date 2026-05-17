// @ts-nocheck
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./_middleware/error-handler";
import accountsController from "./accounts/accounts.controller";
import swaggerDocs from './_helpers/swagger';
import path from "path";

const app = express();

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ─── Production-ready CORS ───────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
    .split(',')
    .map(o => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: true
}));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/accounts', accountsController);
app.use('/api-docs', swaggerDocs);

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (_req, res) => {
    res.json({ message: 'API is running' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS origins: ${allowedOrigins.join(', ')}`);
});
