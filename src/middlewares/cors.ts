import { Request, Response, NextFunction } from "express";

export default function(req: Request, res: Response, next: NextFunction) {
	const origins: string[] = ["http://localhost:3001"];

	for (let i: number = 0; i < origins.length; i++) {
		const origin: string = origins[i];

		if (req.headers.origin.indexOf(origin) > -1) {
			res.header("Access-Control-Allow-Origin", req.headers.origin);
		}
	}

	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
}
