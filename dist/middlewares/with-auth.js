"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = require("../util/secrets");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const withAuth = function (req, res, next) {
    console.log(req.cookies, req.cookies);
    const token = req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.cookies.token;
    if (!token) {
        res.status(401).send("Unauthorized: No token provided");
    }
    else {
        jsonwebtoken_1.default.verify(token, secrets_1.SECRET, function (err, decoded) {
            if (err) {
                res.status(401).send("Unauthorized: Invalid token");
            }
            else {
                req.login = decoded.login;
                next();
            }
        });
    }
};
exports.default = withAuth;
//# sourceMappingURL=with-auth.js.map