import Admin from '../models/adminSchema.js'; // Make sure this model exists
import QuizSet from '../models/adminSchema.js'; // Adjust based on your actual schema
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET=process.env.JWT_SECRET;
 // Use env variable in production

// Register new admin
export async function registerAdmin(req, res) {
  const { username, password } = req.body;

  try {
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashed });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Login admin
export async function loginAdmin(req, res) {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create new quiz set
export async function createQuizSet(req, res) {
  try {
    const { title, description, category, difficulty } = req.body;
    const quizSet = new QuizSet({ title, description, category, difficulty, questions: [] });
    await quizSet.save();

    res.status(201).json({ message: 'Quiz created', quizSet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
