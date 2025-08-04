import { QuizSet } from '../models/adminSchema.js';
import { nanoid } from 'nanoid';
import cloudinary from '../utils/cloudinary.js';

/**
 * Create a new quiz set with optional image
 * POST /api/admin/quiz-sets
 */
export async function createQuizSet(req, res) {
  try {
    const { title, description, category, difficulty, timeLimit, questions, adminId, adminName, quizType } = req.body;

    if (!title || !adminId || !adminName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const setId = `quiz-${nanoid(8)}`;

    const difficultyPoints = {
      Easy: 10,
      Medium: 20,
      Hard: 40
    };

    const totalPoints = questions.reduce((acc, q) => {
      return acc + (difficultyPoints[q.difficulty] || 0);
    }, 0);

    // Handle image upload if present
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'quiz-images',
      });
      imageUrl = result.secure_url;
    }

    const newQuiz = new QuizSet({
      setId,
      title,
      description,
      category,
      difficulty,
      timeLimit,
      quizType,
      questions,
      adminId,
      adminName,
      imageUrl,
      totalQuestions: questions.length,
      totalPoints,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newQuiz.save();

    res.status(201).json({ msg: 'Quiz set created successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Delete a quiz set
 * DELETE /api/admin/quiz-sets/:id
 */
export async function deleteQuizSet(req, res) {
  try {
    const { id } = req.params;
    const deleted = await QuizSet.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Quiz set not found' });
    res.json({ msg: 'Quiz set deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Add a new question to an existing quiz set
 * POST /api/admin/quiz-sets/:id/questions
 */
export async function addQuestionToQuiz(req, res) {
  try {
    const { id } = req.params;
    const question = JSON.parse(req.body.question); // frontend must send as JSON string

    const quiz = await QuizSet.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz set not found' });

    // Handle image upload for question (optional)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'question-images',
      });
      question.imageUrl = result.secure_url;
    }

    quiz.questions.push(question);
    quiz.totalQuestions = quiz.questions.length;
    quiz.updatedAt = Date.now();
    await quiz.save();

    res.json({ msg: 'Question added successfully', quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Delete a question from a quiz set by index
 * DELETE /api/admin/quiz-sets/:id/questions/:qid
 */
export async function deleteQuestionFromQuiz(req, res) {
  try {
    const { id, qid } = req.params;

    const quiz = await QuizSet.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz set not found' });

    if (qid < 0 || qid >= quiz.questions.length) {
      return res.status(400).json({ error: 'Invalid question index' });
    }

    quiz.questions.splice(qid, 1);
    quiz.totalQuestions = quiz.questions.length;
    quiz.updatedAt = Date.now();
    await quiz.save();

    res.json({ msg: 'Question removed successfully', quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get all quiz sets
 * GET /api/admin/quiz-sets
 */
export async function getAllQuizSets(req, res) {
  try {
    const quizzes = await QuizSet.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get a single quiz set by ID
 * GET /api/admin/quiz-sets/:id
 */
export async function getQuizSetById(req, res) {
  try {
    const { id } = req.params;
    const quiz = await QuizSet.findById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz set not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
