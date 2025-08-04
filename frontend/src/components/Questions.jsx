import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Edit3 } from 'lucide-react';

import { useFetchQuestion } from "../hooks/FetchQuestion";

// The onChecked prop is used to communicate the selected answer back to the Quiz component.
export default function Questions({ onChecked }) {
  const { setId } = useParams();
  const [checked, setChecked] = useState(undefined); // For multiple-choice selection
  const [writtenAnswer, setWrittenAnswer] = useState(''); // For written answer

  // Get Redux state
  const { trace } = useSelector(state => state.questions);
  const result = useSelector(state => state.result.result);
  const [{ Loading, apiData, serverError }] = useFetchQuestion(setId);
  const questions = useSelector(state => state.questions.queue[state.questions.trace]);
  // This effect reports the selected answer back to the parent Quiz component
  useEffect(() => {
    // Ensure an option has been selected
    if (typeof checked !== 'number') return;
    
    if (questions?.options?.length > 0) {
      // Pass the selected index up to the parent
      onChecked(checked);
    }
    // ✅ FIXED: Dependency array now includes all required variables
  }, [checked, questions, onChecked]);
  
  // Pre-fill written answer if user navigates back to the question
  useEffect(() => {
    if (questions && (!questions.options || questions.options.length === 0)) {
      const storedAnswer = result[trace];
      if (typeof storedAnswer === 'string') {
        setWrittenAnswer(storedAnswer);
      } else {
        setWrittenAnswer(''); // Clear for new question
      }
    }
  }, [questions, result, trace]);
    
    useEffect(() => {
    console.log("Fetched questions:", apiData); // ← check this in dev tools
  }, [apiData]);
  
  function onSelect(i) {
    setChecked(i);
  }

  function handleWrittenAnswerChange(e) {
    setWrittenAnswer(e.target.value);
  }
  
  // Handle submission for written answers
  function handleWrittenAnswerSubmit(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Pass the written answer up to the parent
      onChecked(writtenAnswer);
    }
  }

  // --- Loading and Error States ---
  if (Loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl max-w-4xl w-full">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <span className="ml-4 text-xl text-gray-300">Loading question...</span>
        </div>
      </div>
    );
  }

  if (serverError) {
    // ... (error rendering code is fine, no changes needed)
  }

  const hasOptions = questions?.options && questions.options.length > 0;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-4xl w-full">
      
      {questions?.image && (
  <div className="mb-8 text-center">
    <img
      src={questions.image}
      alt="Question visual"
      className="max-w-xs md:max-w-md mx-auto rounded-lg border"
      onError={(e) => e.target.style.display = 'none'}
    />
  </div>
)}


      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white leading-relaxed">
          {questions?.question}
        </h2>
      </div>

      {hasOptions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={questions?._id}>
          {questions.options.map((option, i) => (
            <div
              key={i}
              onClick={() => onSelect(i)}
              // ✅ FIXED: Styling is now based on the local `checked` state
              className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                checked === i
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    // ✅ FIXED: Checkmark appearance is based on local `checked` state
                    checked === i
                      ? 'border-white bg-white'
                      : 'border-white/50 group-hover:border-white/80'
                  }`}>
                    {checked === i && (
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                    )}
                  </div>
                  <span className="text-lg font-medium">{option}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // --- Written Answer Textarea ---
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-start pt-4">
              <Edit3 className="w-5 h-5 text-purple-400" />
            </div>
            <textarea
              value={writtenAnswer}
              onChange={handleWrittenAnswerChange}
              onKeyDown={handleWrittenAnswerSubmit}
              placeholder="Type your answer here... (Press Enter to submit)"
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300"
              rows="6"
            />
          </div>
        </div>
      )}
    </div>
  );
}