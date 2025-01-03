import express from 'express';
import {
  getTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
} from '../controllers/trackController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const trackRoutes = express.Router();

trackRoutes.use(protect);

trackRoutes.get('/', restrictTo('Admin', 'Editor', 'Viewer'), getTracks);
trackRoutes.get('/:track_id', restrictTo('Admin', 'Editor', 'Viewer'), getTrackById);
trackRoutes.post('/add-track', restrictTo('Admin', 'Editor'), createTrack);
trackRoutes.put('/:track_id', restrictTo('Admin', 'Editor'), updateTrack);
trackRoutes.delete('/:track_id', restrictTo('Admin'), deleteTrack);

export default trackRoutes;
