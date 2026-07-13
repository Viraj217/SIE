import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import inquiriesRouter from './routes/inquiries';
import productsRouter from './routes/products';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// ── Routes ──────────────────────────────────────────────────────────────
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/products', productsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Shah Industrial Enterprise API',
  });
});

// ── Start ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚙️  Shah Industrial API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Products: http://localhost:${PORT}/api/products`);
  console.log(`   Inquiries: http://localhost:${PORT}/api/inquiries\n`);
});
