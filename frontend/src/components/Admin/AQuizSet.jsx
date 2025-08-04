import { Trash2 } from 'lucide-react';

const QuizSets = ({ quizSets, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Your Quiz Sets</h2>
      </div>
      <div className="p-6">
        {quizSets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No quiz sets created yet.</p>
        ) : (
          <div className="space-y-4">
            {quizSets.map((quiz) => (
              <div key={quiz._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{quiz.title}</h3>
                    <p className="text-gray-600 text-sm">{quiz.description}</p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                      <span>ID: {quiz.setId}</span>
                      <span>Questions: {quiz.totalQuestions}</span>
                      <span>Category: {quiz.category}</span>
                      <span>Difficulty: {quiz.difficulty}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(quiz._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSets;
