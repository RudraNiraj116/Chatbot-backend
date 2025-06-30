// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import geminiRoutes from './routes/gemini.js'; // <-- NEW

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "https://chatbot-frontend-plum.vercel.app",
  "https://chatbot-frontend-qx7v1vpfx-nirajs-projects-69bf51b2.vercel.app",
  "https://chatbot-frontend-nirajs-projects.vercel.app",
  "https://chatbot-frontend-nirajs-projects.vercel.app",
  "https://chatbot-frontend-nirajs-projects.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gemini', geminiRoutes); // <-- NEW


// ✅ Add this here to prevent favicon 404s for vercel
app.get('/favicon.ico', (req, res) => res.sendStatus(204));



// ✅ Optional: root route. default route (/) to your Express app . This will prevent 404 errors when Vercel or a browser tries to access /

app.get('/', (req, res) => {
  res.send('Chatbot backend is running 🚀');
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
