// import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import ResultTable from './ResultTable';
import { useDispatch, useSelector } from 'react-redux';
import { attempts_Number, earnPoints_Number, flagResult } from '../helper/helper';


import { resetAllAction } from '../store/question.reducer';
import { resetResultAction } from '../store/result.reducer';
import { usePublishResult } from '../hooks/setResult';


export default function Result() {

  const dispatch=useDispatch();
  const { questions: {queue, answers}, result : {result, userId}}= useSelector(state=> state)

// useEffect(()=>{
//   console.log(earnPoints)
// })

const totalPoints = queue.length*10;
const attempts=attempts_Number(result);
const earnPoints= earnPoints_Number(result,answers,10);
const flag= flagResult(totalPoints,earnPoints);

/** store user result */
usePublishResult({
  result, 
  username: userId, 
  attempts, 
  points: earnPoints, 
  achieved: flag ? "Passed" : "Fail" });
// console.log({result,username: usreId, attempts, points: earnPoints, achieved: flag ? "Passed" : "Failed"})

  function onRestart() {
    dispatch(resetAllAction());
    dispatch(resetResultAction()); 

  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4 py-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-white border-2 border-green-400 p-4 inline-block mb-10 rounded-md shadow-lg">
        Quiz Application
      </h1>

      {/* Quiz Result Details */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-medium">Username:</span>
          <span className="font-bold">{userId}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-lg font-medium">Total Quiz Points:</span>
          <span className="font-bold">{totalPoints || 0}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-lg font-medium">Total Questions:</span>
          <span className="font-bold">{queue.length || 0}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-lg font-medium">Total Attempts:</span>
          <span className="font-bold">{attempts || 0}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-lg font-medium">Total Earn Points:</span>
          <span className="font-bold">{earnPoints || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg font-medium">Quiz Result:</span>
          <span style={{color :`${flag ?"2aff95":"ff2a66"}`}} className="font-bold text-green-400">{flag ? "Passed" : "Fail"}</span>
        </div>
      </div>

      {/* Restart Button */}
      <div className="mt-6">
        <Link
          to="/"
          onClick={onRestart}
          className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-md hover:bg-yellow-600 transition duration-200 shadow-md"
        >
          Restart
        </Link>
      </div>

      {/* Result Table */}
      <div className="mt-8 w-full max-w-2xl">
        <ResultTable />
      </div>
    </div>
  );
}
