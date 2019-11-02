import { Response, Request } from "express";

/**
 * GET /api/scale
 */
export const getScales = (req: Request, res: Response) => {
    res.end("Scales");
};

/**
 * Get /api/scale/:id
 */
export const getScale = (req: Request, res: Response) => {
    res.end("Scale");
};

/**
 * Post /api/scale/:id
 */
export const postScale = (req: Request, res: Response) => {
    res.end("Scale");
};