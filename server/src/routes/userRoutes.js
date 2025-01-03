import express from 'express'
import { getUsers, addUser, updatePassword, deleteUser } from '../controllers/userController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js'

const userRoutes = express.Router();

userRoutes.use(protect); 
userRoutes.get('/', restrictTo('Admin'), getUsers);
userRoutes.post('/add-user', restrictTo('Admin'), addUser);
userRoutes.put('/update-password', updatePassword);
userRoutes.delete('/:user_id', restrictTo('Admin'), deleteUser);

export default userRoutes;
