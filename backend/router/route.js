// route.js
import { adminRoutes } from './adminRoute.js'
import { quizSetRoutes } from './quizSetRoute.js';
import  userRouter  from './userRoute.js';
import { resultRoutes } from './resultRoute.js';
import express from 'express';

const router = express.Router();

router.use('/admin', adminRoutes);        // all /api/admin/*
router.use('/quiz-set', quizSetRoutes);   // all /api/admin/quiz-set/*
router.use('/result', resultRoutes);      // all /api/admin/result/*
router.use(userRouter);          // all /api/*


export default router;
// Export the router to be used in the main server file