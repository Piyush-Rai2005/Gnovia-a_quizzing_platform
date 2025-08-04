  // controllers/questionController.js
  import redis from "../redis/redisClient.js";
  import { endGame,getRoomConfig } from "./multiplayerController.js";

  export async function askNewQuestion(io, room) {
  try {
    console.log(`📤 askNewQuestion called for room: ${room}`);
    const roomKey = `room:${room}`;
    const gameData = await redis.hGetAll(roomKey);
    if (!gameData.questions) {
      console.error("❌ No questions found in room data");
      return;
    }

    const { QUESTION_TIMER } = await getRoomConfig(room);
    const players = JSON.parse(gameData.players);
    const questions = JSON.parse(gameData.questions);
    const questionIndex = parseInt(gameData.questionIndex);

    players.forEach(p => p.locked = false);
    await redis.hSet(roomKey, "players", JSON.stringify(players));
    await redis.hSet(roomKey, "isQuestionActive", true);

    const question = questions[questionIndex];
    io.to(room).emit("newQuestion", {
      question: question.question,
      options: question.options,
      difficulty: question.difficulty,
      index: questionIndex + 1,
      total: questions.length
    });

    setTimeout(async () => {
      const isStillActive = await redis.hGet(roomKey, "isQuestionActive");
      if (isStillActive === 'true') {
        await redis.hSet(roomKey, "isQuestionActive", String(false));
        io.to(room).emit("answerResult", {
          correct: false,
          correctAnswer: question.answer,
          answeredBy: null
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
      }
    }, QUESTION_TIMER * 1000);

  } catch (err) {
    console.error("🔥 askNewQuestion crashed:", err);
  }
}
