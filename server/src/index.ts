// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http'; // Import Node's built-in HTTP module
import { Server } from 'socket.io'; // Import Server from socket.io
import { initializeSocketIO } from '../src/socket';

import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import sessionRoutes from './routes/sessionRoutes';
import messageRoutes from './routes/messageRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

// Initialize Socket.IO and pass the server instance
const io = new Server(server, {
    cors: corsOptions
});

// Set up our socket.io event handlers
initializeSocketIO(io);

// Middleware to make io accessible in controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Existing Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// We need to extend the Express Request type to include our 'io' property
declare global {
    namespace Express {
        export interface Request {
            io: Server;
        }
    }
}
