import { Response, Request } from "express";

/**
 * GET /api/question
 */
export const getQuestions = (req: Request, res: Response) => {
    res.end("Questions");
};

/**
 * Get /api/question/:id
 */
export const getQuestion = (req: Request, res: Response) => {
    res.end("Question");
};

/**
 * Post /api/question/:id
 */
export const postQuestion = (req: Request, res: Response) => {
    res.end("Question");
};