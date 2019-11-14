"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Schema.Types.ObjectId;
const profileScheme = new mongoose_1.Schema({
    questions: [{
            questionId: {
                type: ObjectId,
                ref: "Question"
            },
            answerId: {
                type: ObjectId,
                ref: "Answer"
            }
        }],
    scales: [{
            scaleId: {
                type: ObjectId,
                ref: "Scale"
            },
            value: Number,
        }],
});
exports.Profile = mongoose_1.model("Profile", profileScheme);
//# sourceMappingURL=profile.model.js.map