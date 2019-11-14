import { Request, Response, NextFunction } from "express";
import { SECRET } from "../util/secrets";
import jwt from "jsonwebtoken";

const withAuth = function(req: any, res: Response, next: NextFunction) {
    console.log(req.cookies, req.cookies);
    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.cookies.token;

    if (!token) {
        res.status(401).send("Unauthorized: No token provided");
    } else {
        jwt.verify(token, SECRET, function(err: any, decoded: any) {
            if (err) {
                res.status(401).send("Unauthorized: Invalid token");
            } else {
                req.login = decoded.login;
                next();
            }
        });
    }
};

export default withAuth;
