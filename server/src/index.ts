import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configure CORS to allow credentials
const corsOptions = {
    origin: 'http://localhost:3000', // Your client's URL
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(cookieParser()); // Add cookie parser middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
