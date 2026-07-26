// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { initDb } from './config/db.js';
// We will create these routes in the next steps
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { MessageController } from './controllers/messageController.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Middleware
// backend/server.js
// backend/server.js
// backend/server.js
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting to protect endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// 2. Utility Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Serve static frontend assets if you want Express to handle them
app.use(express.static('frontend'));

// 3. API Routes
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/messages', messageRoutes);      // Administrative view/delete 
app.use('/api/contact', MessageController.create); // Public inbound pipeline submission

// Serve static client layout pages beautifully
app.get('/login', (req, res) => res.sendFile(path.resolve('frontend/public/login.html')));
app.get('/admin', (req, res) => res.sendFile(path.resolve('frontend/public/admin.html')));
app.get('*', (req, res) => res.sendFile(path.resolve('frontend/public/index.html')));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// 4. Initialize DB and Start Server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();