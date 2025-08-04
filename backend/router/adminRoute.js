""// adminRoute.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin, QuizSet } from '../models/adminSchema.js';
import { verifyAdmin } from '../middleware/auth.js';
import upload from '../middleware/multer.js'
import Questions from '../models/questionSchema.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    const expectedKey = process.env.ADMIN_SECRET_KEY || 'default-admin-key';
    if (adminKey !== expectedKey) {
      return res.status(403).json({ success: false, message: 'Invalid admin secret key' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    if (!admin.isActive) {
      return res.status(400).json({ success: false, message: 'Admin account is inactive' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalQuizSets = await QuizSet.countDocuments({ adminId: req.admin._id });
    const activeQuizSets = await QuizSet.countDocuments({ adminId: req.admin._id, isActive: true });

    const recentQuizSets = await QuizSet.find({ adminId: req.admin._id })
      .select('setId title totalQuestions createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalQuizSets,
        activeQuizSets,
        inactiveQuizSets: totalQuizSets - activeQuizSets
      },
      recentQuizSets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const quizSets = await QuizSet.find({ adminId: req.admin._id });
    const stats = {
      totalQuizSets: quizSets.length,
      totalQuestions: quizSets.reduce((sum, q) => sum + q.totalQuestions, 0),
      activeQuizSets: quizSets.filter(q => q.isActive).length
    };

    res.json({
      success: true,
      stats,
      quizSets
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats'
    });
  }
});

// ✅ Create question with optional image
router.post('/question', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { question, answer, difficulty, questionType, options } = req.body;

    const newQuestion = new Questions({
      question,
      answer,
      difficulty,
      questionType,
      options: questionType === 'multiple-choice' && options ? options.split(',') : [],
      image: req.file ? req.file.path : null
    });

    await newQuestion.save();
    res.status(201).json({ success: true, question: newQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as adminRoutes };
