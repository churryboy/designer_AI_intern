import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth';
import figmaRoutes from './routes/figma';
import analyzeRoutes from './routes/analyze';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/figma', figmaRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

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

// Start server locally
const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for serverless
export default app;
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
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});
app.set('io', io);

// Start server locally
const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for serverless
export default app;
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

// Socket.IO
const io = new Server(httpServer, { cors: { origin: allowedOrigins, credentials: true } });
io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});
app.set('io', io);

// Start server locally
const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for serverless
export default app;
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

// CORS setup: allow origins specified in env (comma-separated), fallback to allow all
const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
  : ['*'];

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/figma', figmaRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup Socket.IO with CORS
const io = new Server(httpServer, {
  cors: { origin: origins, credentials: true },
});
io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 3001;
// Start server on local/development
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export app for serverless (Vercel)
export default app;
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

// CORS middleware: allow all origins (restrict in production via env/CORS_ORIGIN)
app.use(cors({ origin: true, credentials: true }));

// Body parsers
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
  cors: { origin: true, credentials: true },
});

aio.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Expose io to routes
app.set('io', io);

const PORT = process.env.PORT || 3001;

// Start server when not running on Vercel
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth';
import figmaRoutes from './routes/figma';
import analyzeRoutes from './routes/analyze';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Apply CORS (allow all origins - for now)
app.use(cors({ origin: true, credentials: true }));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/figma', figmaRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: { origin: true, credentials: true },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 3001;

// Start server if not in Vercel environment
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for serverless
export default app;
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth';
import figmaRoutes from './routes/figma';
import analyzeRoutes from './routes/analyze';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS setup: allow origins from env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Apply CORS middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/figma', figmaRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Socket.IO setup
type CorsOptions = { origin: string[]; credentials: boolean };
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, credentials: true } as CorsOptions,
});

iala.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 3001;

// Start server (not on Vercel)
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for serverless
export default app;
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth';
import figmaRoutes from './routes/figma';
import analyzeRoutes from './routes/analyze';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS setup: allow origins from env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Apply CORS middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Body parsers
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
type CorsOptions = { origin: string[]; credentials: boolean };
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, credentials: true } as CorsOptions,
});

io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 3001;

// Start server (not on Vercel)
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for serverless
export default app;
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth';
import figmaRoutes from './routes/figma';
import analyzeRoutes from './routes/analyze';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS setup: allow origins from env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Apply CORS middleware
app.use(
  cors({ origin: allowedOrigins, credentials: true })
);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/figma', figmaRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Socket.IO setup
type CorsOptions = { origin: string[]; credentials: boolean };
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, credentials: true } as CorsOptions,
});

io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 3001;

// Start server (not on Vercel)
if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for serverless
export default app;
