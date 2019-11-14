"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Schema.Types.ObjectId;
const questionScheme = new mongoose_1.Schema({
    order: Number,
    description: String,
    isReverted: Boolean,
    answers: [
        {
            type: ObjectId,
            ref: "Answer",
        },
    ],
});
exports.Question = mongoose_1.model("Question", questionScheme);
//# sourceMappingURL=question.model.js.map