import {questionSchema} from './questionSchema.js';
import mongoose from "mongoose";
const { Schema } = mongoose;

/** Admin model */
const adminModel = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin', 'super-admin']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
/** Quiz Set model */
const quizSetModel = new Schema({
    setId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    adminName: {
        type: String,
        required: true
    },
    questions: [questionSchema],
    category: {
        type: String,
        default: 'General'
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    timeLimit: {
        type: Number, // in minutes
        default: 30
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    // type of quiz, can be MCQ or Descriptive
    quizType:{
        type: String,
        enum: ['Competitive', 'Prelims'],
        default: 'Prelims'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-increment setId and update totalQuestions
quizSetModel.pre('save', async function(next) {
    if (this.isNew) {
        // Generate unique setId
        const count = await mongoose.model('QuizSet').countDocuments();
        this.setId = `quiz-set-${count + 1}`;
    }
    
    // Update totalQuestions count
    this.totalQuestions = this.questions.length;
    this.updatedAt = Date.now();
    next();
});


export const Admin = mongoose.model('Admin', adminModel);
export const QuizSet = mongoose.model('QuizSet', quizSetModel);