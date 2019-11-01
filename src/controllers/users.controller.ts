import { Response, Request } from "express";

/**
 * GET /api/user
 */
export const getUsers = (req: Request, res: Response) => {
    res.end("Users");
};

/**
 * Get /api/user/:id
 */
export const getUser = (req: Request, res: Response) => {
    res.end("User");
};

/**
 * Post /api/user/:id
 */
export const postUser = (req: Request, res: Response) => {
    res.end("User");
};