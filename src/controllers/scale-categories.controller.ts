import { Response, Request } from "express";

/**
 * GET /api/scale-category
 */
export const getScaleCategories = (req: Request, res: Response) => {
    res.end("ScaleCategories");
};

/**
 * Get /api/scale-category/:id
 */
export const getScaleCategory = (req: Request, res: Response) => {
    res.end("ScaleCategory");
};

/**
 * Post /api/scale-category/:id
 */
export const postScaleCategory = (req: Request, res: Response) => {
    res.end("ScaleCategory");
};
