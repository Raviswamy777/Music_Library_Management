import express from 'express';
import {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} from '../controllers/artistController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const artistRoutes = express.Router();

artistRoutes.use(protect);

artistRoutes.get('/', restrictTo('Admin', 'Editor', 'Viewer'), getArtists);
artistRoutes.get('/:artist_id', restrictTo('Admin', 'Editor', 'Viewer'), getArtistById);
artistRoutes.post('/add-artist', restrictTo('Admin', 'Editor'), createArtist);
artistRoutes.put('/:artist_id', restrictTo('Admin', 'Editor'), updateArtist);
artistRoutes.delete('/:artist_id', restrictTo('Admin'), deleteArtist);

export default artistRoutes;

