import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './db/conn';
import {app} from './app'
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();
connectDB();

const PORT = process.env.PORT || 4545;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:1818',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'JobLens API is running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

// Health check
app.get('/health',(req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


// test AI call
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

app.get('/AI', async(req, res) => {
    const result = await model.generateContent("Give name of 5 best cricketers");
    const response = result.response.text();
    console.log(response);
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`✅ Server is up and Running on port ${PORT}`);
  });