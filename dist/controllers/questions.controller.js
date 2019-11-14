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
Object.defineProperty(exports, "__esModule", { value: true });
const question_model_1 = require("../models/question.model");
/**
 * GET /api/questions
 */
exports.getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield question_model_1.Question.find()
        .populate("answers")
        .sort("order")
        .then(questions => {
        res.send(questions);
    });
});
/**
 * Get /api/questions/:id
 */
exports.getQuestion = (req, res) => {
    const { id } = req.params;
    question_model_1.Question.find({ _id: id }).then(questtion => {
        res.send(questtion);
    });
};
//# sourceMappingURL=questions.controller.js.map