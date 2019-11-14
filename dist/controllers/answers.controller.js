"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const answer_model_1 = require("../models/answer.model");
/**
 * GET /api/answers
 */
exports.getAnswers = (req, res) => {
    answer_model_1.Answer.find().then(answer => {
        res.send(answer);
    });
};
/**
 * Get /api/answer/:id
 */
exports.getAnswer = (req, res) => {
    res.end("Answer");
};
/**
 * Post /api/answer/:id
 */
exports.postAnswer = (req, res) => {
    res.end("Answer");
};
//# sourceMappingURL=answers.controller.js.map