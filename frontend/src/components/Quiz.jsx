import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Clock } from 'lucide-react';
import Questions from './Questions';
import { MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestion';
import { PushAnswer } from '../hooks/setResult';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetchQuestion } from '../hooks/FetchQuestion';
// Import redux store
import { useDispatch, useSelector } from 'react-redux';

export default function Quiz() {
    const { setId } = useParams(); // ✅ This gets the setId from the URL
  const [{ Loading, apiData, serverError }] = useFetchQuestion(setId); // Pass it here
  const [check, setChecked] = useState(undefined);
  
  const result = useSelector(state => state.result.result);
  const { queue, trace } = useSelector(state => state.questions);
  const dispatch = useDispatch();

function onNext() {
  // Prevent progressing without selection
  if (check === undefined) {
    alert("Please select an option before proceeding.");
    return;
  }

  if (result.length === trace) {
    dispatch(PushAnswer(check));
  }

  if (trace === queue.length - 1) {
    navigate(`/result/${setId}`);
  } else {
    dispatch(MoveNextQuestion());
  }

  setChecked(undefined);
}


  function onPrev() {
    if (trace > 0) {
      console.log('Prev');
      dispatch(MovePrevQuestion());
    }
  }

  function onChecked(check) {
    console.log(check);
    setChecked(check);
  }

  // On finishing the exam go to result page
if (result.length && result.length === queue.length) {
  return <Navigate to={`/result/${setId}`} replace={true} />;
}

  const progress = queue.length > 0 ? ((trace + 1) / queue.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Quiz Challenge</h1>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Question {trace + 1} of {queue.length}</span>
              <span className="text-sm text-gray-300">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Component */}
        <div className="flex justify-center mb-8">
          <Questions onChecked={onChecked} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          {trace > 0 ? (
            <button
              onClick={onPrev}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-4 text-gray-300">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Take your time</span>
          </div>

          <button
            type='button'
            onClick={onNext}
            disabled={check === undefined}
            className={`flex items-center space-x-2 font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform ${
              check === undefined
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105"
            }`}
          >
          <span>{trace === queue.length - 1 ? 'Finish' : 'Next'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
        </div>

        {/* Question Counter */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
            <div className="flex space-x-1">
              {Array.from({ length: queue.length }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < trace
                      ? 'bg-green-400'
                      : i === trace
                      ? 'bg-purple-400'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}