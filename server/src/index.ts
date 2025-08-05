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

// CORS origins from env (comma-separated) or allow all
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
  : ['*'];

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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
const PORT = process.env.PORT || 3001;
// Always start the server (Render needs this)
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origins: ${allowedOrigins.join(', ')}`);
});

// Export app for serverless
export default app;
