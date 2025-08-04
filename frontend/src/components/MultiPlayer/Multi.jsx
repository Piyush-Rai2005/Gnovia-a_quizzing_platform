import React, { useState, useEffect, use } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Trophy, Zap, ArrowRight, Crown, Target, AlertCircle } from 'lucide-react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
// Initialize socket connection outside the component
const socket = io(import.meta.env.VITE_BACKEND_URL); // Your server URL

function QuizClash() {
  const navigate = useNavigate();
  const { setId } = useParams();
  
  // State for UI display
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [scores, setScores] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [winner, setWinner] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [isLocked, setIsLocked] = useState(false); // For when a player answers wrong
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Join room on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('username') || 'Player';
    setName(storedName);
    
    // Send 'quizSetId' which the server needs to fetch questions
    socket.emit('joinRoom', { name: storedName, room: setId, quizSetId: setId });

    // --- Listen for Server Events ---

    socket.on('message', (message) => {
      console.log(message); // "Player has joined", etc.
      setFeedback(message);
    });
    
    socket.on('updatePlayers', (playerList) => {
      setPlayers(playerList);
      setLoading(false);
    });

    // Handles the new question data from the server
    socket.on('newQuestion', (data) => {
      setCurrentQuestion(data);
      setSeconds(data.timer || 30);
      setIsLocked(false);
      setIsQuestionActive(true);
      setAnswered(false);
      setSelectedAnswerIndex(null);
      setFeedback(''); // Clear previous feedback
      setGameStarted(true);
      setLoading(false);
    });

    // Handles the detailed result after an answer or timeout
    socket.on('answerResult', (data) => {
    setIsQuestionActive(false); 
    setFeedback(`${data.playerName} answered!`);
    setScores(data.scores); // Add this line to update scores live
    });
    
    socket.on('lockedOut', (data) => {
      setIsLocked(true); // Lock controls for this specific player
      setFeedback(data.message);
    });

    // Handles the final game over state
    socket.on('gameOver', (results) => {
      setWinner(results.winner);
      setScores(results.scores);
      setIsQuestionActive(false);
    });
    
    socket.on('error', (errorMessage) => {
      console.error("Server Error:", errorMessage);
      setFeedback(errorMessage);
      setServerError(errorMessage);
      setLoading(false);
    });

    // Complete cleanup of all socket listeners
    return () => {
      socket.off('message');
      socket.off('updatePlayers');
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('lockedOut');
      socket.off('gameOver');
      socket.off('error');
    };
  }, [setId]);


  
  // Client-side timer
  useEffect(() => {
    if (!isQuestionActive) return;
    
    const timer = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [seconds, isQuestionActive]);
  
  // Handle submitting an answer
  const handleAnswer = (index) => {
    // A player can only answer if the question is active and they aren't locked out
    if (isQuestionActive && !isLocked && !answered) {
      setSelectedAnswerIndex(index);
      setAnswered(true);
      // Send the room ID with the correct property name
      socket.emit('submitAnswer', { room: setId, answerIndex: index });
    }
  };
  
  // handle the logic when user manually leaves the game
  const leaveGame = () => {
    if (socket) {
      console.log("Emitting leaveGame event");
      socket.emit("leaveGame");
      socket.disconnect();
    }
    navigate("/dashboard"); // or homepage
  };
  
  
  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (seconds > 20) return 'text-green-400';
    if (seconds > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

// disconnect the user on page closing but not on tab switching
  useEffect(() => {
  const handleUnload = () => {
    if (socket && socket.connected) {
      socket.emit("leaveGame");
    }
  };

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, []);

  // Winner screen
  if (winner) {
    return (

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Winner!</h1>
          <p className="text-xl text-gray-300 mb-6">{winner.name} takes the crown!</p>
          
          {/* Final Scores */}
          {scores.length > 0 && (
            <div className="mb-6 space-y-2">
              <h3 className="text-lg font-semibold text-white mb-3">Final Scores:</h3>
              {scores.map((score, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span className="text-gray-300">{score.name}</span>
                  <span className="font-bold text-white">{score.score}</span>
                </div>
              ))}
            </div>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-full transition-all hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-4">Loading QuizClash...</h2>
          <p className="text-gray-300">Connecting to game room...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (serverError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full border border-red-500/20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Connection Error</h2>
          <p className="text-red-300 mb-6">{serverError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 px-8 rounded-full transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Waiting room screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto pt-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">QuizClash</h1>
            <p className="text-gray-300">Waiting for game to start...</p>
          </div>

          {/* Game Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4">
                <Users className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-300">Room</div>
                  <div className="font-semibold text-white">{setId}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4">
                <Trophy className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-300">You</div>
                  <div className="font-semibold text-white">{name}</div>
                </div>
              </div>
            </div>
            {/* Players List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Players ({players.length})
              </h3>
              <div className="space-y-2">
                {players.map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{player.name?.charAt(0) || 'P'}</span>
                      </div>
                      <span className="text-white font-medium">{player.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{player.score || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

 {/* Leave Game button */}
      <button
        onClick={leaveGame}
        className="bg-red-500 text-white font-semibold px-4 py-2 rounded shadow-md left-0 mb-4 mt-8 ml-auto"
      >
        Leave Game
      </button>

            {/* Status */}
            {feedback && (
              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-center">{feedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">QuizClash</h1>

          {/* User Info badges */}
          <div className="flex justify-center gap-4 flex-wrap mt-2">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <Users className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300">Room: {setId}</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <Trophy className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300">You: {name}</span>
            </div>
          </div>
        </div>

      
      {/* Leave Game button */}
      <button
        onClick={leaveGame}
        className="bg-red-600 text-white font-semibold px-4 py-2 rounded shadow-md"
      >
        Leave Game
      </button>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3 border border-white/20">
            <Clock className="w-5 h-5 text-gray-300" />
            <span className={`text-lg font-semibold ${getTimerColor()}`}>
              {seconds}s
            </span>
          </div>
        </div>

        {/* Status/Feedback */}
        {feedback && (
          <div className="text-center mb-6">
            <div className="inline-block bg-blue-500/20 border border-blue-500/30 rounded-full px-6 py-2">
              <span className="text-blue-300">{feedback}</span>
            </div>
          </div>
        )}

        {/* Question & Options */}
        {currentQuestion && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              {currentQuestion.question}
            </h2>
            
            {/* Question Image */}
            {currentQuestion.image && (
              <div className="mb-6 text-center">
                <img
                  src={currentQuestion.image}
                  alt="Question"
                  className="rounded-2xl max-w-full max-h-64 w-auto h-auto object-contain border-2 border-purple-400/50 shadow-lg mx-auto"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.answers && currentQuestion.answers.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={!isQuestionActive || isLocked || answered}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    selectedAnswerIndex === idx
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  } ${!isQuestionActive || isLocked || answered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selectedAnswerIndex === idx && <ArrowRight className="w-5 h-5 ml-2" />}
                  </div>
                </button>
              ))}   
            </div>

            {/* Lock status */}
            {isLocked && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
                <p className="text-red-300">You are locked out for this question!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizClash;