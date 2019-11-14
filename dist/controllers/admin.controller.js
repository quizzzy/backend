"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const profile_model_1 = require("../models/profile.model");
const scale_model_1 = require("../models/scale.model");
const secrets_1 = require("../util/secrets");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
/**
 * Get /admin
 */
exports.index = (req, res) => {
    res.sendFile(path_1.default.join(__dirname + './../public/admin/build/index.html'));
};
/**
 * Post /admin/login
 */
exports.login = (req, res) => {
    console.log('body', req.body);
    const { login, password } = req.body;
    user_model_1.User.findOne({ login }, function (err, user) {
        if (err) {
            console.error(err);
            res.status(500).json({
                error: 'Internal error please try again',
            });
        }
        else if (!user) {
            res.status(401).json({
                error: 'Incorrect email or password',
            });
        }
        else {
            user.isCorrectPassword(password, function (err, same) {
                if (err) {
                    res.status(500).json({
                        error: 'Internal error please try again',
                    });
                }
                else if (!same) {
                    res.status(401).json({
                        error: 'Incorrect email or password',
                    });
                }
                else {
                    const payload = { login };
                    const token = jsonwebtoken_1.default.sign(payload, secrets_1.SECRET, {
                        expiresIn: '1h',
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
exports.logout = (req, res) => {
    res.send(200);
};
/**
 * Get /admin/check-token
 */
exports.checkToken = (req, res) => {
    res.send(200);
};
exports.getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statistics = {};
    const profiles = yield profile_model_1.Profile.find();
    const scales = yield scale_model_1.Scale.find();
    statistics.completedProfiles = profiles.length;
    statistics.scales = [];
    scales.forEach((scale) => {
        const scaleStat = {};
        scaleStat.title = scale.title;
        scaleStat.value = 0;
        profiles.forEach((profile) => {
            profile.scales.forEach((profileScale) => {
                if (profileScale.scaleId._id.toString() == scale._id.toString()) {
                    scaleStat.value += profileScale.value;
                }
            });
        });
        scaleStat.value = Math.round(scaleStat.value / statistics.completedProfiles);
        statistics.scales.push(scaleStat);
    });
    res.json(statistics);
});
//# sourceMappingURL=admin.controller.js.map