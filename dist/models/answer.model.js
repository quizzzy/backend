"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const answerScheme = new mongoose_1.Schema({
    description: String,
    value: Number,
});
exports.Answer = mongoose_1.model("Answer", answerScheme);
//# sourceMappingURL=answer.model.js.map