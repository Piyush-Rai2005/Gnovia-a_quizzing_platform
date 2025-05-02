import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setUserId } from '../store/result.reducer';
// import '../styles/index.css';

export default function Main() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  function startQuiz(){
    if(inputRef.current?.value){
      dispatch(setUserId(inputRef.current?.value))

    }

  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-white border-2 border-green-400 p-2 inline-block mb-6">
        Quiz Application
      </h1>

      <ol className="text-gray-300 text-lg space-y-2 mb-6 text-left max-w-md">
        <li>1. You will be asked 10 questions one after the other.</li>
        <li>2. 10 points is awarded for the correct answer.</li>
        <li>3. Each question has three options. You can choose only one option.</li>
        <li>4. You can review and change answers before the quiz finishes.</li>
        <li>5. The result will be declared at the end of the quiz.</li>
      </ol>

      <form id="form" className="w-full max-w-md mb-6">
        <input
          ref={inputRef}
          type="text"
          placeholder="Username*"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </form>

      <div className="start">
        <Link
          className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-600 transition duration-200"
          to={'quiz'} onClick={startQuiz}
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
}
