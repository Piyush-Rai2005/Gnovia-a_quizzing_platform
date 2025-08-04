import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';
import { Admin } from '../models/adminSchema.js';

const verifyUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers.token;
  const token = authHeader?.replace('Bearer ', '').trim();

  if (!token) return res.status(401).json({ success: false, message: "User not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Invalid user" });

    req.user = user;
    next();
  } catch (error) {
    console.error("User Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers.token;
  const token = authHeader?.replace('Bearer ', '').trim();


  if (!token) return res.status(401).json({ success: false, message: "Admin not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Invalid or inactive admin" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export { verifyUser, verifyAdmin };
