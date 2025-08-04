import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchQuizSets = async () => {
      try {
        const res = await axios.get(`${url}/api/quiz-set/quiz-sets`);
        if (res.data.success) {
          setQuizSets(res.data.quizSets);
        } else {
          console.error("Failed to fetch quiz sets:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching quiz sets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizSets();
  }, []);

  const handleStartQuiz = (quiz) => {
    console.log("Starting quiz with this object:", quiz)
    if (quiz.quizType === 'Competitive') {
      navigate(`/socket/${quiz.setId}`);
    } else {
      navigate(`/quiz/${quiz.setId}`);
    }
  };

  if (loading) return <div className="text-center p-6">Loading quiz sets...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Available Quizzes</h1>

      {quizSets.length === 0 ? (
        <p className="text-center text-gray-600">No quizzes available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizSets.map((quiz) => (
            <div
              key={quiz.setId}
              className="bg-white border rounded-2xl shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Type:</strong> {quiz.quizType}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Time Limit:</strong> {quiz.timeLimit} min
                </p>
                {quiz.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">{quiz.description}</p>
                )}
              </div>

              <button
                onClick={() => handleStartQuiz(quiz)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
