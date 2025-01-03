import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';


async function signup(req, res) {
  try {
    var { email, password, role } = req.body;
    
    if (!email ) {
      return res.status(400).json({ status: 400, data: null, message: 'Bad Request, Reason: Missing required field Email', error: null });
    }
    if (!password) {
      return res.status(400).json({ status: 400, data: null, message: 'Bad Request, Reason: Missing required field Password', error: null });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: 409, data: null, message: 'Email already exists', error: null });
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    var userRole = (await User.countDocuments()) === 0 ? 'Admin' : role ? role : 'Viewer';
    
    const user = new User({ email, password, role:userRole });
    await user.save();

    res.status(201).json({ status: 201, data: null, message: 'User created successfully', error: null });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

async function login(req, res){
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ status: 400, data: null, message: 'Missing required fields', error: null });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 404, data: null, message: 'User not found', error: null });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ status: 400, data: null, message: 'Invalid credentials', error: null });
    // }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ status: 200, data: { token }, message: 'Login successful', error: null });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

function logout(req, res) {
  res.status(200).json({ status: 200, data: null, message: 'User logged out successfully', error: null });
};

export {signup, login, logout}