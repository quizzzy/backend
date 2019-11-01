import { Request, Response } from "express";

/**
 * GET /quiz
 * Quiz page.
 */
export const index = (req: Request, res: Response) => {
    res.end("Quiz page");
};
