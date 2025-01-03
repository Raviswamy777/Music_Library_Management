import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middlewares/authMiddleware.js';

const favoriteRoutes = express.Router();

favoriteRoutes.use(protect);

favoriteRoutes.get('/', getFavorites);
favoriteRoutes.post('/add-favorite', addFavorite);
favoriteRoutes.delete('/remove-favorite/:favorite_id', removeFavorite);

export default favoriteRoutes;
