import { Request, Response } from "express";

/**
 * GET /admin
 * Admin page.
 */
export const index = (req: Request, res: Response) => {
    res.end("Admin page");
};
