import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import artistRoutes from "./routes/artistRoutes.js"
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/artists', artistRoutes);
// Other routes will follow similarly...

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
