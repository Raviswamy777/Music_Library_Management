import User from '../models/User.js';
import bcrypt from "bcryptjs"
async function getUsers(req, res) {
  try {
    const { limit = 5, offset = 0, role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter)
      .select('-password')
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json({ status: 200, data: users, message: 'Users retrieved successfully', error: null });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function addUser(req, res){
  try {
    const { email, password, role } = req.body;
    if (!email ) {
      return res.status(400).json({ status: 400, data: null, message: 'Bad Request, Reason: Missing required field Email', error: null });
    }
    if (!password) {
      return res.status(400).json({ status: 400, data: null, message: 'Bad Request, Reason: Missing required field Password', error: null });
    }
    if (!role) {
      return res.status(400).json({ status: 400, data: null, message: 'Bad Request, Reason: Missing required field Role', error: null });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: 409, data: null, message: 'Email already exists', error: null });
    }

    if (role === 'Admin') {
      return res.status(403).json({ status: 403, data: null, message: 'Cannot assign Admin role', error: null });
    }

    const user = new User({ email, password, role });
    await user.save();

    res.status(201).json({ status: 201, data: null, message: 'User created successfully', error: null });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

async function updatePassword(req, res){
  try {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
      return res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: null });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 404, data: null, message: 'User not found', error: null });
    }
    const isMatch = await bcrypt.compare(old_password, user.password);

    if (!isMatch) {
      return res.status(400).json({ status: 400, data: null, message: 'Old password is incorrect', error: null });
    }

    user.password = new_password;
    await user.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

async function deleteUser(req, res){
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ status: 404, data: null, message: 'Bad Request, Reason: User_Id is required', error: null });
    }

    const user = await User.findByIdAndDelete(user_id);

    if (!user) {
      return res.status(404).json({ status: 404, data: null, message: 'User not found', error: null });
    }


    res.status(200).json({ status: 200, data: null, message: 'User deleted successfully', error: null });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

export {getUsers, addUser, updatePassword, deleteUser};