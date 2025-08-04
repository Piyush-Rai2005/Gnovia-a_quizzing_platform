// controllers/multiplayerController.js
import { QuizSet } from "../../models/adminSchema.js";
import redis from "../redis/redisClient.js";
import { askNewQuestion } from "./questionController.js";

const DEFAULT_ROOM_SIZE = 2;
const DEFAULT_QUESTION_TIMER = 30;

const difficultyPoints = {
  easy: 5,
  medium: 10,
  hard: 15,
};

export async function getRoomConfig(room) {
  const roomKey = `room:${room}`;
  const ROOM_SIZE = parseInt(await redis.hGet(roomKey, "ROOM_SIZE")) || DEFAULT_ROOM_SIZE;
  const QUESTION_TIMER = parseInt(await redis.hGet(roomKey, "QUESTION_TIMER")) || DEFAULT_QUESTION_TIMER;
  return { ROOM_SIZE, QUESTION_TIMER };
} 

// JOIN ROOM
export async function handleJoinRoom(io, socket, { room, name, quizSetId, config = {} }) {
  socket.join(room);
  await redis.set(`socket:${socket.id}`, room); // Track socket

  const roomKey = `room:${room}`;
  const roomExists = await redis.exists(roomKey);

  if (!roomExists) {
    const quizSet = await QuizSet.findOne({ setId: quizSetId }).lean();
    if (!quizSet || !quizSet.questions) {
      return socket.emit("error", "Quiz not found or has no questions.");
    }

    const player = { id: socket.id, name, score: 0 };
    await redis.hSet(roomKey, {
      players: JSON.stringify([player]),
      questions: JSON.stringify(quizSet.questions),
      questionIndex: 0,
      isQuestionActive: String(false),
      ROOM_SIZE: config.roomSize || DEFAULT_ROOM_SIZE,
      QUESTION_TIMER: config.timer || DEFAULT_QUESTION_TIMER,
    });
  } else {
    let playersStr = await redis.hGet(roomKey, "players");
    let players = [];

    try {
      players = playersStr ? JSON.parse(playersStr) : [];
    } catch (err) {
      console.error("❌ Error parsing players JSON:", err);
    }

    // Prevent duplicates by name — update socket ID if name already exists
    const existingPlayer = players.find((p) => p.name === name);
    if (existingPlayer) {
      existingPlayer.id = socket.id;
    } else {
      players.push({ id: socket.id, name, score: 0 });
    }

    await redis.hSet(roomKey, "players", JSON.stringify(players));
  }

  const playersStr = await redis.hGet(roomKey, "players");
  const finalPlayers = playersStr ? JSON.parse(playersStr) : [];

  io.to(room).emit("message", `${name} has joined the game!`);
  io.to(room).emit("updatePlayers", finalPlayers);

  const { ROOM_SIZE } = await getRoomConfig(room);
  const isQuestionActive = await redis.hGet(roomKey, "isQuestionActive") === "true";

  const uniquePlayers = Array.from(new Set(finalPlayers.map(p => p.name)));
  if (uniquePlayers.length === ROOM_SIZE && !isQuestionActive) {
    await redis.hSet(roomKey, "isQuestionActive", String(true));
    io.to(room).emit("gameStart", { message: "The game is starting!" });
    setTimeout(() => askNewQuestion(io, room), 2000);
  }
}

// MANUAL START
export async function handleStartGame(io, socket, { room }) {
  const roomKey = `room:${room}`;
  const playersStr = await redis.hGet(roomKey, "players");
  const isQuestionActive = await redis.hGet(roomKey, "isQuestionActive");
  await redis.hSet(roomKey, "questions", JSON.stringify(questions));
  await redis.hSet(roomKey, "questionIndex", "0");

  if (!playersStr) return socket.emit("error", "Room not found or players not initialized.");
  if (isQuestionActive === "true") return socket.emit("error", "Game has already started.");

  const players = JSON.parse(playersStr);
  const uniquePlayers = Array.from(new Set(players.map(p => p.name)));
 console.log("🟢 Starting game, loading first question...");
  if (uniquePlayers.length < 2) {
    return socket.emit("error", "At least 2 players are required to start the game.");
  }

  await redis.hSet(roomKey, "isQuestionActive", String(true));
  io.to(room).emit("gameStart", { message: "The game is starting!" });
  setTimeout(() => askNewQuestion(io, room), 2000);
}

// SUBMIT ANSWER
export async function handleSubmitAnswer(io, socket, { room, answerIndex }) {
  const roomKey = `room:${room}`;
  const gameData = await redis.hGetAll(roomKey);
  if (!gameData.players || gameData.isQuestionActive === "false") return;

  const players = JSON.parse(gameData.players);
  const questions = JSON.parse(gameData.questions);
  const questionIndex = parseInt(gameData.questionIndex);
  const player = players.find((p) => p.id === socket.id);
  if (!player || player.locked) return;

  const question = questions[questionIndex];
  const correctIndex = question.options.indexOf(question.answer);
  const isCorrect = answerIndex === correctIndex;

  if (isCorrect) {
    await redis.hSet(roomKey, "isQuestionActive", String(false));
    const points = difficultyPoints[question.difficulty] || 0;
    player.score += points;

    io.to(room).emit("answerResult", {
      correct: true,
      correctAnswer: question.answer,
      answeredBy: player.name,
    });

    setTimeout(async () => {
      const newIndex = questionIndex + 1;
      if (newIndex < questions.length) {
        await redis.hSet(roomKey, "questionIndex", String(newIndex));
        askNewQuestion(io, room);
      } else {
        endGame(io, room);
      }
    }, 3000);
  } else {
    player.locked = true;
    socket.emit("lockedOut", {
      message: "Wrong answer! You can't answer this question again.",
    });
  }

  await redis.hSet(roomKey, "players", JSON.stringify(players));
}
// MANUAL LEAVE GAME
export async function handleLeaveGame(io, socket) {
  console.log(`Manual leave: ${socket.id}`);
  await handleDisconnect(io, socket);
}

// DISCONNECT
export async function handleDisconnect(io, socket) {
  const socketKey = `socket:${socket.id}`;
  const room = await redis.get(socketKey);
  if (!room) return;

  const roomKey = `room:${room}`;
  let players = JSON.parse(await redis.hGet(roomKey, "players") || "[]");
  const disconnectedPlayer = players.find((p) => p.id === socket.id);

  if (disconnectedPlayer) {
    players = players.filter((p) => p.id !== socket.id);
    await redis.hSet(roomKey, "players", JSON.stringify(players));
    io.to(room).emit("message", `${disconnectedPlayer.name} has left the game.`);
    io.to(room).emit("updatePlayers", players);
  }

  if (players.length === 0) {
    await redis.del(roomKey);
  }

  await redis.del(socketKey);
  console.log(`User disconnected: ${socket.id}`);
}

// END GAME
export async function endGame(io, room) {
  const roomKey = `room:${room}`;
  const playersStr = await redis.hGet(roomKey, "players");
  if (!playersStr) return;

  const players = JSON.parse(playersStr);
  const sortedScores = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedScores[0] || null;

  io.to(room).emit("gameOver", { winner, scores: sortedScores });
  io.to(room).emit("message", "The game has ended. Thanks for playing!");
  await redis.del(roomKey);
}
