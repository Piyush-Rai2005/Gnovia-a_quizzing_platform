import Questions from "../models/questionSchema.js";
import Result from "../models/resultSchema.js";
import questions, { answers } from '../database/data.js'

/** to get all questions */
export async function getQuestion(req,res){
    try {
        const q = await Questions.find();
        res.json(q)
    } catch (error) {
        res.json({error})
    }
}

/** insert all questions */
export async function insertQuestions(req,res){
    try {
        const questionData = {
            questions: questions,
            answers: answers,
        };
        await Questions.insertMany([questionData]);
        res.json({ msg: "Data saved successfully" });
    } catch (error) {
        res.json({error})
    }
}

/** Delete all Questions */
export async function dropQuestions(req,res){
    try {
    await Questions.deleteMany();
    res.json({msg: "Questions deleted successfully"})
    } catch (error) {
        res.json({error})
    }
}

/** get all result */
export async function getResult(req,res){
    try {
        const r = await Result.find()
        res.json(r)
    } catch (error) {
        res.json({error})
    }
}

/** post all result */
export async function storeResult(req,res){
    try {
        const {username, result, attempts, points, achieved} = req.body;
        if(!username  && !result){
            throw new Error('Data not provided')
        }
        const newResult = await Result.create({ username, result, attempts, points, achieved });
        res.json({msg: "Result saved successfully"});
    } catch (error) {
        res.json({error})
    }
}

/** delete all result */
export async function dropResult(req,res){
    try {
        await Result.deleteMany();
        res.json({msg: "Result deleted successfully"});
    } catch (error) {
        res.json({error})
    }
}