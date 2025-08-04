import mongoose from "mongoose";
const {Schema} = mongoose;

/** question model */
const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    points:{
        type: Number,
        default: 10
    },
    questionType: {
        type: String,
        enum: ['text', 'multiple-choice', 'true-false'],
        default: 'text'
    },
    options: [{
        type: String,
        trim: true
    }], // For multiple choice questions
     image: {
        type: String, // This will hold the Cloudinary URL
        default: null // Optional image
    }
});
questionSchema.pre('save', function(next) {
    if (this.difficulty === 'Easy') {
        this.points = 10;
    } else if (this.difficulty === 'Medium') {
        this.points = 20;
    } else if (this.difficulty === 'Hard') {
        this.points = 40;
    }
    next();
});
export { questionSchema };

// ✅ Default export (for separate model usage)
export default mongoose.model('Questions', questionSchema);