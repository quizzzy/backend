import { Response, Request } from "express";
import { Question } from "../models/question.model";

/**
 * GET /api/questions
 */
export const getQuestions = async (req: Request, res: Response) => {
    await Question.find()
        .populate("answers")
        .sort('order')
        .then(questions => {
            res.send(questions);
        });
};

/**
 * Get /api/questions/:id
 */
export const getQuestion = (req: Request, res: Response) => {
    const { id } = req.params;
    Question.find({_id: id}).then(questtion => {
        res.send(questtion);
    });
};
