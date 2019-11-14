import { Request, Response } from 'express';
import path from 'path';

/**
 * GET /quiz
 * Quiz page.
 */
export const index = (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname + '../public/quiz/build/index.html'));
};
