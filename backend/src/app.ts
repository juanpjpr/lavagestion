import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { authenticate } from './middlewares/auth';

// Routes
import authRoutes from './modules/auth/auth.routes';
import clientsRoutes from './modules/clients/clients.routes';
import ordersRoutes from './modules/orders/orders.routes';
import reportsRoutes from './modules/reports/reports.routes';

const app = express();

// --- Global Middleware ---
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// --- Public routes ---
app.use('/api/auth', authRoutes);

// --- Protected routes (requieren JWT, inyectan tenantId) ---
app.use('/api/clients', authenticate, clientsRoutes);
app.use('/api/orders', authenticate, ordersRoutes);
app.use('/api/reports', authenticate, reportsRoutes);

// --- Frontend app (React SPA) ---
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use('/app', express.static(frontendPath));
app.get('/app/*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Landing page (static files) ---
const landingPath = path.join(__dirname, '../landing');
app.use(express.static(landingPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(landingPath, 'index.html'));
});

// --- Error handler (debe ir al final) ---
app.use(errorHandler);

export default app;
