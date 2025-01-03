import express from 'express';
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from '../controllers/albumController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const albumRoutes = express.Router();

albumRoutes.use(protect);

albumRoutes.get('/', restrictTo('Admin', 'Editor', 'Viewer'), getAlbums);
albumRoutes.get('/:id', restrictTo('Admin', 'Editor', 'Viewer'), getAlbumById);
albumRoutes.post('/add-album', restrictTo('Admin', 'Editor'), createAlbum);
albumRoutes.put('/:id', restrictTo('Admin', 'Editor'), updateAlbum);
albumRoutes.delete('/:id', restrictTo('Admin'), deleteAlbum);

export default albumRoutes;
