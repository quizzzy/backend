import { Response, Request } from "express";

/**
 * GET /api/profile
 */
export const getProfiles = (req: Request, res: Response) => {
    res.end("Profile");
};

/**
 * Get /api/profile/:id
 */
export const getProfile = (req: Request, res: Response) => {
    res.end("Profile");
};

/**
 * Post /api/profile/:id
 */
export const postProfile = (req: Request, res: Response) => {
    res.end("Profile");
};