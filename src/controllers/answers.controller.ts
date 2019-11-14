import { Response, Request } from "express";
import { Answer } from "../models/answer.model";
/**
 * GET /api/answers
 */
export const getAnswers = (req: Request, res: Response) => {
    Answer.find().then(answer => {
        res.send(answer);
    });
};

/**
 * Get /api/answer/:id
 */
export const getAnswer = (req: Request, res: Response) => {
    res.end("Answer");
};

/**
 * Post /api/answer/:id
 */
export const postAnswer = (req: Request, res: Response) => {
    res.end("Answer");
};