// quizSetRoute.js
import { Router } from 'express';
import { QuizSet } from '../models/adminSchema.js';
import { verifyAdmin } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid'; // install this if not already: npm i uuid
import upload from '../middleware/multer.js';           // multer middleware
import  cloudinary  from '../utils/cloudinary.js';    // cloudinary uploader


const router = Router();

router.route('/')
  .get(verifyAdmin, async (req, res) => {
    try {
      const quizSets = await QuizSet.find({ adminId: req.admin._id })
        .select('setId title description category difficulty totalQuestions isActive createdAt')
        .sort({ createdAt: -1 });
      res.json({ success: true, message: 'Quiz sets retrieved', quizSets });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
  
 router.post('/', verifyAdmin, upload.array('images'), async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit } = req.body;
    let questions = JSON.parse(req.body.questions); // frontend sends questions as JSON string

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Questions array cannot be empty' });
    }

    const files = req.files || [];
    const uploadedImageUrls = [];

    // Upload each image file (optional per question)
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'quiz-images',
      });
      uploadedImageUrls.push(result.secure_url);
    }

    // Attach image URLs to respective questions (if provided)
    questions = questions.map((q, index) => {
      if (uploadedImageUrls[index]) {
        return { ...q, image: uploadedImageUrls[index] };
      }
      return q;
    });

    const difficultyPoints = {
      Easy: 10,
      Medium: 20,
      Hard: 40,
    };

    const totalPoints = questions.reduce((sum, q) => {
      return sum + (difficultyPoints[q.difficulty] || 0);
    }, 0);

    const quizSet = new QuizSet({
      setId: uuidv4(),
      title,
      description,
      adminId: req.admin._id,
      adminName: req.admin.name,
      questions,
      totalQuestions: questions.length,
      totalPoints,
      category: category || 'General',
      difficulty: difficulty || 'Medium',
      timeLimit: timeLimit || 30,
      isActive: true,
    });

    await quizSet.save();

    res.status(201).json({ success: true, message: 'Quiz created', quizSet });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.route('/:setId')
  .delete(verifyAdmin, async (req, res) => {
    try {
      const deleted = await QuizSet.findOneAndDelete({ setId: req.params.setId, adminId: req.admin._id });
      if (!deleted) return res.status(404).json({ success: false, message: 'Quiz not found' });
      res.json({ success: true, message: 'Quiz deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

router.get('/quiz-sets', async (req, res) => {
  try {
    const quizSets = await QuizSet.find().select('setId title quizType');
    res.status(200).json({ success: true, quizSets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /questions/:setId
router.route('/questions/:setId').get(async (req, res) => {
  try {
    const { setId } = req.params;

    const quizSet = await QuizSet.findOne({ setId });

    if (!quizSet) {
      return res.status(404).json({ success: false, message: 'Quiz set not found' });
    }

    const { questions, quizType, timeLimit, title } = quizSet;

    res.status(200).json({
      success: true,
      quizTitle: title,
      quizType,
      timeLimit,
      questions
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export { router as quizSetRoutes };
