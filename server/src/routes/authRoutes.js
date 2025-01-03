import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/logout', logout);

export default authRoutes;
