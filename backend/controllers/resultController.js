import Questions from "../models/questionSchema.js";
import Result from "../models/resultSchema.js";
import questions, { answers } from '../database/data.js';

/** Get all results or filtered by setId */
export async function getResult(req, res) {
  try {
    const { setId } = req.query;
    const filter = setId ? { setId } : {};

    const results = await Result.find(filter);
    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error.message);
    res.status(500).json({ error: "Failed to fetch results." });
  }
}

/** Store a new result */
/** Store a new result */
export async function storeResult(req, res) {
  try {
      const { id } = req.params; 
    const { username, result, attempts, points } = req.body;

    if (!username || !result) {
      return res.status(400).json({ error: "Username, result are required." });
    }

    // Set pass/fail based on 50% of total possible points
    const questions = await Questions.find({ setId: id });

    const difficultyPoints = { Easy: 10, Medium: 20, Hard: 40 };
    const totalPossiblePoints = questions.reduce((acc, q) => acc + (difficultyPoints[q.difficulty] || 0), 0);

    const achieved = points >= totalPossiblePoints / 2 ? "Passed" : "Failed";

    const newResult = await Result.create({
      username,
      result,
      attempts,
      points,
      achieved,
      setId: id
    });

    res.status(201).json({
      msg: "Result saved successfully",
      data: newResult
    });

  } catch (error) {
    console.error("Error storing result:", error.message);
    res.status(500).json({ error: "Failed to store result." });
  }
}


/** Delete all results */
export async function dropResult(req, res) {
  try {
    await Result.deleteMany();
    res.json({ msg: "Results deleted successfully" });
  } catch (error) {
    console.error("Error deleting results:", error.message);
    res.status(500).json({ error: "Failed to delete results." });
  }
}
