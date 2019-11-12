import { Response, Request } from 'express';
import { Scale } from '../models/scale.model';

/**
 * GET /api/scale
 */
export const getScales = async (req: Request, res: Response) => {
	const scales = await Scale.find().populate({
		path: 'categories.categoryId',
	});

	res.json(scales);
};

/**
 * Get /api/scale/:id
 */
export const getScale = (req: Request, res: Response) => {
	res.end('Scale');
};

/**
 * Post /api/scale/:id
 */
export const postScale = (req: Request, res: Response) => {
	res.end('Scale');
};
