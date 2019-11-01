import { Response, Request } from "express";

/**
 * GET /api/answers
 */
export const getAnswers = (req: Request, res: Response) => {
    res.end("Answers");
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