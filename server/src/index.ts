import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes'; // Import the new profile routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api/profiles', profileRoutes); // Use the profile routes with a '/profiles' prefix

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});