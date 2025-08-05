import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth';
import figmaRoutes from './routes/figma';
import analyzeRoutes from './routes/analyze';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Version
const SERVER_VERSION = '1.0.2';

// CORS origins from env (comma-separated) or allow all
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
  : ['*'];

// Port configuration
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/figma', figmaRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: SERVER_VERSION, timestamp: new Date().toISOString() });
});

// Debug endpoint
app.get('/api/debug', (_req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    port: PORT,
    corsOrigin: process.env.CORS_ORIGIN || 'not set',
    hasClaudeKey: !!process.env.CLAUDE_API_KEY,
    hasFigmaToken: !!process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
    allowedOrigins
  });
});

// Socket.IO setup
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, credentials: true },
});
io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});
app.set('io', io);

// Start server
// Always start the server (Render needs this)
httpServer.listen(Number(PORT), () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origins: ${allowedOrigins.join(', ')}`);
});

// Export app for serverless
export default app;
