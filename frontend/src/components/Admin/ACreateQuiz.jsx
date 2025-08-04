import { useState } from 'react';
import axios from 'axios';

const CreateQuiz = ({ setCurrentView, loading, setLoading, onQuizSetCreated }) => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'General',
    difficulty: 'Medium',
    timeLimit: 30,
    quizType: 'Prelims',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answer: '',
    questionType: 'text',
    options: [],
    points: 1,
    image: ''
  });

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleRemoveOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.answer) {
      alert("Please fill question text and answer");
      return;
    }

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, currentQuestion]
    });

    setCurrentQuestion({
      question: '',
      answer: '',
      questionType: 'text',
      options: [],
      points: 1,
      image: ''
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  // Vite

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setCurrentQuestion((prev) => ({ ...prev, image: file }));
  } catch (err) {
    console.error("Image upload failed:", err);
    alert("Image upload failed. Try again.");
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();

  if (quizData.questions.length === 0) {
    alert("Please add at least one question");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();

    // Append quiz meta data
    formData.append("title", quizData.title);
    formData.append("description", quizData.description);
    formData.append("category", quizData.category);
    formData.append("difficulty", quizData.difficulty);
    formData.append("timeLimit", quizData.timeLimit);
    formData.append("quizType", quizData.quizType);

    const images = [];
    const finalQuestions = quizData.questions.map((q) => {
      if (q.image instanceof File) {
        images.push(q.image);
        return { ...q, image: null }; // will be filled by backend
      } else {
        return { ...q };
      }
    });

    formData.append("questions", JSON.stringify(finalQuestions));
    images.forEach((file) => formData.append("images", file)); // key: 'images' matches multer.array('images')

    await axios.post(
      `${BACKEND_URL}/api/quiz-set`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Quiz set created successfully!");
    if (onQuizSetCreated) onQuizSetCreated();
    if (setCurrentView) setCurrentView("list");

  } catch (err) {
    console.error("Quiz creation failed:", err);
    alert(err.response?.data?.message || "Failed to create quiz");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create New Quiz Set</h2>
        <p className="text-blue-100">Design engaging quizzes with multiple question types</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Quiz Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Quiz Title"
                value={quizData.title}
                onChange={handleQuizChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={quizData.description}
                onChange={handleQuizChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={quizData.category}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <select
                  name="difficulty"
                  value={quizData.difficulty}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <input
                  type="number"
                  name="timeLimit"
                  value={quizData.timeLimit}
                  onChange={handleQuizChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <select
                name="quizType"
                value={quizData.quizType}
                onChange={handleQuizChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="Prelims">Prelims</option>
                <option value="Competitive-round">Competitive Round</option>
              </select>
            </div>
          </div>

          {/* Question form */}
          <div className="bg-purple-50 rounded-lg p-6">
            <textarea
              name="question"
              placeholder="Question text"
              value={currentQuestion.question}
              onChange={handleQuestionChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none mb-2"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="questionType"
                value={currentQuestion.questionType}
                onChange={handleQuestionChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="text">Text Answer</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True / False</option>
              </select>
              <input
                type="number"
                name="points"
                value={currentQuestion.points}
                min="1"
                onChange={handleQuestionChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {currentQuestion.questionType === 'multiple-choice' && (
              <div className="mt-2">
                {currentQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button type="button" onClick={() => handleRemoveOption(idx)} className="ml-2 text-red-500">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddOption} className="text-blue-500 mt-1">Add Option</button>
              </div>
            )}

            <input
              type="text"
              name="answer"
              placeholder="Correct Answer"
              value={currentQuestion.answer}
              onChange={handleQuestionChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
            />

            {/* Image Upload */}
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block mb-2"
              />
              <input
                type="text"
                name="image"
                placeholder="Or paste image URL"
                value={currentQuestion.image}
                onChange={handleQuestionChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              {currentQuestion.image && (
  <div className="mt-2">
    <img
      src={
        currentQuestion.image instanceof File
          ? URL.createObjectURL(currentQuestion.image)
          : currentQuestion.image
      }
      alt="Preview"
      className="w-32 h-32 object-cover border rounded-lg"
    />
    <button
      type="button"
      onClick={() => setCurrentQuestion({ ...currentQuestion, image: '' })}
      className="block text-red-500 mt-1"
    >
      Remove Image
    </button>
  </div>
)}
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-purple-600 text-white mt-4 px-4 py-2 rounded-lg"
            >
              Add Question to Quiz
            </button>
          </div>

          {/* Question list */}
          {quizData.questions.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Questions Added</h3>
              {quizData.questions.map((q, idx) => (
                <div key={idx} className="bg-white rounded-lg border p-3 mb-2">
                  <p className="font-medium">{idx + 1}. {q.question}</p>
                  <p className="text-sm">{q.questionType}, {q.points} points</p>
                  <button type="button" onClick={() => removeQuestion(idx)} className="text-red-500 text-sm">Remove</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setCurrentView && setCurrentView('list')}
              className="px-6 py-3 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || quizData.questions.length === 0}
              className={`px-8 py-3 rounded-lg ${
                loading || quizData.questions.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white'
              }`}
            >
              {loading ? 'Creating...' : 'Create Quiz Set'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
