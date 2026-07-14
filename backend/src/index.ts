import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routes/auth';
import inquiriesRouter from './routes/inquiries';
import productsRouter from './routes/products';
import timelineRouter from './routes/timeline';
import industriesRouter from './routes/industries';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────
app.use(helmet());

// Set up allowed origins for CORS validation
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = ['http://localhost:3000', 'https://shah-industrial-frontend.vercel.app'];

if (frontendUrl) {
  const normalized = frontendUrl.replace(/\/$/, '');
  if (!allowedOrigins.includes(normalized)) {
    allowedOrigins.push(normalized);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Blocked by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// ── Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/industries', industriesRouter);

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
  console.log(`   Inquiries: http://localhost:${PORT}/api/inquiries`);
  console.log(`   Timeline: http://localhost:${PORT}/api/timeline`);
  console.log(`   Industries: http://localhost:${PORT}/api/industries\n`);
});
