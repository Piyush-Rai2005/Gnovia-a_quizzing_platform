import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetAllAction } from "../store/question.reducer";
import { resetResultAction } from "../store/result.reducer";
import { usePublishResult } from "../hooks/setResult"; // Make sure path is correct
import { useParams } from 'react-router-dom';

const Result = () => {
  const dispatch = useDispatch();
  const { setId } = useParams(); // Get setId from URL parameters
  const queue = useSelector(state => state.questions.queue || []);
  const result = useSelector(state => state.result.result || []);
  const username = useSelector(state => state.result.username || "");
  // Calculate total points based on difficulty
  
  const difficultyPoints = {
    Easy: 10,
    Medium: 20,
    Hard: 40
  };
  
  const totalQuestions = queue.length;
  const totalPoints = queue.reduce((acc, q) => acc + (difficultyPoints[q.difficulty] || 0), 0);
  const attempts = result.filter(r => r !== undefined).length;
  
 const earnPoints = result.reduce((sum, userAnswer, index) => {
  const question = queue[index]; // Get the current question

  // Safety check in case the question doesn't exist
  if (!question) {
    return sum;
  }

  let isCorrect = false;

  // Check if the answer is correct
  if (question.options && question.options.length > 0) {
    // For multiple-choice questions, userAnswer is the index of the selected option
    const selectedOptionText = question.options[userAnswer];
    isCorrect = selectedOptionText === question.answer;
  } else {
    // For written-answer questions, userAnswer is a string
    isCorrect = String(userAnswer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
  }
  
  // If the answer is correct, add the points for that question's difficulty
  if (isCorrect) {
    return sum + (difficultyPoints[question.difficulty] || 0);
  }

  return sum; // Otherwise, return the sum unchanged
}, 0);
    
    const passed = earnPoints >= totalPoints / 2;
    console.log("Debugging usePublishResult call:");
    console.log("  Current username from Redux:", username);
    console.log("  Current result array from Redux:", result);
    console.log("  Is username falsy (!username)?", !username);
    console.log("  Is result falsy (!result)?", !result);
    console.log("  result.length:", result.length);
    // --- FIX STARTS HERE ---
    if (queue.length === 0) {
      return (
        <div className="container mx-auto">
          <h1 className="title text-light">Loading Results...</h1>
        </div>
      );
    }
    // Call usePublishResult directly at the top level of the component
    usePublishResult({
    result,
    username,
    attempts,
    points: earnPoints, // Pass earnPoints directly
    achieved: passed ? "Passed" : "Failed",
    setId: setId
  });
  // --- FIX ENDS HERE ---


  useEffect(() => {
    // This useEffect is fine for cleanup actions
    return () => {
      dispatch(resetAllAction());
      dispatch(resetResultAction());
    };
  }, [dispatch]);

  return (
    <div className="container mx-auto">
      <h1 className="title text-light">Quiz Application</h1>
      <div className="result flex flex-col items-center py-6">
        <div className="border-2 p-4 rounded-xl bg-gray-800 text-white space-y-2 text-lg w-[300px] sm:w-[400px] md:w-[500px]">
          <p><span className="font-medium">Username:</span> <span className="font-bold">{username}</span></p>
          <p><span className="font-medium">Total Quiz Points:</span> {totalPoints}</p>
          <p><span className="font-medium">Total Questions:</span> {totalQuestions}</p>
          <p><span className="font-medium">Total Attempts:</span> {attempts}</p>
          <p><span className="font-medium">Total Earn Points:</span> {earnPoints}</p>
          <p><span className="font-medium">Quiz Result:</span> <span className={`font-bold ${passed ? "text-green-500" : "text-red-500"}`}>{passed ? "Pass" : "Fail"}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Result;