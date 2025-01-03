import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ status: 401, data: null, message: 'Unauthorized access', error: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ status: 401, data: null, message: 'Unauthorized access', error: null });
    }

    next();
  } catch (error) {
    res.status(401).json({ status: 401, data: null, message: 'Invalid token', error: error.message });
  }
};

export const restrictTo = (...roles) => {   
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 401, data: null, message: 'Unauthorized access', error: null});
    }
    next();
  };
};
