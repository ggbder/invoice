import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ 
  origin: 'http://localhost:3000', // Allow frontend origin
  credentials: true,
}));
app.use(bodyParser.json());
app.use(morgan('dev')); // Logging in development

// Rate limiting for public routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use('/api', limiter);

// Database connection check
prisma.$connect()
  .then(() => console.log('PostgreSQL database connected'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit on failure
  });

// Routes
import invoicesRouter from './routes/invoices.js';
import usersRouter from './routes/users.js'; // Add this if you have user routes
import authRouter from './routes/auth.js'; // Add this for authentication

app.use('/api/invoices', invoicesRouter);
app.use('/api/users', usersRouter); // Example user routes
app.use('/api/auth', authRouter); // Example auth routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', database: 'CONNECTED' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});