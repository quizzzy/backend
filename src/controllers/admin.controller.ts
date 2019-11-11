import { Request, Response } from "express";
import { User } from "../models/user.model";
import { SECRET } from "../util/secrets";
import jwt from "jsonwebtoken";

/**
 * Get /admin
 */
export const index = (req: Request, res: Response) => {
    res.send(200);
};

/**
 * Post /admin/login
 */
export const login = (req: Request, res: Response) => {
    console.log("body", req.body);
    const { login, password } = req.body;
    User.findOne({ login }, function(err, user: any) {
        if (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal error please try again"
            });
        } else if (!user) {
            res.status(401).json({
                error: "Incorrect email or password"
            });
        } else {
            user.isCorrectPassword(password, function(err: any, same: any) {
                if (err) {
                    res.status(500).json({
                        error: "Internal error please try again"
                    });
                } else if (!same) {
                    res.status(401).json({
                        error: "Incorrect email or password"
                    });
                } else {
                    const payload = { login };
                    const token = jwt.sign(payload, SECRET, {
                        expiresIn: "1h"
                    });
                    res.send(token);
                }
            });
        }
    });
};

/**
 * Post /admin/logout
 */
export const logout = (req: Request, res: Response) => {
    res.send(200);
};

/**
 * Get /admin/check-token
 */
export const checkToken = (req: Request, res: Response) => {
    res.send(200);
};
